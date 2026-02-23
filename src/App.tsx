import TaskCard from './components/TaskCard';
import type { Task } from './types';

function App() {

  const tasks: Task[] = [{
    id: '1',
    title: 'This is first task',
    description: 'Install Vite, React, and Tailwind v4. Fix the PostCSS errors.',
    status: 'TO_DO'
  }, {
    id: '2',
    title: 'This not the first task, it\'s second',
    description: 'Install Vite, React, and Tailwind v4. Fix the PostCSS errors.',
    status: 'IN_PROGRESS'
  }, {
    id: '3',
    title: 'Yet another task, wow, how cool',
    description: 'Install Vite, React, and Tailwind v4. Fix the PostCSS errors.',
    status: 'DONE'
  }
  ]

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">TaskFlow</h1>

        {/* We are "passing props" here. 'task' is the prop name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;