import setupEventHandlers from './eventHandlers';
import handleLogin from '../eventHandlers/loginHandler';
import handleMenuActions from '../eventHandlers/menuHandler';
import handleRolloutActions from '../eventHandlers/rolloutHandler';

const setupSocketEvents = (socket) => {
  setupEventHandlers(socket);

  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    socket.emit('message', 'Hello from server');
  });

  socket.on('login', async (credentials) => handleLogin(socket, credentials));
  socket.on('viewMenu', async () => handleMenuActions.viewMenu(socket));
  socket.on('addMenu', async (menuDetails) => handleMenuActions.addMenu(socket, menuDetails));
  socket.on('deleteMenuItem', async (menuDetails) => handleMenuActions.deleteMenuItem(socket, menuDetails));
  socket.on('updateMenu', async (menuDetails) => handleMenuActions.updateMenu(socket, menuDetails));

  socket.on('addRolloutItem', async (rolloutItemDetails) => handleRolloutActions.addRolloutItem(socket, rolloutItemDetails));
  socket.on('getRolloutItems', async () => handleRolloutActions.getRolloutItems(socket));

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
};

export default setupSocketEvents;
