const express = require("express");
const app = express();

const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

let arr = [];
let playingArr = [];

io.on("connection", (socket) => {
    socket.on("find", (e) => {
        if (e.name != null) {
            arr.push(e);
            if (arr.length >= 2) {
                let p1Obj = {
                    name: arr[0].name,
                    value: "Red",
                    move: "",
                    socketID: arr[0].socketID
                }
                let p2Obj = {
                    name: arr[1].name,
                    value: "Yellow",
                    move: "",
                    socketID: arr[1].socketID
                }
                let obj = { //players
                    p1: p1Obj,
                    p2: p2Obj
                }

                playingArr.push(obj);
                arr.splice(0,2); //remove connected players
                io.emit("find", {allPlayers: playingArr});
            }
        }
    });

    socket.on("moveMade", (e) => {
        socket.broadcast.emit("update", (e));
    });
})

server.listen(5000, () => {
    console.log("SERVER RUNNING");
})