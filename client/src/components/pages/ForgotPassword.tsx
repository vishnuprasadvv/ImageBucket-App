import { sendOtpApi } from '@/api/userApi'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ForgotPassword:React.FC = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState('')
    const validateEmail = (email:string):boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email)
    }
    useEffect(() => {
        if(email.length === 0 ){
            setEmailError('Please enter email')
        }
        if(email.length > 0 && !validateEmail(email)){
            setEmailError('Invalid email address')
        }else{
            setEmailError('')
        }
        
    },[email])
    const handleSendOtp = async() => {
        if(email.length === 0) {
            setEmailError('Please enter email')
        }
        try {
            const resonse = sendOtpApi(email)

            await toast.promise(resonse ,{
              loading: 'Sending OTP',
              success: (data) => {
                return data.message || 'OTP sent successfully'
              },
              error:(err) => {
                return err?.message || "Failed to send OTP. Try again!"
              }
            })
            sessionStorage.setItem('email',email)
            navigate('/reset-password')

        } catch (error:any) {
          toast.error(error.response.data.message || 'Error sending OTP')
            console.error('send otp failed', error)
        }
    }
  return (
    <div className="h-screen flex items-center justify-center text-slate-800 max-w-screen">
    <div className="bg-slate-100 p-4 flex flex-col gap-4 w-full sm:w-1/2 lg:w-1/3">
      <div>
        <h3 className="text-xl font-bold">Forgot password</h3>
      </div>
        <div className="text-start">
          <input
            id="email"
            type="email"
            className="mt-1 p-2 border w-full"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
               
          />
          {emailError.length > 0 && (
            <p className="text-red-500 text-xs">{emailError}</p>
          )}
        </div>
        <button
        onClick={handleSendOtp}
        disabled = {emailError.length > 0 }
         className="bg-indigo-400 hover:bg-indigo-500 rounded-none py-2 mt-2 w-full text-white">
          Confirm
        </button>
    </div>
  </div>
  )
}

export default ForgotPassword