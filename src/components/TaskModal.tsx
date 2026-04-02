import type { Task } from "../types";
import { useEffect, useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL as string;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (title: string, description: string) => void;
    editingTask: Task | null;
    onUpdate: (id: string, title: string, description: string) => void;
}

export default function TaskModal({ isOpen, onClose, onAdd, editingTask, onUpdate }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);

    if (!isOpen) return null;

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description);
        } else {
            setTitle('');
            setDescription('');
        }

    }, [editingTask, isOpen])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        editingTask ? onUpdate(editingTask.id, title, description) : onAdd(title, description);

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
            console.error("Failed to fetch suggestions:", error);
        } finally {
            setIsLoadingSuggestions(false);
        }
    }

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            onClick={handleClose}
        >
            <div 
                className="bg-slate-900 p-6 rounded-xl border border-slate-800 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-white">{editingTask ? "Edit Task" : "New Task"}</h2>
                    <input
                        className="bg-slate-800 p-2 rounded text-white"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="bg-slate-800 p-2 rounded text-white whitespace-pre-line"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={handleSuggest}
                        disabled={(isLoadingSuggestions || !title)}
                        className={`p-2 rounded font-medium transition-colors ${(isLoadingSuggestions || !title)
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-500'
                            }`}
                    >
                        {(isLoadingSuggestions) ? "Thinking..." : "✨ Suggest Steps"}
                    </button>
                    {suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setDescription(prev => prev ? `${prev}\n- ${suggestion}` : `- ${suggestion}`)}
                                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-3 py-1 rounded-full border border-slate-600 transition-all"
                                >
                                    + {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={handleClose} className="text-slate-400">Cancel</button>
                        <button type="submit" className="bg-blue-600 px-4 py-2 rounded">{editingTask ? "Save Changes" : "Create"}</button>
                    </div>
                </form>
            </div>
        </div>
    )

}