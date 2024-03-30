import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

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
        maintainAspectRatio: true, 
        aspectRatio: 1, 
    };

    return <Pie data={data} options={options} />;
};

export default BudgetPieChart;
