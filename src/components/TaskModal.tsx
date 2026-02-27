import type { Task } from "../types";
import { useState } from 'react';


interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (title: string, description: string) => void;
}

export default function TaskModal({ isOpen, onClose, onAdd }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        onAdd(title, description);
        setTitle('');
        setDescription('');
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-white">New Task</h2>
                    <input
                        className="bg-slate-800 p-2 rounded text-white"
                        placeholder="Task title"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="bg-slate-800 p-2 rounded text-white"
                        placeholder="Description"
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="text-slate-400">Cancel</button>
                        <button type="submit" className="bg-blue-600 px-4 py-2 rounded">Create</button>
                    </div>
                </form>
            </div>
        </div>
    )

}