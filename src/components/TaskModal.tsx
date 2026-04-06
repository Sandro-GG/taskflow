import type { Task } from '../types';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL as string;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (title: string, description: string) => void;
    editingTask: Task | null;
    onUpdate: (id: string, title: string, description: string) => void;
}

export default function TaskModal({
    isOpen,
    onClose,
    onAdd,
    editingTask,
    onUpdate,
}: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [editingTask, isOpen]);

    if (!isOpen) return null;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        editingTask
            ? onUpdate(editingTask.id, title, description)
            : onAdd(title, description);

        setTitle('');
        setDescription('');
        setSuggestions([]);
        onClose();
    }

    function handleClose() {
        setTitle('');
        setDescription('');
        setSuggestions([]);
        onClose();
    }

    async function handleSuggest() {
        setIsLoadingSuggestions(true);
        try {
            const response = await fetch(`${API_URL}/tasks/suggest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description }),
            });
            const data = await response.json();
            setSuggestions(data.suggestions);
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
        } finally {
            setIsLoadingSuggestions(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b1220] p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="bg-gradient-to-r from-blue-300 to-violet-300 bg-clip-text text-2xl font-bold text-transparent">
                        {editingTask ? 'Edit Task' : 'New Task'}
                    </h2>

                    <input
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-blue-400/40 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        className="min-h-[120px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-blue-400/40 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button
                        type="button"
                        onClick={handleSuggest}
                        disabled={isLoadingSuggestions || !title}
                        className={`rounded-2xl px-4 py-3 font-semibold transition ${isLoadingSuggestions || !title
                                ? 'cursor-not-allowed border border-white/10 bg-white/5 text-slate-500'
                                : 'border border-violet-400/20 bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-[0_0_24px_rgba(99,102,241,0.22)] hover:scale-[1.01]'
                            }`}
                    >
                        {isLoadingSuggestions ? 'Thinking...' : '✨ Suggest Steps'}
                    </button>

                    {suggestions.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() =>
                                        setDescription((prev) =>
                                            prev ? `${prev}\n- ${suggestion}` : `- ${suggestion}`
                                        )
                                    }
                                    className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs text-blue-200 transition hover:bg-blue-400/15"
                                >
                                    + {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-xl px-4 py-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 px-4 py-2 font-semibold text-slate-950 shadow-[0_0_24px_rgba(59,130,246,0.22)] transition hover:scale-[1.02]"
                        >
                            {editingTask ? 'Save Changes' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}