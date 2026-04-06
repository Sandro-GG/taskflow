import type { Task } from './types';
import Column from './components/Column';
import { useEffect, useState } from 'react';
import TaskModal from './components/TaskModal';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

const API_URL = import.meta.env.VITE_API_URL as string;

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    };

    loadTasks();
  }, []);

  async function handleUpdateTask(id: string, title: string, description: string) {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      const data = await response.json();
      setTasks(tasks.map(t => (t.id === data.id ? data : t)));
    } catch (error) {
      console.error('Failed to edit task:', error);
    }
  }

  async function deleteTask(id: string) {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    })
    setTasks(tasks.filter(t => t.id !== id));
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index) return;

    const newStatus = result.destination.droppableId as Task['status'];
    const taskToMove = { ...tasks.find(t => t.id === result.draggableId)!, status: newStatus };
    const copyTasks = [...tasks];

    copyTasks.splice(
      copyTasks.findIndex(t => t.id === taskToMove.id),
      1
    );

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
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) throw new Error();
      })
      .catch(() => {
        setTasks(originalTasks);
        alert('Server sync failed. Task moved back.');
      });
  };

  async function handleAddTask(title: string, description: string) {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    const data = await response.json();
    setTasks([...tasks, data]);
  }

  function handleEditClick(task: Task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  const query = searchQuery.toLowerCase();

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(query) ||
    t.description.toLowerCase().includes(query)
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b14] text-white">

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="relative mx-auto max-w-7xl p-8">
          <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
              TaskFlow
            </h1>

            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <div className="relative">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none backdrop-blur-xl transition focus:border-blue-400/40 focus:ring-4 focus:ring-blue-500/10 md:w-[360px]"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-2xl border border-blue-400/20 bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 px-5 py-3 font-semibold text-slate-950 shadow-[0_0_30px_rgba(59,130,246,0.25)] transition hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(99,102,241,0.35)]"
              >
                + Add Task
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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