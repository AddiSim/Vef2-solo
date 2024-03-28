import React, { useState, useEffect } from 'react';

type Transaction = {
    id: string;
    category: string;
    amount: number;
    date: string;
    description: string;
};

const Homepage: React.FC = () => {
    const [latestTransactions, setLatestTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchLatestTransactions = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}transactions`);
                if (!response.ok) throw new Error('Network response was not ok.');
    
                const result = await response.json();
                // Access the 'rows' property directly for the array of transactions
                if (!Array.isArray(result.rows)) {
                    console.error('Data is not an array:', result);
                    throw new Error('Expected an array of transactions.');
                }
                // Assuming you want to display the transactions contained within 'rows'
                setLatestTransactions(result.rows.slice(0, 5)); // Adjust accordingly
            } catch (error) {
                console.error("Fetching latest transactions failed:", error);
            }
        };
    
        fetchLatestTransactions();
    }, []);
    

    return (
        <div>
            <h2>Welcome to Your Personal Finance Manager</h2>
            <div>
                <h3>Latest Transactions</h3>
                <ul>
                    {latestTransactions.map((transaction, index) => (
                        <li key={index}>
                            {transaction.date}: {transaction.category} - ${transaction.amount} ({transaction.description})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Homepage;
