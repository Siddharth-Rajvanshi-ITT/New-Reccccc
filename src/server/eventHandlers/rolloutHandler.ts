import chefController from '../controllers/chefController';
import handleError from '../socketHandlers/errorHandler';

const handleRolloutActions = {
  addRolloutItem: async (socket, { rolloutItemId }) => {
    try {
      await chefController.addToRolloutMenu(rolloutItemId);
    } catch (error) {
      handleError(socket, error, 'Error adding rollout item');
    }
  },

  getRolloutItems: async (socket) => {
    try {
      const items = await chefController.viewRolloutItems();
      socket.emit('getRolloutItemsSuccess', items);
    } catch (error) {
      handleError(socket, error, 'Error getting rollout items');
    }
  }
};

export default handleRolloutActions;
