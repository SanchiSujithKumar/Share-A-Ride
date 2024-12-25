import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from './Context';
import RideCreationForm from "./RideCreationForm"; 

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const checkLoggedIn = async () => {
            const response = await fetch('http://localhost:5000/user/isLoggedIn', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.valid) {
                setName(data.user.username);
                setUser(data.user);
            }
            else
                navigate('/login');
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const logout = async () => {
        const response = await fetch('http://localhost:5000/user/logout', {
            method: 'POST',
            credentials:'include'
        });
        const data = await response.json();
        if (data.success) {
            navigate('/');
        } else {
            alert(data.message);
        }
    }

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <h2>Hello {name}</h2>
            <button type="button" onClick={logout}>Logout</button>
            <Context user={user}/>
            <RideCreationForm user={user}/>
        </div>
    );
};

export default HomePage;