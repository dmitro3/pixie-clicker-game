import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import Index from "./Pages";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>
                {/*<Route path="/" element={<HomePage />} />*/}
                <Route path="/:id" element={<Index />} />
            </Routes>
        </Router>
    );
}

export default App;
