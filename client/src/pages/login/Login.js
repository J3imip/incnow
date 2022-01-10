import React, {useState, useContext} from 'react';
import {AuthContext} from '../../context/AuthContext.js';
import { useHttp } from '../../hooks/http.hook.js';
import styles from './Login.module.css';

const initialState =  { username: '', password: '', expiresIn: '1h'} // inital login data

export default function Login() {
    const auth = useContext(AuthContext);
    const {request} = useHttp();

    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState(false);
    const [dataIncorrect, setDataIncorrect] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    }

    const handleRememberMeClick = () => {
        setRememberMe(!rememberMe);
    }

    const loginHandler = async() => {
        if(rememberMe) formData.expiresIn = '1y'; 
        const data = await request(`http://109.234.37.59:4000/api/auth/login`, 'POST', {...formData});

        if(!data) {
            setDataIncorrect(true);
            setError(true);
            setTimeout(()=>{
                setDataIncorrect(false);
            }, 500); // some states to figure out with animation on incorrect data
            setFormData(initialState);
        } else {
            auth.login(data.username, data.token, data.userId); 
            window.location.reload();
        }
    }

    return(
        <div className={styles.container}>
            <div className={dataIncorrect ? `${styles.login} ${styles.shake} ` : styles.login}>
                <label className={styles.adminLogin} htmlFor="admin-login">Login</label>
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
                <div className={styles.rememberMeContainer}>
                    <label htmlFor='rememberMe'>remember me</label>
                    <input type="checkbox" id='rememberMe' onClick={handleRememberMeClick}/>    
                </div>
                <div className={styles.register_button} onClick={()=>{window.location.href="/register"}}>Not a member yet?</div>
            </div>
        </div>
    );
}