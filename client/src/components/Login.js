import React, { useState, useContext } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { AccountContext } from './Account';
import UserPool from '../UserPool';
import { useDispatch } from 'react-redux';
import { toggleStatus } from '../redux/UserSlice'

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate } from "react-router-dom";


const theme = createTheme();


const Login = () => {
    const [redirect, setRedirect] = useState(false);

    const dispatch = useDispatch();
    const { authenticate } = useContext(AccountContext);

    const onSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const username = data.get('username')
        const password = data.get('password')
        authenticate(username, password)
            .then(data => {
                console.log('Logged in!', data);
                dispatch(toggleStatus(true));
                setRedirect(true);

            })
            .catch(err => {
                console.error('Failed to login', err);
            })

    };

    const redirectTo = () => {
        if (redirect) {
            return <Navigate to='/' />
        }
    }

    return (
        <>
            {redirectTo()}
            <Grid
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: 0,
                    height: '100vh',
                    backgroundImage: 'url(https://source.unsplash.com/v2TtUBqrQnE/2560x1440)'
                }}
            >
                < ThemeProvider theme={theme} >

                    <Container component="main" maxWidth="xs" >
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 0,
                                backgroundColor: 'white',
                                padding: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',

                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>

                            <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign In
                                </Button>
                                <Grid container>
                                    <Grid item >

                                    </Grid>
                                    <Grid item>
                                        <Link to='/SignUp'>
                                            SignUp
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>

                </ThemeProvider >
            </Grid>
        </>
    );

};

export default Login;