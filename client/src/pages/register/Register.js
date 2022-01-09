import React, {useEffect, useState, useCallback, useContext} from 'react';
import styles from './Register.module.css';
import {useHttp} from '../../hooks/http.hook';
const initialState =  {username: '', password: ''}

export default function Register() {
    const {request} = useHttp();

    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState(false);
    const [dataIncorrect, setDataIncorrect] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setError(false);
        }, 1000);
    }, [error])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    }

    const registerHandler = async() => {
        const data = await request(`http://localhost:3600/api/auth/register`, "POST", {...formData});

        if(!data) {
            setDataIncorrect(true);
            setError(true);
            setTimeout(()=>{
                setDataIncorrect(false);
            }, 500);
        } else {
            window.location.href = '/login';
        }
    }

    return(
        <div className={styles.container}>
            <div className={dataIncorrect ? `${styles.register} ${styles.shake} ` : styles.register}>
                <label for="admin-register">register</label>
                <form name="admin-register">
                    <input 
                        placeholder="email" 
                        type="text" 
                        name="email" 
                        value={formData.email}
                        className={!formData.email && error ? `${styles.email} ${styles.missing}` : `${styles.email}` }
                        onChange={e => handleChange(e)}
                    />
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

                <button type="button" onClick={registerHandler}>sign up</button>
                <div className={styles.register_button} onClick={()=>{window.location.href="/login"}}>Have an account?</div>
            </div>
        </div>
    );
}