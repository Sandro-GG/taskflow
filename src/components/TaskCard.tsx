import type { Task } from '../types';
import { Draggable } from '@hello-pangea/dnd';

interface Props {
  task: Task;
  onDelete: (id: string) => void;
  index: number;
  onEdit: (task: Task) => void;
  className?: string;
}

const statusClasses: Record<Task['status'], string> = {
  TO_DO:
    'border border-amber-400/20 bg-amber-400/10 text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.10)]',
  IN_PROGRESS:
    'border border-blue-400/20 bg-blue-400/10 text-blue-200 shadow-[0_0_18px_rgba(96,165,250,0.10)]',
  DONE:
    'border border-emerald-400/20 bg-emerald-400/10 text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.10)]',
};

export default function TaskCard({ task, onDelete, index, onEdit, className }: Props) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group relative cursor-pointer rounded-2xl border border-white/10 bg-[#111827] p-4 transition-colors hover:border-blue-400/30 ${className || ''}`}
          onClick={() => onEdit(task)}
        >
          <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent opacity-60" />

          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold leading-tight text-white">
              {task.title}
            </h3>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="text-slate-500 transition hover:text-rose-400"
            >
              ✕
            </button>
          </div>

          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-400">
            {task.description}
          </p>

          <div className="mt-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${statusClasses[task.status]}`}
            >
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}