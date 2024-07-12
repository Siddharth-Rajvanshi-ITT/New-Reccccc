import { askQuestion } from '../utils/inputUtils';
import { SocketController } from './socketController';

export class AdminController {
  private socketController: SocketController;

  constructor(socketController: SocketController) {
    this.socketController = socketController;
  }

  public async handleUser(user: any) {
    console.log(`Welcome Admin ${user.name}!`);
    while (true) {
      const action = await askQuestion(`
        Choose an action:
        1. Add Menu
        2. Delete Menu
        3. Update Menu
        4. View Menu
        5. Exit
        Enter action number: `);

      switch (action.trim()) {
        case '1':
          await this.addMenu();
          break;
        case '2':
          await this.deleteMenu();
          break;
        case '3':
          await this.updateMenu();
          break;
        case '4':
          await this.viewMenu();
          return;
        case '5':
          console.log('Exiting Admin Panel');
          return;
        default:
          console.log('Invalid option');
      }
    }
  }

  private async addMenu() {
    const itemID = await askQuestion('Enter Menu ID: ');
    const itemName = await askQuestion('Enter Menu Name: ');
    const itemCategory = await askQuestion('Enter Menu Category: ');
    const itemPrice = await askQuestion('Enter Menu Price: ');
    const itemAvailability = await askQuestion('Enter Menu Availability Status: ');

    console.log("Item:", { id: itemID, name: itemName, category: itemCategory, price: itemPrice, availability: itemAvailability });

    this.socketController.emit('addMenu', { id: itemID, name: itemName, category: itemCategory, price: itemPrice, availability: itemAvailability });

    console.log("Item added after emit");
  }

  private async deleteMenu() {
    const menuId = await askQuestion('Enter Menu ID to delete: ');

    this.socketController.emit('deleteMenuItem', { id: parseInt(menuId) });
  }

  private async updateMenu() {
    const menuId = await askQuestion('Enter Menu ID to update: ');
    const name = await askQuestion('Enter new name: ');
    const category = await askQuestion('Enter new category: ');
    const price = await askQuestion('Enter new price: ');
    const availability = await askQuestion('Enter new availability: ');

    this.socketController.emit('updateMenu', { id: parseInt(menuId), name, category, price, availability });
  }

  private async viewMenu() {
    this.socketController.emit("viewMenu");
  }
}
