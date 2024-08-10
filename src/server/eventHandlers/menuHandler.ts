import { addMenu, deleteItem, updateItem, viewItem } from '../controllers/adminController';
import handleError from '../socketHandlers/errorHandler';

const handleMenuActions = {
  viewMenu: async (socket) => {
    try {
      const menuItem = await viewItem();
      menuItem ? socket.emit('menuItemSuccess', menuItem) : socket.emit('error');
    } catch (error) {
      handleError(socket, error, 'Error viewing item');
    }
  },

  addMenu: async (socket, { id, name, category, price, availability }) => {
    try {
      const menuItem = await addMenu(id, name, category, price, availability);
      menuItem ? socket.emit('itemAdded', menuItem) : socket.emit('error', 'Invalid Details');
    } catch (error) {
      handleError(socket, error, 'Error adding menu');
    }
  },

  deleteMenuItem: async (socket, { id }) => {
    try {
      const menuItem = await deleteItem(id);
      menuItem ? socket.emit('itemDeleted', menuItem) : socket.emit('error', 'Invalid Id');
    } catch (error) {
      handleError(socket, error, 'Error deleting item');
    }
  },

  updateMenu: async (socket, { id, name, category, price, availability }) => {
    try {
      const menuItem = await updateItem(id, name, category, price, availability);
      menuItem ? socket.emit('itemUpdated', menuItem) : socket.emit('error', 'Invalid Id');
    } catch (error) {
      handleError(socket, error, 'Error updating item');
    }
  }
};

export default handleMenuActions;
