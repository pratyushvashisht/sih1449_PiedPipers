import React, {useContext, useState, useEffect} from 'react'
import AuthContext from '../context/AuthContext'
import { GiHamburgerMenu } from "react-icons/gi";
// import logo from '../assets/RedMax.png';
import logo from "../assets/Logo.png"
// Refer: https://medium.com/@sidbentifraouine/responsive-animated-top-navigation-bar-with-react-transition-group-fd0ccbfb4bbb
// for how header is made.

const Header = () => {
    // Get the variables and functions from context data in AuthContext
    let {user, logoutUser} = useContext(AuthContext)
    
    // For header navbar
    const [isNavVisible, setNavVisibility] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
  

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 700px)");
        mediaQuery.addEventListener([], handleMediaQueryChange(mediaQuery));
        
    
        return () => {
          mediaQuery.removeEventListener([], handleMediaQueryChange(mediaQuery));
        };
    }, []);


    const handleMediaQueryChange = mediaQuery => {
        if (mediaQuery.matches) {
          setIsSmallScreen(true);
        } else {
          setIsSmallScreen(false);
        }
    };

    const toggleNav = () => {
        setNavVisibility(!isNavVisible);
    };

    return (
        <header className='flex justify-between dashNav bg-gray-950 text-gray-200 pl-2 pr -1 py-2 mt-0 mb-0  top-0 left-0  '>

            <img src={logo} className='h-[40px]' alt='logo' />

            {user 
            ?   <nav className='flex justify-between'>
                    {/* If user is logged in */}
                    <a href="/dashboard" className='px-8 self-center'>Home </a>
                    <a href='/my-account' className='px-8 self-center'>Hello {user.username}! </a>
                    <a href="" className='px-8 self-center' onClick={logoutUser}> Logout </a>
                </nav>
            :   <nav className='self-center'>
                    {/* If user is logged out */}
                    <a href ="/login" className='p-4'> Login  </a>
                    <a href="/register" className='px-4 text-slate-200 h-4/5 py-1 self-center '> Register </a>
                </nav>
            }

            <button onClick={toggleNav} className="pr-4">
                <GiHamburgerMenu />
            </button>  
            
           
        </header>
    )
}

export default Header
