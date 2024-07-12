import { askQuestion } from '../utils/inputUtils';
import { SocketController } from './socketController';

export class ChefController {
  private socketController: SocketController;

  constructor(socketController: SocketController) {
    this.socketController = socketController;
  }

  public async handleUser(user: any) {
    console.log(`Welcome chef ${user.name}!`);
    while (true) {
      const action = await askQuestion(`
        Choose an action:
        1. View Menu
        2. Add rollout item
        3. View rollout item
        4. Submit daily menu 
        Enter action number: `);

      switch (action.trim()) {
        case '1':
          console.log("Entering view menu");
          await this.viewMenu();
          break;
        case '2':
          let category = await askQuestion(`
            Enter category to add to rollout: 
              1> Breakfast
              2> Lunch
              3> Dinner
            `);
          await this.rolloutItems(category);
          break;
        case '3':
          this.socketController.emit('getRolloutItems');
          break;
        case '4':
          category = await askQuestion(`
            Enter category to add to submit menu: 
              1> Breakfast
              2> Lunch
              3> Dinner
            `);
          this.submitDailyMenu()
          break;
        default:
          console.log('Invalid option');
      }
    }
  }

  private async submitDailyMenu(){

  }

  private async fetchTopVotedItems(){
    
  }

  private async rolloutItems(category: string) {
    this.socketController.emit('getRecommendedItems');

    let rollout_item = await askQuestion("Enter ID to add to rollout: ");

    this.socketController.emit('createNotification', { category, rolloutItemId: rollout_item });

    this.socketController.on('createNotificationSuccess', () => {
      console.log('Notification sent');
      this.socketController.emit('addRolloutItem', { rolloutItemId: rollout_item });
    });
  }

  private async viewMenu() {
    this.socketController.emit("viewMenu");
  }
}
