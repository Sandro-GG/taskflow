import TaskCard from './TaskCard';
import type { Task } from '../types';

interface Props {
    title: string;
    tasks: Task[];
    onDelete: (id: string) => void
}

export default function Column({ title, tasks, onDelete }: Props) {
    return (
        <div className="flex flex-col gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <h2 className="text-slate-200 font-bold uppercase text-sm tracking-widest">{title}</h2>
            {tasks.map((t) => (
                <TaskCard
                    key={t.id}
                    task={t}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}