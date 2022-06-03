import React, { createContext, useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import Pool from '../UserPool';
import { toggleStatus } from '../redux/UserSlice'
import { useDispatch } from 'react-redux';
import { Navigate } from "react-router-dom";

const AccountContext = createContext();

const Account = (props) => {


    const dispatch = useDispatch();
    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();

            if (user) {
                user.getSession((err, session) => {
                    if (err) {
                        reject();
                    } else {
                        resolve(session);
                    }
                })
            } else {
                reject();
            }
        });
    };
    const authenticate = async (Username, Password) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Username,
                Pool
            });

            const authDetails = new AuthenticationDetails({
                Username,
                Password
            });

            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    resolve(data);
                },
                onFailure: (err) => {
                    console.log('onFailure: ', err);
                    reject(err)
                },
                newPasswordRequired: (data) => {
                    console.log('newPasswordRequried: ', data);
                    resolve(data);
                },
            });
        })
    };

    const getUser = () => {
        const user = Pool.getCurrentUser();
        if (user) {
            return user;
        } else { console.log('error') }
    }

    const logout = () => {
        const user = Pool.getCurrentUser();
        if (user) {
            dispatch(toggleStatus(false));
            user.signOut();
            window.localStorage.setItem('userStatus', false);
        }
    }



    return (
        <>
            <AccountContext.Provider value={{ authenticate, getSession, logout, getUser }}>
                {props.children}

            </AccountContext.Provider>
        </>
    );
};

export { Account, AccountContext };