import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import Header from '../components/Header'
import image from "../assets/backdrop.jpg";


const LoginPage = () => {

    let { loginUser } = useContext(AuthContext)

    return (
        <div style={{ backgroundImage:`url(${image})` }} className={'h-screen w-full bg-no-repeat bg-cover'}>

            <Header />

            <form className="w-1/3  m-auto h-60 p-8 bg-white rounded-lg shadow-lg translate-y-1/3" onSubmit={loginUser}>
                <h3 className=" text-gray-900 font-medium text-xl p-2 text-center"><b>Login Here</b></h3>
                <div className={'p-2 w-full flex  flex-col h-full justify-around'}>
                <input type="text" placeholder="Email" name="email" className="w-full px-4 py-2  bg-slate-100 hover:shadow-lg hover:bg-slate-100 border-slate-200 ease-in-out duration-300 hover:border-slate-300 rounded-lg placeholder:text-slate-800"/>
                <input type="password" placeholder="Password" name="password"  className={"w-full px-4 py-2  bg-slate-100 hover:shadow-lg hover:bg-slate-100 border-slate-200  hover:border-slate-300 rounded-lg placeholder:text-slate-800"}/>
                <input type="submit" className="border-2 rounded-lg  bg-slate-800 text-slate-200 py-2  font-medium hover:text-slate-800 hover:bg-slate-200 border-slate-300 ease-in-out duration-300" />
                </div>

            </form>

        </div>
    )
}

export default LoginPage
