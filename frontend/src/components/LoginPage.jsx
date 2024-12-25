import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password}),
            credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
            navigate('/home');
        } else {
            alert(data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div class = "input-box">
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div class = "input-box">
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Login</button>
            <div class = "register-link">
                Dont have an account ?
                <button type="button" onClick={() => navigate('../register')}>Register</button>
            </div>
        </form>
    );
};

export default LoginPage;
