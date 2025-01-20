import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DayDetailSales.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';

const DayDetailSales = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const storedId = localStorage.getItem('user_id');

    const data = [
        { day: '월', sales: 300 },
        { day: '화', sales: 450 },
        { day: '수', sales: 200 },
        { day: '목', sales: 400 },
        { day: '금', sales: 350 },
        { day: '토', sales: 500 },
        { day: '일', sales: 300 },
    ];

    const barData = [
        { name: "카푸치노", value: 40 },
        { name: "아메리카노", value: 30 },
        { name: "바닐라라떼", value: 20 },
        { name: "카라멜마끼아또", value: 10 },
    ];

    const COLORS = ["#cedfcd", "#c2c2ca", "#ffdba4", "#559abc"];

    return (
        <div className="day-detail-sales-container">
            <header className="day-detail-sales-header">
                <img src="/logo.png" alt="Logo" className="logo" />
                <h1 onClick={() => navigate(`/ceo-main?id=${storedId}`)} style={{ cursor: 'pointer' }}>SpotRank</h1>
                <div className="day-detail-button-group">
                    <button className="day-detail-sales-button" onClick={() => navigate(`/detail-sales?id=${storedId}`)}>나는 사장</button>
                    <button className="day-detail-sales-logout-button" onClick={() => navigate('/logout')}>Logout</button>
                </div>
            </header>

            <div className="day-content-container">
                <nav className="day-detail-sales-sidebar">
                    <ul>
                        <li onClick={() => navigate(`/detail-sales?id=${storedId}`)}>실시간</li>
                        <li onClick={() => navigate(`/day-detail-sales?id=${storedId}`)}>일간</li>
                        <li onClick={() => navigate(`/week-detail-sales?id=${storedId}`)}>주간</li>
                        <li onClick={() => navigate(`/month-detail-sales?id=${storedId}`)}>월간</li>
                        <li onClick={() => navigate(`/shop-edit?id=${storedId}`)}>정보 수정</li>
                    </ul>
                </nav>

                <main className="day-main-content">
                    <div className="day-chart-container">
                        <div className="day-line-chart">
                            <h3 style={{ textAlign: 'center', fontSize: '16px', marginTop: '15px', color: '#559abc' }}>요일별 매출 분석</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" stroke="#87CEEB" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="day-bar-chart">
                            <h3 style={{ textAlign: 'center', fontSize: '16px', marginTop: '15px', color: '#559abc' }}>요일별 메뉴 판매량</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <RechartsLegend />
                                    <Bar dataKey="value" fill="#87CEEB">
                                        {barData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DayDetailSales;