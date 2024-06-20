import { createServer } from 'http';
import { Server } from 'socket.io';
import { pool } from './config/db';
import { RowDataPacket } from 'mysql2';
import { getUser } from './controllers/userController';
import { addMenu } from './controllers/adminController';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (msg) => {
    console.log('Message received: ' + msg);
    socket.emit('message', 'Hello from server');
  });
  socket.on("login", async ({ id, password }) => {
    try {
      // Execute the query to get all users
      const user = await getUser(id, password)
      if (user) {
        socket.emit("login", user)
      }
      else {
        socket.emit("error", "Invalid Credentials")
      }
      console.log("User = ", user)


    } catch (error) {
      console.error('Error fetching users:', error);
      socket.emit("error", "Invalid Credentials")
    }

  })

  socket.on("addMenu", async ({ id, name, category, price, availability}) => {

    console.log("Add menu");
    try {
      const menuItem = await addMenu(id, name, category, price, availability)
      if (menuItem) {
        socket.emit("itemAdded", menuItem)
      }
      else {
        socket.emit("error", "Invalid Credentials")
      }
      console.log("User = ", menuItem)


    } catch (error) {
      console.error('Error adding menu:', error);
      socket.emit("error", "Invalid details")
    }

  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

httpServer.listen(3000, () => {
  console.log('Server is listening on port 3000');
});