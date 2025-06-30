import { ShieldAlert } from "lucide-react"

const AuthLayout = ( {children} ) => {

    return (
        <>
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
        
        {/* Dynamically able to change forms on the right side */}
         <div className="w-full md:w-1/2 flex items-center bg-blue-200 justify-center p-8">
            {children}
         </div>

         </div>
    </>    
    )
}

export default AuthLayout