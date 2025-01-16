import { resetPasswordApi } from '@/api/userApi';
import { strongPasswordSchema } from '@/utils/zodPasswordValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';

type formData = {
 newPassword : string;
 confirmNewPassword: string;
}

const schema = z.object({
    newPassword : strongPasswordSchema,
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword , {
    message: 'Passwords do not match',
    path: ['confirmNewPassword']
}) 

const ResetPassword:React.FC = () => {

    const email = sessionStorage.getItem('email') || ''
    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const navigate = useNavigate()

    const {handleSubmit, register, formState:{errors}} = useForm<formData>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        reValidateMode: 'onChange'
    })

    const onSubmit = async(data: formData) => {
      console.log('hit')
      if(!email){
        toast.error('Please provide email detail first')
        return;
      }
      const inputOtp = otp.join('');
      if(inputOtp.length !== 4 ){
        toast.error('Please enter 4 digit valid OTP')
        return;
      }
        const {newPassword} = data;
        try {
            const response = await resetPasswordApi(email , inputOtp , newPassword) ;
            toast.success(response.message || 'Password changed successfully.')
            navigate('/login')
        } catch (error:any) {
            toast.error(error.response.data.message || 'Error resetting password')
            console.error('Error reseting password', error)
        }
    }

// Handle input change for each OTP field
const handleInputChange = (index: number, value: string) => {
  if (/^\d?$/.test(value)) {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Automatically move to the next field if value is entered
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }
};

// Handle backspace to move to the previous input
const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    inputRefs.current[index - 1]?.focus();
  }
};

  return (
    <div className="h-screen flex items-center justify-center text-slate-800 max-w-screen">
    <div className="bg-slate-100 p-5 flex flex-col gap-4 w-full sm:w-1/2 lg:w-1/3">
      <div>
        <h3 className="text-xl font-bold">Reset password</h3>
      </div>
        <div className="py-5 flex items-center justify-center gap-2">
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            name="otp"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            className="dark:bg-slate-700 w-[50px] h-[50px] text-2xl text-center border rounded-none border-gray-300 dark:border-slate-600"
          />
        ))}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full"
      >

        <div className="text-start">
          <input
            id="newPassword"
            type="password"
            className="mt-1 p-2 border w-full"
            placeholder="Enter new password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="text-start">
          <input
            id="confirmNewPassword"
            type="password"
            className="mt-1 p-2 border w-full"
            placeholder="Confirm new password"
            {...register("confirmNewPassword")}
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-xs">{errors.confirmNewPassword.message}</p>
          )}
        </div>

        <button type='submit'
        className="bg-indigo-400 hover:bg-indigo-500 rounded-none py-2 mt-2 text-white">
          Reset
        </button>

      </form>
    </div>
  </div>
  )
}

export default ResetPassword