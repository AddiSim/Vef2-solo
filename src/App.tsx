import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import Homepage from './components/Homepage';
import Budgets from './components/Budgets';
import Transactions from './components/Transactions';
import Categories from './components/Categories'; 
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/categories" element={<Categories />} /> 
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
