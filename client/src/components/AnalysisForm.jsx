import Card from "./ui/Card"
import { Clock } from "lucide-react"
const AnalysisForm = () => {

    return(
        <>
            <div className="m-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="lg:col-span-2" title="Article Analysis">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Paste an article or URL to analyze its credibility using AI-powered detection
                        </p>
                        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700"></div>
                        <h4 className="text-sm font-semibold mb-4 text-gray-800 dark:text-white">Article Content</h4>
                        <Clock size={16}/>
                    </Card>
                </div>
            </div>            
        </>
    )
}

export default AnalysisForm