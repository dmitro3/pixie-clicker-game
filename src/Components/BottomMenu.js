import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom';

import menu_home from '../Resources/images/menu/new/home.svg';
import menu_improvements from '../Resources/images/menu/new/improvements.svg';
import menu_referrals from '../Resources/images/menu/new/referrals.svg';
import menu_leaderboard from '../Resources/images/menu/new/leaderboard.svg';
import menu_socials from '../Resources/images/menu/new/socials.svg';
import GameContext from "../Context/GameContext";

const BottomMenu = () => {
    const { userId } = useContext(GameContext);

    return (
        <div className="bottom_menu">
            <div className="bottom_menu-container">
                <NavLink to={"/" + userId} className="bottom_menu-item" activeClassName="active">
                    <img src={menu_home} alt=""/>
                </NavLink>
                <NavLink to="/improve" className="bottom_menu-item" activeClassName="active">
                    <img src={menu_improvements} alt=""/>
                </NavLink>
                <NavLink to="/earns" className="bottom_menu-item tasks" activeClassName="active">
                    <img src={menu_socials} alt=""/>
                </NavLink>
                <NavLink to="/referrals" className="bottom_menu-item" activeClassName="active">
                    <img src={menu_referrals} alt=""/>
                </NavLink>
                <NavLink to="/leaderboard" className="bottom_menu-item" activeClassName="active">
                    <img src={menu_leaderboard} alt=""/>
                </NavLink>
            </div>
        </div>
    );
};

export default BottomMenu;