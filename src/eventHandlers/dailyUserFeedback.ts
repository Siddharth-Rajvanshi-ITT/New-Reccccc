import { Socket } from "socket.io";
import DailyUserFeedbackSocketHandler from "../controllers/dailyUserFeedback";

const dailyUserFeedbackSocketHandler = new DailyUserFeedbackSocketHandler();

export default class DailyUserFeedbackEventHandler {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    listen() {
        this.socket.on("createUserFeedback", async (data) => {
            await dailyUserFeedbackSocketHandler.createUserFeedback(this.socket, data);
        });
        this.socket.on("getUserFeedbacks", async () => {
            await dailyUserFeedbackSocketHandler.getUserFeedbacks(this.socket);
        });
        this.socket.on("getUserFeedbackById", async (data) => {
            await dailyUserFeedbackSocketHandler.getUserFeedbackById(this.socket, data);
        });
        this.socket.on("getUserFeedbacksByCondition", async (data) => {
            console.log('getUserFeedbacksByCondition called', data)
            await dailyUserFeedbackSocketHandler.getUserFeedbacksByCondition(this.socket, data);
        });
        this.socket.on("updateUserFeedback", async (data) => {
            await dailyUserFeedbackSocketHandler.updateUserFeedback(this.socket, data);
        });
        this.socket.on("deleteUserFeedback", async (data) => {
            await dailyUserFeedbackSocketHandler.deleteUserFeedback(this.socket, data);
        });
    }
}
