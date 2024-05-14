import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import Index from "./Pages";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Leaderboard from "./Pages/leaderboard";

function App() {
    return (
        <Router>
            <Routes>
                {/*<Route path="/" element={<HomePage />} />*/}
                <Route path="/:id" element={<Index />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
        </Router>
    );
}

export default App;
