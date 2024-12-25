import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Welcome to the Main Page!</h1>
            <button type="button" onClick={() => navigate('register')}>Go to Register</button>
            <button type="button" onClick={() => navigate('login')}>Go to Login</button>
        </div>
    );
};

export default MainPage;
