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
import Socials from "./Pages/earns";
import Earns from "./Pages/earns";
import Coinsskins from "./Pages/coins";
import Coins from "./Pages/coins";
import Skins from "./Pages/skins";
import Families from "./Pages/families";

function App() {
    const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
    const [platform, setPlatform] = useState('unknown');

    useEffect(() => {
        WebApp.ready();
        WebApp.expand();
        // WebApp.EnableClosingConfirmation();

        // EnableClosingConfirmation

        if (WebAppUser.platform) {
            setPlatform(WebAppUser.platform);
        }
    }, []);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        if(WebAppUser.initDataUnsafe && WebAppUser.initDataUnsafe.user){
            if(WebAppUser.initDataUnsafe.user.language_code === 'ru'){
                i18n.changeLanguage("ru");
            }else if(WebAppUser.initDataUnsafe.user.language_code === 'uk'){
                i18n.changeLanguage("uk");
            }else if(WebAppUser.initDataUnsafe.user.language_code === 'fa'){
                i18n.changeLanguage("fa");
            }else if(WebAppUser.initDataUnsafe.user.language_code === 'fr'){
                i18n.changeLanguage("fr");
            }else{
                i18n.changeLanguage("en");
            }

            if(WebAppUser.initDataUnsafe.user.id === 5208434230){
                i18n.changeLanguage("en");
            }
            if(WebAppUser.initDataUnsafe.user.id === 393370256){
                i18n.changeLanguage("uk");
            }
        }else{
            i18n.changeLanguage("ru");
        }

        if (platform === 'ios' || platform === 'android') {
            setIsTelegramWebApp(true);
        } else {
            // setIsTelegramWebApp(true);
            setIsTelegramWebApp(false);
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
                                <Route path="/earns" element={<Earns/>}/>
                                <Route path="/coins" element={<Coins/>}/>
                                <Route path="/skins" element={<Skins/>}/>
                                <Route path="/families" element={<Families/>}/>
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