

const Card = ({title, children}) => {
    return (
        <div className="bg-white dark:bg-gray-500 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            {title && (
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    {title}
                </h2>
            )}
            <div className="space-y-4">{children}</div>
        </div>
    )
}

export default Card