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
          await this.rolloutItems(await askQuestion(`
            Enter category to add to rollout: 
              1> Breakfast
              2> Lunch
              3> Dinner
            `));
          break;
        case '3':
          this.socketController.emit('getRolloutItems');
          break;
        case '4':

          await this.submitDailyMenu(await askQuestion(`
            Enter category to add to submit menu: 
              1> Breakfast
              2> Lunch
              3> Dinner
            `))
          break;
        default:
          console.log('Invalid option');
      }
    }
  }

  private async submitDailyMenu(category) {
    return new Promise(async (resolve, reject) => {
      const menu_type = category === '1' ? 'breakfast' : category === '2' ? 'lunch' : 'dinner';
      const menu_date = new Date().toISOString().split('T')[0];

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const vote_date = yesterday.toISOString().split('T')[0];
      const alreadyExists = await this.checkExistingDailyMenu(menu_date, menu_type);

      if (!alreadyExists.create && !alreadyExists.modify) resolve(null);

      const topVotedItems = await this.getVoteItemsByDate(menu_type, vote_date) as any;

      if (!topVotedItems.length) {
        console.log("No one has voted yet, please wait!");
        resolve(null);
      }

      console.table(topVotedItems)

      const dailyMenuItem = await this.promptDailyMenu();

      if (alreadyExists.create) {
        console.log('Creating daily item submission...');
        this.socketController.emit('createDailyItemSubmission', { date: menu_date, menu_type });
        await this.createItemSubmissionListener(dailyMenuItem.item_id, dailyMenuItem.quantity);
      } else if (alreadyExists.modify) {
        console.log('Modifying daily item submission...');
        this.socketController.emit('updateDailyItemSubmission', { date: menu_date, menu_type });
        await this.updateItemSubmissionListener(dailyMenuItem.item_id, dailyMenuItem.quantity);
      }
      resolve(true)
    })

  }

  private async createItemSubmissionListener(item_id: number, quantity: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const successHandler = async () => {
        this.socketController.off('createDailyItemSubmissionSuccess', successHandler);
        this.socketController.off('createDailyItemSubmissionError', errorHandler);
        this.socketController.emit('createDailyMenuItem', { item_id, quantity });
        console.log('Daily item submission created successfully');
        resolve();
      };

      const errorHandler = (error: any) => {
        this.socketController.off('createDailyItemSubmissionSuccess', successHandler);
        this.socketController.off('createDailyItemSubmissionError', errorHandler);
        console.log('Error in creating daily item submission:', error);
        reject(error);
      };

      this.socketController.on('createDailyItemSubmissionSuccess', successHandler);
      this.socketController.on('createDailyItemSubmissionError', errorHandler);
    });
  }

  private async updateItemSubmissionListener(item_id: number, quantity: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const successHandler = async () => {
        this.socketController.off('updateDailyItemSubmissionSuccess', successHandler);
        this.socketController.off('updateDailyItemSubmissionError', errorHandler);
        this.socketController.emit('createDailyMenuItem', { item_id, quantity });
        console.log('Daily item submission updated successfully');
        resolve();
      };

      const errorHandler = (error: any) => {
        this.socketController.off('updateDailyItemSubmissionSuccess', successHandler);
        this.socketController.off('updateDailyItemSubmissionError', errorHandler);
        console.log('Error in updating daily item submission:', error);
        reject(error);
      };

      this.socketController.on('updateDailyItemSubmissionSuccess', successHandler);
      this.socketController.on('updateDailyItemSubmissionError', errorHandler);
    });
  }

  private async promptDailyMenu(): Promise<{ item_id: number, quantity: number }> {
    return new Promise(async (resolve, reject) => {
      const item_id = await askQuestion('Enter item ID: ');
      const quantity = await askQuestion('Enter quantity: ');
      resolve({ item_id: +item_id, quantity: +quantity });
    })
  }

  private async getVoteItemsByDate(category: string, date: string) {
    return new Promise((resolve, reject) => {
      this.socketController.emit('getVoteItemsByDate', { category, date });

      this.socketController.on('getVoteItemsByDateSuccess', (data) => {
        resolve(data);
      });

      this.socketController.on('getVoteItemsByDateError', (error: any) => {
        reject(new Error(error.message || 'Failed to fetch vote items'));
      });
    });
  }

  private async checkExistingDailyMenu(date: string, menu_type: string): Promise<{ create: boolean, modify: boolean }> {
    return new Promise((resolve, reject) => {
      this.socketController.emit('getDailyItemSubmissionByDate', { date });

      this.socketController.once('getDailyItemSubmissionByDateSuccess', (response) => {
        if (!response) {
          resolve({ create: true, modify: false });
        } else {
          if ((response.breakfast && menu_type === 'breakfast') ||
            (response.lunch && menu_type === 'lunch') ||
            (response.dinner && menu_type === 'dinner')) {
            console.log(`${menu_type.charAt(0).toUpperCase() + menu_type.slice(1)} already submitted for ${date}`);
            resolve({ create: false, modify: false });
          } else {
            resolve({ create: false, modify: true });
          }
        }
      });

      this.socketController.once('getDailyItemSubmissionByDateError', (error) => {
        reject(new Error(error.message));
      });
    });
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
