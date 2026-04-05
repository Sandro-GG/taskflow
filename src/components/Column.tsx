import TaskCard from './TaskCard';
import type { Task } from '../types';
import { Droppable } from '@hello-pangea/dnd';

interface Props {
    title: string;
    status: Task['status'];
    tasks: Task[];
    onDelete: (id: string) => void
    onEdit: (task: Task) => void
}

export default function Column({ title, status, tasks, onDelete, onEdit }: Props) {
    return (
        <div className="flex flex-col gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <h2 className="text-slate-200 font-bold uppercase text-sm tracking-widest">{title}</h2>
            <Droppable droppableId={status}>
                {(provided) => (
                    <div 
                        className="flex flex-col min-h-[100px]"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {tasks.map((t, index) => (
                            <TaskCard className="mb-3" key={t.id} task={t} onDelete={onDelete} index={index} onEdit={onEdit} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}