import { Socket } from 'socket.io';
import MenuAttributesController from '../controllers/menuAttributes';

const menuAttributesController = new MenuAttributesController();

export default class MenuAttributesEventHandler {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    listen() {
        this.socket.on('createMenuAttribute', async (data) => {
            await menuAttributesController.createMenuAttribute(this.socket, data);
        });
        this.socket.on('getMenuAttributes', async () => {
            await menuAttributesController.getAllMenuAttributes(this.socket);
        });
        this.socket.on('getMenuAttribute', async (data) => {
            await menuAttributesController.getMenuAttribute(this.socket, data);
        });
        this.socket.on('updateMenuAttribute', async (data) => {
            await menuAttributesController.updateMenuAttribute(this.socket, data);
        });
        this.socket.on('deleteMenuAttribute', async (data) => {
            await menuAttributesController.deleteMenuAttribute(this.socket, data);
        });
    }
}
