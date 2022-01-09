import React, { useContext, useState, useEffect } from 'react';
import styles from './Main.module.css';
import {Redirect} from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Main() {
    const auth = useContext(AuthContext);

    useEffect(() => {
        console.log(auth);
    }, [auth])

    return(
        <div className={styles.mainContainer}>
            <div className={styles.helloContainer}>
                Hello, {auth.username}
                <button type="button" onClick={()=>{
                    auth.logout()
                    window.location.reload()
                }}>Sign out</button>
            </div>
        </div>
    );
}