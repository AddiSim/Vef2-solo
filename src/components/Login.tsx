import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext'; // Adjust the import path as necessary

const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { setAuthToken, setUser } = useAuth(); // Make sure to destructure setUser as well
    const navigate = useNavigate();

    const handleLoginSuccess = (token: string, username: string) => {
        console.log("Login successful", token, username);
        localStorage.setItem('token', token);
        localStorage.setItem('user', username);
        console.log(token, username)
        setAuthToken(token);
        setUser(username); // Update the context with the user info
        navigate('/'); // Navigate to the homepage or dashboard
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
                handleLoginSuccess(data.token, data.user.username); // Pass the token and username to handleLoginSuccess
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
