import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("API is running");
});


app.listen(5050, () => {
    console.log("Server is running on port 5050");
})