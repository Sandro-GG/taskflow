function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Task<span className="text-blue-500">Flow</span>
        </h1>
        <p className="text-slate-400 mt-2">
          TypeScript + React + Tailwind is officially live.
        </p>
        
        <div className="mt-6 flex gap-2">
          <div className="h-2 flex-1 bg-blue-500 rounded-full"></div>
          <div className="h-2 flex-1 bg-slate-800 rounded-full"></div>
          <div className="h-2 flex-1 bg-slate-800 rounded-full"></div>
        </div>
        
        <button className="mt-8 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all">
          Let's Build the Board
        </button>
      </div>
    </div>
  )
}

export default App