import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import User from "./models/user.model.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const mongodbUrl = process.env.MONGO_URL;

const connectDb = async () => {
  try {
    await mongoose.connect(mongodbUrl);
    console.log("MongoDb Connect...");
  } catch (error) {
    console.log("MongoDb Error", error);
  }
};

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_BASE_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  socket.on("identity", async(userId) => {
    socket.userId=userId
    await User.findByIdAndUpdate(userId,{
      socketId:socket.id,
      isOnline:tue
    })

  });

  socket.on("disconnect",async() => {
    if(!socket.userId) return;
    await User.findByIdAndUpdate(socket.userId,{
      socketId:null,
      isOnline:false
    })
  })

  socket.on("update-location",async({userId,latitude,longitude}) => {
    await User.findByIdAndUpdate(userId,{
      location:{
        type:"Point",
        coordinates:[longitude,latitude]
      }
    })
  })
});

server.listen(PORT, () => {
  console.log(`Server Started on ${PORT}`);
  connectDb();
});
