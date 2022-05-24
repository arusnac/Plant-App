import React, { useState, useContext } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { AccountContext } from './Account';
import UserPool from '../UserPool';



const Login = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { authenticate } = useContext(AccountContext);

    const onSubmit = (event) => {
        event.preventDefault();

        authenticate(username, password)
            .then(data => {
                console.log('Logged in!', data);
            })
            .catch(err => {
                console.error('Failed to login', err);
            })

    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label htmlFor='username'>Username</label>
                <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}></input>
                <label htmlFor='password'>password</label>
                <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}></input>
                <button type='submit'>Login</button>
            </form>
        </div>
    );
};

export default Login;