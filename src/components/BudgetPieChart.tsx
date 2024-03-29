import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components for the pie chart
Chart.register(ArcElement, Tooltip, Legend);

const BudgetPieChart = ({ budgetAmount, spentAmount }: { budgetAmount: number, spentAmount: number }) => {
    const data = {
        labels: ['Spent', 'Remaining'],
        datasets: [
            {
                data: [spentAmount, budgetAmount - spentAmount],
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB'],
            },
        ],
    };

    const options = {
        maintainAspectRatio: true, // Set to false if you want to ignore aspect ratio
        aspectRatio: 1, // Makes the chart a square if maintainAspectRatio is true, adjust as needed
        // Add other options here
    };

    return <Pie data={data} options={options} />;
};

export default BudgetPieChart;
