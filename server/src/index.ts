import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { client } from './db.js';


const app = express();
app.use(cors());
app.use(express.json());


app.get('/tasks', async (req, res) => {
    res.json(await client.task.findMany());
});


app.listen(5050, () => {
    console.log("Server is running on port 5050");
})