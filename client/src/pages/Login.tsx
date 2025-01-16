import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { loginUserApi } from '../api/userApi';
import toast from 'react-hot-toast';
import {useDispatch, useSelector} from 'react-redux'
import { loggedIn } from '@/features/userSlice';
import { RootState } from '@/app/store';

type formData = {
    email : string, 
    password: string
}

const loginSchema = z.object({
    email: z.string().email({message: 'invalid email address'}),
    password: z.string({required_error: 'Please enter password'})
})
const Login:React.FC = () => {

    const navigate  = useNavigate();
    const dispatch = useDispatch()
    const {isAuthenticated} = useSelector((state:RootState) => state.user)

    useEffect(()=> {
      if(!isAuthenticated){
        navigate('/login')
      }
    },[])

    const {register, handleSubmit, formState:{errors}} = useForm<formData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange', 
        reValidateMode: 'onChange'
    })


    const onSubmit = async(data:formData) => {
        const {email, password} = data;
        try {
            const response = await loginUserApi(email, password)
            toast.success(response.message || 'Login successful.')
            console.log(response)
            dispatch(loggedIn({user: response.data.user}))
            navigate('/')
        } catch (error:any) {
            toast.error(error.response.data.message || 'Login failed')
            console.error('Login failed', error)
        }
    }

  return (
    <div className="h-screen flex items-center justify-center text-slate-800 max-w-screen">
    <div className="bg-slate-100 p-4 flex flex-col gap-4 w-full sm:w-1/2 lg:w-1/3">
      <div>
        <h3 className="text-xl font-bold">Login</h3>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full"
      >
        <div className="text-start">
          <input
            id="email"
            type="email"
            className="mt-1 p-2 border w-full"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
       
        <div className="text-start">
          <input
            id="password"
            type="password"
            className="mt-1 p-2 border w-full"
            placeholder="Enter password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>
        <Link to={'/forgot-password'} className='text-start text-sm underline hover:text-indigo-500'>Forgot Password</Link>
        <button className="bg-indigo-400 hover:bg-indigo-500 rounded-none py-2 mt-2 text-white">
          Login
        </button>
      </form>
      <div>
        <span> Don't have an account? </span>
        <Link to={"/signup"} className="text-indigo-600 font-semibold ">
          Signup
        </Link>
      </div>
    </div>
  </div>
  )
}

export default Login