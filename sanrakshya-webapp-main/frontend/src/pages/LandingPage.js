import React, { useState, useEffect, useContext } from 'react'
import Header from '../components/Header'
import image from "../assets/backdrop.jpg"
import logo from "../assets/Logo.png";
// <link href="https://fonts.googleapis.com/css2?family=Bree+Serif&display=swap" rel="stylesheet"></link>


const LandingPage = () => {

    return (
        <div className="overflow-x-hidden">
            <Header />
            <div style={{ backgroundImage:`url(${image})` }} className={'h-screen w-full bg-no-repeat bg-cover flex justify-between'}>
                <div className={'text-gray-200 font-semibold text-6xl pl-16 w-1/2 self-center'}>
                    Simplify Security and Compliance
                </div>
                <div className={'text-gray-200 font-semibold text-8xl w-1/2 text-center self-center'}>
                    <img src={logo} className='w-full' alt='logo' />
                </div>
            </div>
        </div>
    )
}

export default LandingPage
