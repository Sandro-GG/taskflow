import TaskCard from './components/TaskCard';
import type { Task } from './types';
import Column from './components/Column';
import { useEffect, useState } from 'react';
import TaskModal from './components/TaskModal';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

const API_URL = import.meta.env.VITE_API_URL as string;

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    }

    loadTasks()
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false)

  async function deleteTask(id: string) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    })
    setTasks(tasks.filter(t => t.id !== id))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index) return;
    const newStatus = result.destination.droppableId.replace(' ', '_').toUpperCase();
    const updatedTasks = tasks.map(t => {
      if (t.id === result.draggableId) {
        return { ...t, status: newStatus as Task['status'] }
      }
      return t;
    });

    const originalTasks = tasks;
    setTasks(updatedTasks);

    fetch(`${API_URL}/tasks/${result.draggableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).then(response => {
      if (!response.ok) throw new Error();
    }).catch(() => {
      setTasks(originalTasks);
      alert("Server sync failed. Task moved back.");
    })

  }

  async function handleAddTask(title: string, description: string) {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    const data = await response.json();
    setTasks([...tasks, data]);
  }

  const query = searchQuery.toLowerCase();

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query) ||
    t.description.toLowerCase().includes(query)
  );

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">TaskFlow</h1>
            <input className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-blue-600" placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Add Task
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Column
              title="To Do"
              tasks={filteredTasks.filter(t => t.status === 'TO_DO')}
              onDelete={deleteTask}
            />
            <Column
              title="In Progress"
              tasks={filteredTasks.filter(t => t.status === 'IN_PROGRESS')}
              onDelete={deleteTask}
            />
            <Column
              title="Done"
              tasks={filteredTasks.filter(t => t.status === 'DONE')}
              onDelete={deleteTask}
            />
          </div>
        </div>
      </DragDropContext>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}

export default App;