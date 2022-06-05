import http from "http";

// import { Server } from "socket.io";
// import { instrument } from "@socket.io/admin-ui";
// import express from "express";
import SocketIO from "socket.io";
import express from "express";


const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
//app.get("/*", (_, res) => res.redirect("/"));
//app.use('/css', express.static(dirname +'/node_modules/bootstrap/dist/css'));/app.use('/js', express.static(dirname +'/node_modules/bootstrap/dist/js'));

const httpServer = http.createServer(app);

const wsServer = SocketIO(httpServer);
// const wsServer = new Server(httpServer, {
//   cors: {
//     origin: ["https://admin.socket.io"],
//     credentials: true,
//   },
// });

// instrument(wsServer, {
//   auth: false,
// });

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});


const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);