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
        5. View discardable items
        6. View discard item feedback
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
        case '5':
          await this.viewDiscardableItems(await askQuestion(`
            Enter category to add to submit menu: 
              1> Breakfast
              2> Lunch
              3> Dinner
            `))
        case '6':
          await this.viewDiscardItemFeedback();
          break;
          break;
        default:
          console.log('Invalid option');
      }
    }
  }

  private async viewDiscardItemFeedback() {
    const discardItemFeedbacks = await this.getMonthlyDiscardFeedbacks();

    console.log('Discard item feedbacks are:');
    console.table(discardItemFeedbacks);
  }

  public async getMonthlyDiscardFeedbacks() {
    return new Promise((resolve, reject) => {
      this.socketController.emit('getMonthlyDiscardFeedbacks');

      this.socketController.on('getMonthlyDiscardFeedbacksSuccess', (data) => {
        resolve(data);
      });

      this.socketController.on('getMonthlyDiscardFeedbacksError', (error: any) => {
        reject(new Error(error.message || 'Failed to fetch discard feedbacks'));
      });
    });
  }

  private async viewDiscardableItems(category) {
    const menu_type = category === '1' ? 'breakfast' : category === '2' ? 'lunch' : 'dinner';

    const choice = await this.promptDiscardChoice(menu_type);

    if (choice === 'Exit') {
      return;
    }

    const selectedItem = await this.promptDiscardItems(menu_type);

    if (!selectedItem) {
      console.log('No discardable items found');
      return;
    }

    if (choice === 'Discard Item') {
      console.log('Discarding items...', selectedItem);
      this.socketController.emit('discardItem', { items: selectedItem });
    } else if (choice === 'Ask employees for feedback') {
      console.log("Asking employees for feedback")
      this.socketController.emit('canCreateDiscardRollOut');
      await this.discardRollout(selectedItem);
    }

  }

  private async discardRollout(selectedItem: any) {
    return new Promise<void>((resolve) => {
      this.socketController.off('canCreateDiscardRollOutSuccess')

      this.socketController.on('canCreateDiscardRollOutSuccess', async (canCreateDiscardRollOut) => {
        if (canCreateDiscardRollOut) {
          this.socketController.emit('createDiscardRollOut', { items: selectedItem });
          console.log('Discard rollout created successfully');
        } else {
          console.log('Cannot create discard rollout as it has already been created for this month');
        }
        resolve();
      })
    })
  }

  private async promptDiscardItems(menu_type: string) {
    console.log("Inside promptDiscardItems")
    const menuItems: any = await this.getDiscardableItems(menu_type);
    console.log(" after menuitems Inside promptDiscardItems", menuItems)


    if (!menuItems.length) {
      return null;
    }

    console.log('Discardable items for', menu_type, 'are:')
    console.table(menuItems);

    const selectedItems = await this.promptUserForSelection(menuItems);

    return selectedItems;
  }

  private async promptUserForSelection(menuItems: any[]) {

    const selectedItemId = await askQuestion(`Enter menu item ID:`)

    return menuItems.filter((menuItem) => {
      return +selectedItemId === menuItem.id
    })[0];
  }

  private getDiscardableItems(menu_type: string) {
    return new Promise((resolve, reject) => {
      this.socketController.off('getDiscardableItemsSuccess')
      this.socketController.off('getDiscardableItemsError')
      this.socketController.emit('getDiscardableItems', { menu_type });

      this.socketController.on('getDiscardableItemsSuccess', (data) => {
        resolve(data);
      });

      this.socketController.on('getDiscardableItemsError', (error: any) => {
        reject(new Error(error.message || 'Failed to fetch recommended menu items'));
      });
    });
  }

  private async promptDiscardChoice(menu_type: string): Promise<string> {
    const choice = await askQuestion(`
    1> Discard Item
    2> Ask employees for feedback
    3> Exit`)

    const finalChoice = choice === '1' ? 'Discard Item' : choice === '2' ? 'Ask employees for feedback' : 'Exit';

    console.log('final choice', finalChoice)

    return finalChoice;
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

      console.log("getting topVotedItems")

      const topVotedItems = await this.getVoteItemsByDate(menu_type, vote_date) as any;

      console.log("got topVotedItems", topVotedItems)

      if (!topVotedItems.length) {
        console.log("No one has voted yet, please wait!");
        resolve(null);
        return
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
        console.log("getDailyItemSubmissionByDateSuccess", response)
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

    this.socketController.emit('getRecommendedItems', { menu_type: category });



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
