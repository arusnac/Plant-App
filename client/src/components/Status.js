import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './Account';
import styles from './Account.module.css'


const Status = () => {
    const [status, setStatus] = useState(false);
    const { getSession, logout, getUser } = useContext(AccountContext);
    const [username, setUsername] = useState('');

    useEffect(() => {
        getSession().then((session) => {
            setUsername(session.accessToken.payload.username);
            // console.log('session: ', session.accessToken.payload.username);
            setStatus(true);
        });
    }, []);

    return (
        <div className={styles.status}>{status ?
            <div><button
                onClick={logout}>Logout</button></div> : 'Please login'}
            <h3 className={styles.userName}>{`Welcome ${username}`}</h3>
        </div>
    )
};

export default Status;