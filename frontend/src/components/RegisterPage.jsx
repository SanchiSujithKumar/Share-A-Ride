import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('Male');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, gender, password }),
        });
        const data = await response.json();
        if (data.success) {
            navigate('/login');
        } else {
            alert(data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div class = "input-box">
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div class = "input-box">
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <select
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)} 
                required
                >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                </select>
            </div>
            <div class = "input-box">
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Register</button>
            <div class = "login-link">
                Already have an account
                <button type="button" onClick={() => navigate('../login')}>Login</button>
            </div>            
        </form>
    );
};

export default RegisterPage;
