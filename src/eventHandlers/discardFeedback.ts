import { Socket } from 'socket.io';
import DiscardFeedbackController from '../controllers/discardFeedback';

const discardFeedbackController = new DiscardFeedbackController();

export default class DiscardFeedbackEventHandler {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    listen() {
        this.socket.on('createDiscardFeedback', async (data) => {
            await discardFeedbackController.createDiscardFeedback(this.socket, data);
        });
        this.socket.on('getDiscardFeedbacks', async () => {
            await discardFeedbackController.getDiscardFeedbacks(this.socket);
        });
        this.socket.on('getMonthlyDiscardFeedbacks', async () => {
            await discardFeedbackController.getMonthlyDiscardFeedbacks(this.socket);
        });
        this.socket.on('getDiscardFeedbackById', async (data) => {
            await discardFeedbackController.getDiscardFeedbackById(this.socket, data);
        });
        this.socket.on('getDiscardFeedbacksByCondition', async (data) => {
            await discardFeedbackController.getDiscardFeedbacksByCondition(this.socket, data);
        });
        this.socket.on('updateDiscardFeedback', async (data) => {
            await discardFeedbackController.updateDiscardFeedback(this.socket, data);
        });
        this.socket.on('deleteDiscardFeedback', async (data) => {
            await discardFeedbackController.deleteDiscardFeedback(this.socket, data);
        });
    }
}
