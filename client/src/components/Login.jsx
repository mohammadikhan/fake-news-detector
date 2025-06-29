import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import DarkModeToggle from "react-dark-mode-toggle"

const Login = () => {
  
  return (
    
    
        <div className="min-h-screen flex">
            {/* Left Side */}
            <div className="hidden md:flex md:w-1/2 bg-gray-600 items-center justify-center p-12">
                <div className="max-w-md text-white">
                    <div className="flex items-center gap-2 mb-8">
                        <ShieldAlert className="w-40 h-40 text-red-400"/>
                    <div>
                        <h1 className="text-4xl font-bold">FakeNews AI</h1>
                        <p className="text-base text-gray-300 mt-1 dark:text-gray-400">Powered by AI Detection</p>
                    </div>
                </div>
            </div>
        </div>
                    
            
            {/* Right Side */}
            <div className="w-full md:w-1/2 flex items-center bg-blue-200 justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="md:hidden flex justify-center mb-10">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="w-13 h-13 text-red-400"/>
                            <div>
                                <h1 className="text-3xl font-bold">FakeNews AI</h1>
                                <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">Powered by AI Detection</p>
                            </div>
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white">
                        <h1 className="text-center font-bold">Welcome Back!</h1>
                        <p className="text-center"> Sign in to your account</p>

                        <form className="space-y-6 mt-5">
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300"
                                        placeholder="your@email.com"
                                    />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300"
                                        placeholder="Password"
                                    />
                            </div>

                            <div className="flex items-center justify-between">
                                <a href="#" className="text-sm text-black hover:underline">
                                    Forgot Password?
                                </a>
                            </div>

                            <button type="submit" className="w-full py-3 px-4 bg-gray-300 hover:bg-gray-400 text-black font-medium rounded-m">
                                Sign In
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <a href="#" className="text-blue-500 hover:underline">
                                    Register
                                </a>
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
        
        
    
  )
};

export default Login;