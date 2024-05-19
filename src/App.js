import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import Index from "./Pages";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Leaderboard from "./Pages/leaderboard";
import Layout from "./Layout";
import Referrals from "./Pages/referrals";
import Improvements from "./Pages/improvements";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/:id" element={<Index />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/referrals" element={<Referrals />} />
                    <Route path="/improve" element={<Improvements />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
