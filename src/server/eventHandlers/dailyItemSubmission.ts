import { Socket } from "socket.io";
import DailyItemSubmissionController from "../controllers/dailyItemSubmission";

const dailyItemSubmissionController = new DailyItemSubmissionController();

export default class DailyItemSubmissionEventHandler {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    listen() {
        this.socket.on("createDailyItemSubmission", async (data) => {
            console.log('------------------createDailyMenuItem', data)
            await dailyItemSubmissionController.createDailyItemSubmission(this.socket, data);
        });
        this.socket.on("getDailyItemSubmissions", async () => {
            await dailyItemSubmissionController.getDailyItemSubmissions(this.socket);
        });
        this.socket.on("getDailyItemSubmissionById", async (data) => {
            await dailyItemSubmissionController.getDailyItemSubmissionById(this.socket, data);
        });
        this.socket.on("getDailyItemSubmissionByDate", async (data) => {
            console.log('------------------getDailyItemSubmissionByDate', data)
            await dailyItemSubmissionController.getDailyItemSubmissionByDate(this.socket, data);
        });
        this.socket.on("updateDailyItemSubmission", async (data) => {
            await dailyItemSubmissionController.updateDailyItemSubmission(this.socket, data);
        });
        this.socket.on("deleteDailyItemSubmission", async (data) => {
            await dailyItemSubmissionController.deleteDailyItemSubmission(this.socket, data);
        });
    }
}
