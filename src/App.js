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
    const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);

    useEffect(() => {
        const telegram = window.Telegram.WebApp;
        console.log(telegram);

        const initDataUnsafe = telegram.initDataUnsafe || {};
        const { platform } = initDataUnsafe;

        if (platform === 'ios' || platform === 'android') {
            setIsTelegramWebApp(true);
        } else {
            setIsTelegramWebApp(false);
        }
    }, []);

    return (
        <>
            {
                isTelegramWebApp ?
                    <Router>
                        <Routes>
                            <Route path="/" element={<Layout/>}>
                                <Route path="/:id" element={<Index/>}/>
                                <Route path="/leaderboard" element={<Leaderboard/>}/>
                                <Route path="/referrals" element={<Referrals/>}/>
                                <Route path="/improve" element={<Improvements/>}/>
                                <Route path="/bosts" element={<Improvements/>}/>
                            </Route>
                        </Routes>
                    </Router>
                    :
                    <>
                        <div className="just-webapp">
                            <span className="just-webapp-text">
                                Play on your mobile!
                            </span>
                            <a href="https://t.me/pixie_project_bot" className="just-webapp-link">*click*</a>
                        </div>
                    </>
            }
        </>
    );
}

export default App;
