import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import Index from "./Pages";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Leaderboard from "./Pages/leaderboard";
import Layout from "./Layout";
import Referrals from "./Pages/referrals";
import Improvements from "./Pages/improvements";
import Boosts from "./Pages/Boosts";
import WebApp from "@twa-dev/sdk";
import WebAppUser from "@twa-dev/sdk";
import {useTranslation} from "react-i18next";

function App() {
    const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
    const [platform, setPlatform] = useState('unknown');

    useEffect(() => {
        WebApp.ready();
        WebApp.expand();

        if (WebAppUser.platform) {
            setPlatform(WebAppUser.platform);
        }
    }, []);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        if(WebAppUser.initDataUnsafe && WebAppUser.initDataUnsafe.user){
            if(WebAppUser.initDataUnsafe.user.language_code === 'ru'){
                i18n.changeLanguage("ru");
            }else{
                i18n.changeLanguage("en");
            }
        }else{
            i18n.changeLanguage("ru");
        }

        if (platform === 'ios' || platform === 'android') {
            setIsTelegramWebApp(true);
        } else {
            setIsTelegramWebApp(true);
            // setIsTelegramWebApp(false);
        }
    }, [platform]);

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
                                <Route path="/boosts" element={<Boosts/>}/>
                            </Route>
                        </Routes>
                    </Router>
                    :
                    <>
                        <div className="just-webapp">
                            <span className="just-webapp-text">
                                {t('Play on your mobile!')}
                            </span>

                            <a href="https://t.me/pixie_project_bot" className="just-webapp-link">*{t('click')}*</a>

                            <span className="platform-name">{platform}</span>
                        </div>
                    </>
            }
        </>
    );
}

export default App;