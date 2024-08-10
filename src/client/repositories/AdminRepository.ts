import { SocketController } from '../controllers/socketController';

export class AdminRepository {
  private socketController: SocketController;

  constructor(socketController: SocketController) {
    this.socketController = socketController;
  }

  public addMenu(menuItem: any) {
    this.socketController.emit('addMenu', menuItem);
  }

  public deleteMenu(menuId: number) {
    this.socketController.emit('deleteMenuItem', { id: menuId });
  }

  public updateMenu(menuItem: any) {
    this.socketController.emit('updateMenu', menuItem);
  }

  public viewMenu() {
    this.socketController.emit("viewMenu");
  }
}
