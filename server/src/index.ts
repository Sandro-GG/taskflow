import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { client } from './db.js';
import prismaConfig from '../prisma.config.js';


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
        const newStatus = req.body['status']
        const updatedTask = await client.task.update({
            where: { id },
            data: { status: newStatus }
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