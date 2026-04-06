import TaskCard from './TaskCard';
import type { Task } from '../types';
import { Droppable } from '@hello-pangea/dnd';

interface Props {
    title: string;
    status: Task['status'];
    tasks: Task[];
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

const statusStyles: Record<
    Task['status'],
    {
        dot: string;
        title: string;
        ring: string;
        glow: string;
        badge: string;
    }
> = {
    TO_DO: {
        dot: 'bg-amber-400',
        title: 'text-amber-300',
        ring: 'border-amber-400/20',
        glow: 'shadow-[0_0_35px_rgba(251,191,36,0.08)]',
        badge: 'bg-amber-400/10 text-amber-200 border border-amber-400/15',
    },
    IN_PROGRESS: {
        dot: 'bg-blue-400',
        title: 'text-blue-300',
        ring: 'border-blue-400/20',
        glow: 'shadow-[0_0_35px_rgba(96,165,250,0.08)]',
        badge: 'bg-blue-400/10 text-blue-200 border border-blue-400/15',
    },
    DONE: {
        dot: 'bg-emerald-400',
        title: 'text-emerald-300',
        ring: 'border-emerald-400/20',
        glow: 'shadow-[0_0_35px_rgba(52,211,153,0.08)]',
        badge: 'bg-emerald-400/10 text-emerald-200 border border-emerald-400/15',
    },
};

export default function Column({ title, status, tasks, onDelete, onEdit }: Props) {
    const style = statusStyles[status];

    return (
        <div
            className={`rounded-3xl border bg-[#0b1220] p-5 ${style.ring}`}
        >
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${style.dot} shadow-[0_0_14px_currentColor]`} />
                    <h2 className={`text-sm font-extrabold uppercase tracking-[0.22em] ${style.title}`}>
                        {title}
                    </h2>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}>
                    {tasks.length}
                </span>
            </div>

            <Droppable droppableId={status}>
                {(provided) => (
                    <div
                        className="min-h-[520px] rounded-2xl border border-white/6 bg-[#0c1220] p-3"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {tasks.map((t, index) => (
                            <TaskCard
                                className="mb-3"
                                key={t.id}
                                task={t}
                                onDelete={onDelete}
                                index={index}
                                onEdit={onEdit}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}