import React, { useState, useEffect } from 'react';

type Transaction = {
    id: string;
    category: string;
    amount: number;
    date: string;
    description: string;
};

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newDate, setNewDate] = useState('');

    // State for editing
    const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
    const [editCategory, setEditCategory] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editDate, setEditDate] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}transactions`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) throw new Error('Network response was not ok.');

            const result = await response.json();
            if (!Array.isArray(result.rows)) {
                console.error('Data is not an array:', result);
                throw new Error('Expected an array of transactions.');
            }
            setTransactions(result.rows);
        } catch (error) {
            console.error("Fetching transactions failed:", error);
        }
    };

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    category: newCategory, 
                    amount: Number(newAmount), 
                    description: newDescription, 
                    date: newDate,
                }),
            });

            if (!response.ok) throw new Error('Failed to create transaction');

            fetchTransactions(); // Re-fetch transactions to update the list
            // Reset form fields
            setNewCategory('');
            setNewAmount('');
            setNewDescription('');
            setNewDate('');
        } catch (error) {
            console.error("Error creating a new transaction:", error);
        }
    };

    const handleEditTransaction = async () => {
        if (!editingTransactionId) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}transactions/${editingTransactionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    category: editCategory,
                    amount: Number(editAmount),
                    description: editDescription,
                    date: editDate,
                }),
            });

            if (!response.ok) throw new Error('Failed to update transaction');

            fetchTransactions(); // Re-fetch transactions to update the list
            setEditingTransactionId(null); // Reset editing state
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    };

    const handleDeleteTransaction = async (transactionId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}transactions/${transactionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) throw new Error('Failed to delete transaction');

            fetchTransactions(); // Re-fetch transactions to update the list
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    return (
        <div>
            <h2>Transactions</h2>
            {/* Transaction form */}
            <form onSubmit={handleAddTransaction}>
                <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Category" required />
                <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="Amount" required />
                <input type="text" value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Description" required />
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} placeholder="Date" required />
                <button type="submit">Add Transaction</button>
            </form>
            <ul>
                {transactions.map(transaction => (
                    <li key={transaction.id}>
                        {editingTransactionId === transaction.id ? (
                            // Edit form
                            <>
                                <input type="text" value={editCategory} onChange={e => setEditCategory(e.target.value)} required />
                                <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} required />
                                <input type="text" value={editDescription} onChange={e => setEditDescription(e.target.value)} required />
                                <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} required />
                                <button onClick={handleEditTransaction}>Save</button>
                                <button onClick={() => setEditingTransactionId(null)}>Cancel</button>
                            </>
                        ) : (
                            // Display mode
                            <>
                                {transaction.date}: {transaction.category} - ${transaction.amount} ({transaction.description})
                                <button onClick={() => {
                                    setEditingTransactionId(transaction.id);
                                    setEditCategory(transaction.category);
                                    setEditAmount(transaction.amount.toString());
                                    setEditDescription(transaction.description);
                                    setEditDate(transaction.date);
                                }}>Edit</button>
                                <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Transactions;
