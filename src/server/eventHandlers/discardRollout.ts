import { Socket } from 'socket.io';
import DiscardRollOutController from '../controllers/discardRollout';

const discardRollOutController = new DiscardRollOutController();

export default class DiscardRollOutEventHandler {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    listen() {
        this.socket.on('createDiscardRollOut', async (data) => {
            await discardRollOutController.createDiscardRollOut(this.socket, data);
        });
        this.socket.on('canCreateDiscardRollOut', async (data) => {
            await discardRollOutController.canCreateDiscardRollOut(this.socket);
        });
        this.socket.on('getDiscardRollOuts', async () => {
            await discardRollOutController.getDiscardRollOuts(this.socket);
        });
        this.socket.on('getDiscardRollOutById', async (data) => {
            await discardRollOutController.getDiscardRollOutById(this.socket, data);
        });
        this.socket.on('getDiscardRollOutByDate', async () => {
            console.log('inside getDiscardRollOutByDate-----------' )
            await discardRollOutController.getDiscardRollOutByDate(this.socket);
        });
        this.socket.on('updateDiscardRollOut', async (data) => {
            await discardRollOutController.updateDiscardRollOut(this.socket, data);
        });
        this.socket.on('deleteDiscardRollOut', async (data) => {
            await discardRollOutController.deleteDiscardRollOut(this.socket, data);
        });
    }
}
