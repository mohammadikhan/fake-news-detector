
import { ShieldAlert } from "lucide-react"

const Header = () => {

    return (
        <>
        <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <ShieldAlert className="text-red-500" size={50}/>
                        </div>
                    <div>
                        <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                            FakeNews AI
                        </h2>
                        <h1 className="text-xs text-gray-500 dark:text-gray-400">
                            Powered by AI Detection
                        </h1>
                    </div>
                </div>

                </div>
            </div>
        </header>
      </>
    )
}

export default Header