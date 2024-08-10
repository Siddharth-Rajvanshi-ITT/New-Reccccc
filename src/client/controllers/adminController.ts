import { AdminService } from '../services/AdminService';
import { SocketController } from './socketController';
import { askQuestion } from '../utils/inputUtils';

export class AdminController {
  private adminService: AdminService;

  constructor(socketController: SocketController) {
    this.adminService = new AdminService(socketController);
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
          await this.adminService.addMenu();
          break;
        case '2':
          await this.adminService.deleteMenu();
          break;
        case '3':
          await this.adminService.updateMenu();
          break;
        case '4':
          await this.adminService.viewMenu();
          return;
        case '5':
          console.log('Exiting Admin Panel');
          return;
        default:
          console.log('Invalid option');
      }
    }
  }
}
