import TaskCard from './components/TaskCard';
import type { Task } from './types';
import Column from './components/Column';
import { useEffect, useState } from 'react';
import TaskModal from './components/TaskModal';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';

const API_URL = import.meta.env.VITE_API_URL as string;

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    }

    loadTasks()
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false)

  async function handleUpdateTask(id: string, title: string, description: string) {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      const data = await response.json();
      setTasks(tasks.map(t => t.id === data.id ? data : t));
    } catch (error) {
      console.error("Failed to edit task:", error);
    }
  }

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

    const newStatus = result.destination.droppableId as Task['status'];
    const taskToMove = { ...tasks.find(t => t.id === result.draggableId)!, status: newStatus };
    const copyTasks = [...tasks];
    copyTasks.splice(copyTasks.findIndex(t => t.id === taskToMove.id), 1);
    const columnTasks = copyTasks.filter(t => t.status === taskToMove.status);
    const neighbor = columnTasks[result.destination.index];

    if (neighbor) {
      const finalIndex = copyTasks.indexOf(neighbor);
      copyTasks.splice(finalIndex, 0, taskToMove);
    } else {
      copyTasks.push(taskToMove);
    }

    const originalTasks = tasks;
    setTasks(copyTasks);

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

  function handleEditClick(task: Task) {
    setEditingTask(task);
    setIsModalOpen(true);
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
              status="TO_DO"
              tasks={filteredTasks.filter(t => t.status === 'TO_DO')}
              onDelete={deleteTask}
              onEdit={handleEditClick}
            />
            <Column
              title="In Progress"
              status="IN_PROGRESS"
              tasks={filteredTasks.filter(t => t.status === 'IN_PROGRESS')}
              onDelete={deleteTask}
              onEdit={handleEditClick}
            />
            <Column
              title="Done"
              status="DONE"
              tasks={filteredTasks.filter(t => t.status === 'DONE')}
              onDelete={deleteTask}
              onEdit={handleEditClick}
            />
          </div>
        </div>
      </DragDropContext>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onAdd={handleAddTask}
        editingTask={editingTask}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
}

export default App;