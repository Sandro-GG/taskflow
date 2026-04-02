import type { Task } from '../types';
import { Draggable } from '@hello-pangea/dnd';

interface Props {
  task: Task;
  onDelete: (id: string) => void;
  index: number
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onDelete, index, onEdit }: Props) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          onClick={() => onEdit(task)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group relative"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-white font-semibold">{task.title}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="text-slate-500 hover:text-red-500 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-1 whitespace-pre-line">{task.description}</p>
          <div className="mt-3">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-700 text-slate-300">
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}