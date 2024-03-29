// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Auth/ProtectedRoute'; // Adjust the import path as necessary
import Login from './components/Login';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import Homepage from './components/Homepage';
import Budgets from './components/Budgets';
import Transactions from './components/Transactions';
import Categories from './components/Categories';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute component={Homepage} />} />
        <Route path="/budgets" element={<ProtectedRoute component={Budgets} />} />
        <Route path="/transactions" element={<ProtectedRoute component={Transactions} />} />
        <Route path="/categories" element={<ProtectedRoute component={Categories} />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
