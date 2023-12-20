import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import Header from '../components/Header'


const RegisterPage = () => {

    let { registerUser } = useContext(AuthContext)

    return (
        <div className="registration">
            <Header />
            <br/><br/><br/><br/>
            <div>
                <div className='p-4 flex justify-center w-full '> Registration Form </div>
                <form onSubmit={registerUser} className="formRegister">
                    <div className={'w-full flex'}>
                        <div className={'m-auto '}>
                            <input type="text" name="full_name" placeholder="Enter Full Name" className='form-input' />
                            <input type="text" name="email" placeholder="Enter Email" className='form-input' />
                            <input type="password" name="password" placeholder="Enter Password" className='form-input' />
                            <input type="password" name="confirmPassword" placeholder="Enter Password Again" className='form-input' />

                            <input type="submit" className='form-submit-btn' />
                        </div>
                    </div>
                </form>
            </div>

        </div>

    )
}

export default RegisterPage
