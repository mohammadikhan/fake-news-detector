import AuthLayout from "./ui/AuthLayout"


const Register = () => {

    return(
        <AuthLayout>
            <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white">
                <h1 className="text-center font-bold">Create Your Account</h1>
                    <p className="text-center"> Fill in the belows fields to register</p>
                        <form className="space-y-6 mt-5">
                            
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                                <input
                                    type="string"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                                    placeholder="Name"
                                />
                        
                            <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                                    placeholder="Email"
                                />

                            <label className="block text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                                    placeholder="Password"
                                />

                            <label className="block text-sm font-medium mb-2"> Confirm Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                                    placeholder="Confirm Password"
                                />

                            <button type="submit" className="w-full py-3 px-4 bg-gray-300 hover:bg-gray-400 text-black font-medium rounded-m">
                                Register
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <a href="/register" className="text-blue-500 hover:underline">
                                    Sign In
                                </a>
                            </p>
                        </div>
                    </div>

        </AuthLayout>
    )
}

export default Register