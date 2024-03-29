import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext'; // Adjust the import path as needed

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  console.log("Current user in header:", user);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };
  return (
    <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f5f5f5'}}>
      <h1>Spara pening ofc</h1>
      <nav>
        <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
          <li style={{ display: 'inline', marginRight: '20px' }}><Link to="/">Home</Link></li>
          <li style={{ display: 'inline', marginRight: '20px' }}><Link to="/budgets">Budgets</Link></li>
          <li style={{ display: 'inline', marginRight: '20px' }}><Link to="/transactions">Transactions</Link></li>
          <li style={{ display: 'inline', marginRight: '20px' }}><Link to="/categories">Categories</Link></li>
        </ul>
      </nav>
      {user ? (
        <>
          Logged in as {user}
          <button onClick={handleLogout} style={{marginLeft: '20px', padding: '0.5rem 1rem', cursor: 'pointer'}}>Log Out</button>
        </>
      ) : (
        <button onClick={() => navigate('/login')} style={{marginLeft: '20px', padding: '0.5rem 1rem', cursor: 'pointer'}}>Log In</button>
      )}
    </header>
  );
};

export default Header;
