import React, { useContext } from 'react';
import styles from './Main.module.css';
import { AuthContext } from '../../context/AuthContext';

export default function Main() {
    const auth = useContext(AuthContext);

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