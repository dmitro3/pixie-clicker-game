import React from 'react';
import { Link } from 'react-router-dom';
import menu_firstImage from "../Resources/images/menu/first.svg";
import menu_secondImage from "../Resources/images/menu/second.svg";
import menu_thirdImage from "../Resources/images/menu/third.svg";
import menu_fourImage from "../Resources/images/menu/four.svg";

const BottomMenu = () => {
    return (
        <div className="bottom_menu">
            <div className="bottom_menu-container">
                <Link to={"/" + sessionStorage.telegram_user_id} className="bottom_menu-item">
                    <img src={menu_firstImage} alt=""/>
                </Link>
                <Link to="/improve" className="bottom_menu-item">
                    <img src={menu_secondImage} alt=""/>
                </Link>
                <Link to="/referrals" className="bottom_menu-item">
                    <img src={menu_thirdImage} alt=""/>
                </Link>
                <Link to="/leaderboard" className="bottom_menu-item">
                    <img src={menu_fourImage} alt=""/>
                </Link>
            </div>
        </div>
    );
};

export default BottomMenu;