import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header>
            <h1>Personal Finance Manager</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/budgets">Budgets</Link></li>
                    <li><Link to="/transactions">Transactions</Link></li>
                    <li><Link to="/categories">Categories</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
