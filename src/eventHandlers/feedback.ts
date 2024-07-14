import { Socket } from "socket.io";
import FeedbackSocketHandler from "../controllers/feedback";

const feedbackSocketHandler = new FeedbackSocketHandler();

export default class FeedbackEventHandler {
    private socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    listen(){
        this.socket.on("createFeedback", async (data) => {
            await feedbackSocketHandler.createFeedback(this.socket, data);
        });
        this.socket.on("getFeedbacks", async () => {
            await feedbackSocketHandler.getFeedbacks(this.socket);
        });
        this.socket.on("getFeedbackById", async (data) => {
            await feedbackSocketHandler.getFeedbackById(this.socket, data);
        });
        this.socket.on("updateFeedback", async (data) => {
            await feedbackSocketHandler.updateFeedback(this.socket, data);
        });
        this.socket.on("deleteFeedback", async (data) => {
            await feedbackSocketHandler.deleteFeedback(this.socket, data);
        });
    }
}

