import { createServer } from 'http';
import { Server } from 'socket.io';
import sequelize from './config/database';
import setupSocketEvents from './socketHandlers';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

io.on('connection', setupSocketEvents);

httpServer.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
