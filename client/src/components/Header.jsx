
import { ShieldAlert } from "lucide-react"
import { useEffect, useState } from "react"
import DarkModeToggle from "react-dark-mode-toggle"

const Header = () => {

    const [isDarkMode, setIsDarkMode] = useState(() => false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('darkMode', 'false');
        }
    }, [isDarkMode])

    return (
        <>
        <header className={`transition-colors duration-300 ${ isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-md border-b`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <ShieldAlert className={`transition-colors duration-300 ${ isDarkMode ? 'text-red-500' : 'text-red-400'}`} size={50}/>
                        </div>
                    <div>
                        <h2 className={`transition-colors duration-300 text-xl font-medium ${ isDarkMode ? 'text-white' : "text-gray-900"} dark:text-white`}>
                            FakeNews AI
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Powered by AI Detection
                        </p>
                    </div>
                </div>

                <DarkModeToggle
                    onChange={setIsDarkMode}
                    checked={isDarkMode}
                    size={50}
                    speed={5.5}
                />
                </div>
            </div>
        </header>
      </>
    )
}

export default Header