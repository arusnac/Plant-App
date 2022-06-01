import SignUp from './SignUp';
import Login from './Login';
import { useContext } from 'react';
import { AccountContext } from './Account';



const LoginPage = () => {
    const { getSession, logout, getUser } = useContext(AccountContext);
    return (
        <div>
            <Login />

        </div>
    );
}

export default LoginPage;