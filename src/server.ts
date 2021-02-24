import 'reflect-metadata';
import express, { request, response } from 'express';
import "./database";

const app = express();

app.get("/", (request, response) => {
    return response.send("Hello World");
})

app.post("/", (request, response) => {
    return response.json({message: "Hello World"});
})


app.listen(3333, () => console.log("server runing!"));