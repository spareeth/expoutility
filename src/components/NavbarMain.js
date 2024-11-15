import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FaExternalLinkAlt } from "react-icons/fa";
import { NavLink, useLocation } from 'react-router-dom';
import { useSelectedFeatureContext } from '../contexts/SelectedFeatureContext';

const NavbarMain = () => {
    const { selectedView, selectedFeatureName } = useSelectedFeatureContext();
    const [showMenu, setShowMenu] = useState(false);

    const handleToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleLinkClick = () => {
        setShowMenu(false);
    };
    // const location = useLocation()
    // const collapseName = location.pathname.split("/")[1];



    return (
        <>
            <div className='navbar_main_container'>
                <div className='short_nav_container'>



                    <div className='logo_text'>
                        <h1>Expo City Dubai Utility trend</h1>
                    </div>

                    <div className={`main_nav ${showMenu ? 'show' : ''}`}>
                        <div className="nav__content">

                            <div className='nav__list'>
                                <NavLink
                                    className={({ isActive }) => (isActive ? 'active_nav' : 'nav__item')}

                                    to="/" onClick={handleLinkClick}>
                                    DEWA Charges
                                </NavLink>




                                <NavLink className={({ isActive }) => (isActive ? 'active_nav' : 'nav__item')}
                                    to="/dewa" onClick={handleLinkClick}>
                                    DEWA Consumption
                                </NavLink>




                                



                            </div>

                        </div>
                    </div>

                    <div className="navbar__toggle scrolled" onClick={handleToggle}>
                        {showMenu ? <FaTimes /> : <FaBars />}
                    </div>

                </div>



            </div>
        </>



    )
}

export default NavbarMain
