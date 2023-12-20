import React from "react";
import SearchBox from './SearchBox'
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../assets/Logo.png"

const Nav = ()=>{
    return(
        <div className=" flex justify-between dashNav text-gray-200 pl-2 pr -1 py-2 mt-0 mb-0  top-0 left-0  ">
            <div className="flex items-center">
                <img src={logo} className='h-[40px]' alt='logo' />
                {/*<span className="text-xl px-2">Sanrakshya</span>*/}
            </div>
            <div className="flex justify-between">
                <div className={'self-center'}><SearchBox /></div>
                <div className="text-lg pl-8 self-center flex gap-8">
                    <a href ="/Dashboard" className=''> Dashboard  </a>
                    <div className={'self-center'}>
                        <GiHamburgerMenu />
                    </div>

                </div>
            </div>
        </div>

    )
}

export default Nav