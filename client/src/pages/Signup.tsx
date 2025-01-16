import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { signupUserApi } from "../api/userApi";
import toast from "react-hot-toast";

type FormData = {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const signUpSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be atleast 10 characters" }),
    password: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do no match",
    path: ["confirmPassword"],
  });

const Signup: React.FC = () => {

    const navigate = useNavigate()
    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async(data: FormData) => {
    const {email, phone, password, confirmPassword} = data;
    try {
        const response = await signupUserApi(email, phone, password , confirmPassword)
        toast.success(response.message || 'User registered successfully.')
        navigate('/')
    } catch (error:any) {
        toast.error(error.response.data.message || 'User registration failed')
        console.error('Sign up error', error)
    }
  };
  return (
    <div className="h-screen flex items-center justify-center text-slate-800 max-w-screen">
      <div className="bg-slate-100 p-4 flex flex-col gap-4 w-full sm:w-1/2 lg:w-1/3">
        <div>
          <h3 className="text-xl font-bold">Sign up</h3>
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
              id="phone"
              type="phone"
              className="mt-1 p-2 border w-full"
              placeholder="Enter your phone"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
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
          <div className="text-start">
            <input
              id="confirmPassword"
              type="password"
              className="mt-1 p-2 border w-full"
              placeholder="Enter confirmPassword"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button className="bg-indigo-400 hover:bg-indigo-500 rounded-none py-2 mt-2 text-white">
            Signup
          </button>
        </form>
        <div>
          <span>Already have account? </span>
          <Link to={"/login"} className="text-indigo-600 font-semibold ">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
