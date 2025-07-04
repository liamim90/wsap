import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          WSAP Frontend
        </h1>
        <p className="text-gray-600 mb-6">
          Workflow based Agentic AI Service
        </p>
        <div className="card">
          <button 
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App 