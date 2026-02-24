import TaskCard from './TaskCard';
import type { Task } from '../types';
import { Droppable } from '@hello-pangea/dnd';

interface Props {
    title: string;
    tasks: Task[];
    onDelete: (id: string) => void
}

export default function Column({ title, tasks, onDelete }: Props) {
    return (
        <div className="flex flex-col gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <h2 className="text-slate-200 font-bold uppercase text-sm tracking-widest">{title}</h2>
            <Droppable droppableId={title}>
                {(provided) => (
                    <div 
                        className="flex flex-col gap-3 min-h-[100px]"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {tasks.map((t, index) => (
                            <TaskCard key={t.id} task={t} onDelete={onDelete} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}