import express from "express"
import "dotenv/config"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import cors from "cors"

import { connectDB } from "./lib/db.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json())

app.use(cors({
    origin: ['http://localhost:8081', 'exp://192.168.1.36:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use("/api/auth",authRoutes);
app.use("/api/books",bookRoutes);

app.listen(PORT,() => {
    console.log(`Server is Running on Port ${PORT}`);
    connectDB();
});