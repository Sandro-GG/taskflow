import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { client } from './db.js';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(cors());
app.use(express.json());


app.get('/tasks', async (req, res) => {
    res.json(await client.task.findMany());
});


app.post('/tasks', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = await client.task.create({
            data: { title, description }
        });
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create task" });
    }
});


app.post('/tasks/suggest', async (req, res) => {
    try {
        const { title, description } = req.body;
        const client = new Anthropic();
        const response = await client.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: `
                        Return ONLY a raw JSON array of 3 short strings representing sub-tasks for: ${title}. Description: ${description}. 
                        Do NOT include markdown code blocks, backticks, or any explanatory text. Example format: ["task 1", "task 2", "task 3"]
                    `.trim()
                }
            ]
        });
        const rawText = response.content[0]?.type === 'text' ? response.content[0].text : "";
        const suggestions = JSON.parse(rawText);
        res.json({ suggestions });
    } catch (error) {
        console.error("AI Suggestion Error:", error);
        res.status(500).json({ error: "Failed to fetch suggestions" });
    }
})


app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await client.task.delete({ where: { id } });
        res.sendStatus(204);
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).json({ error: "Task not found" });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
})


app.patch('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const updatedTask = await client.task.update({
            where: { id },
            data: { title, description, status }
        })
        res.json(updatedTask);
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).json({ error: "Task not found" });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
})


app.listen(5050, () => {
    console.log("Server is running on port 5050");
})