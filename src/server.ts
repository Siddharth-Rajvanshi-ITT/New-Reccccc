import { createServer } from 'http';
import { Server } from 'socket.io';
import { pool } from './config/db';
import { RowDataPacket } from 'mysql2';
import { getUser } from './controllers/userController';
import { addMenu, deleteItem,updateItem, viewItem } from './controllers/adminController';
import chefController from './controllers/chefController'
import sequelize from './config/database';
import { viewMenuItems } from './repositories/adminRepository';
import RecommendationEventHandler from './eventHandlers/recommendation';
import NotificationEventHandler from './eventHandlers/notification';
import VoteItemEventHandler from './eventHandlers/voteItems';
import DailyUserVoteEventHandler from './eventHandlers/dailyUserVote';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

io.on('connection', (socket) => {

  const recommendationEventHandler = new RecommendationEventHandler(socket)
  const notificationEventHandler = new NotificationEventHandler(socket)
  const voteItemEventHandler = new VoteItemEventHandler(socket)
  const dailyUserVoteSocketHandler = new DailyUserVoteEventHandler(socket)

  recommendationEventHandler.listen()
  notificationEventHandler.listen()
  voteItemEventHandler.listen()
  dailyUserVoteSocketHandler.listen()

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

  socket.on("viewMenu", async () => {

    console.log("viewing item")
    try {
      const menuItem = await viewItem()

      console.log("After try view")
      if (menuItem) {
        socket.emit("menuItemSuccess", menuItem)
      }
      else {
        socket.emit("error")
      }


    } catch (error) {
      console.error('Error viewing item:', error);
      socket.emit("error")
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

  socket.on("deleteMenuItem", async ({ id}) => {

    
    try {
      const menuItem = await deleteItem(id)
      if (menuItem) {
        socket.emit("itemDeleted", menuItem)
      }
      else {
        socket.emit("error", "Invalid Id")
      }
      console.log("Deleted item = ", menuItem)


    } catch (error) {
      console.error('Error deleting item:', error);
      socket.emit("error", "Invalid details")
    }

  })
  socket.on("updateMenu", async ({ id, name, category, price, availability}) => {

    console.log("Update menu");
    try {
      const menuItem = await updateItem(id, name, category, price, availability)
      if (menuItem) {
        socket.emit("itemUpdated", menuItem)
      }
      else {
        socket.emit("error", "Invalid Id")
      }
      console.log("Updated item = ", menuItem)


    } catch (error) {
      console.error('Error updating item:', error);
      socket.emit("error", "Invalid details")
    }

  })

  socket.on('addRolloutItem', async ({rolloutItemId}) =>{
      await chefController.addToRolloutMenu(rolloutItemId)
  })

  socket.on('getRolloutItems', async () =>{
    let items = await chefController.viewRolloutItems()

    console.log("Menu items:",items)

    socket.emit('getRolloutItemsSuccess', items)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

sequelize.sync({ alter: true })
    .then( () => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.log(error);
    });
httpServer.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

