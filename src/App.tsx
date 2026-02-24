import TaskCard from './components/TaskCard';
import type { Task } from './types';
import Column from './components/Column';
import { useState } from 'react';
import TaskModal from './components/TaskModal';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Setup Lab', description: 'Done with Phase 1', status: 'DONE' },
    { id: '2', title: 'Build Columns', description: 'Currently working on this', status: 'IN_PROGRESS' },
    { id: '3', title: 'Drag and Drop', description: 'Coming soon', status: 'TO_DO' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false)

  function deleteTask(id: string) {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index) return;
    const newStatus = result.destination.droppableId.replace(' ', '_').toUpperCase();
    const updatedTasks = tasks.map(t => {
        if (t.id === result.draggableId) {
          return {...t, status: newStatus as Task['status']}
        }
        return t;
    });
    setTasks(updatedTasks);
  }


  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">TaskFlow</h1>
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
              tasks={tasks.filter(t => t.status === 'TO_DO')}
              onDelete={deleteTask}
            />
            <Column
              title="In Progress"
              tasks={tasks.filter(t => t.status === 'IN_PROGRESS')}
              onDelete={deleteTask}
            />
            <Column
              title="Done"
              tasks={tasks.filter(t => t.status === 'DONE')}
              onDelete={deleteTask}
            />
          </div>
        </div>
      </DragDropContext>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(newTask) => setTasks([...tasks, newTask])}
      />
    </div>
  );
}

export default App;