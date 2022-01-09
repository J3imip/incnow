import React, {useEffect, useState, useCallback, useContext} from 'react';
import {AuthContext} from '../../context/AuthContext.js';
import { useHttp } from '../../hooks/http.hook.js';
import styles from './Login.module.css';

const initialState =  { username: '', password: ''}

export default function Login() {
    const auth = useContext(AuthContext);
    const {request} = useHttp();

    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState(false);
    const [dataIncorrect, setDataIncorrect] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    }

    const loginHandler = async() => {
        const data = await request(`http://localhost:3600/api/auth/login`, 'POST', {...formData});

        if(!data) {
            setDataIncorrect(true);
            setError(true);
            setTimeout(()=>{
                setDataIncorrect(false);
            }, 500)
            setFormData(initialState);
        } else {
            auth.login(data.username, data.token, data.userId);
            window.location.reload();
        }
    }

    return(
        <div className={styles.container}>
            <div className={dataIncorrect ? `${styles.login} ${styles.shake} ` : styles.login}>
                <label htmlFor="admin-login">Login</label>
                <form name="admin-login">
                    <input 
                        placeholder="username" 
                        type="text" 
                        name="username" 
                        value={formData.username}
                        className={!formData.username && error ? `${styles.username} ${styles.missing}` : `${styles.username}` }
                        onChange={e => handleChange(e)}
                    />
                    <input 
                        placeholder="password" 
                        type="password" 
                        name="password" 
                        value={formData.password}
                        className={!formData.password && error ? `${styles.password} ${styles.missing}` : `${styles.password}`}
                        onChange={e => handleChange(e)}
                    />
                </form>
                <button type="button" onClick={loginHandler}>continue</button>
                <div className={styles.register_button} onClick={()=>{window.location.href="/register"}}>Not a member yet?</div>
            </div>
        </div>
    );
}