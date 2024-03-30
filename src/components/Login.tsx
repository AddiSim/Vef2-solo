import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext'; 

const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { setAuthToken, setUser } = useAuth(); 
    const navigate = useNavigate();

    const handleLoginSuccess = (token: string, username: string, id: number) => {
        console.log("Login successful", token, username, id);
        localStorage.setItem('token', token);
        localStorage.setItem('user', username);
        localStorage.setItem('id', id.toString());
        console.log(token, username)
        setAuthToken(token);
        setUser(username); 
        navigate('/'); 
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                handleLoginSuccess(data.token, data.user.username, data.user.id); 
            } else {
                alert('Login failed: ' + data.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Log In</button>
        </form>
    );
};

export default Login;
