import { Socket } from "socket.io";
import DailyMenuItemSocketHandler from "../controllers/dailyMenuItems";

const dailyMenuItemSocketHandler = new DailyMenuItemSocketHandler();

export default class DailyMenuItemEventHandler {
    private socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    listen(){
        this.socket.on("createDailyMenuItem", async (data) => {
            await dailyMenuItemSocketHandler.createDailyMenuItem(this.socket, data);
        });
        this.socket.on("getDailyMenuItems", async () => {
            await dailyMenuItemSocketHandler.getDailyMenuItems(this.socket);
        });
        this.socket.on("getDailyMenuItemById", async (data) => {
            await dailyMenuItemSocketHandler.getDailyMenuItemById(this.socket, data);
        });
        this.socket.on("getDailyMenuItemByDate", async (data) => {
            await dailyMenuItemSocketHandler.getDailyMenuItemByDate(this.socket, data);
        });
        this.socket.on("updateDailyMenuItem", async (data) => {
            await dailyMenuItemSocketHandler.updateDailyMenuItem(this.socket, data);
        });
        this.socket.on("deleteDailyMenuItem", async (data) => {
            await dailyMenuItemSocketHandler.deleteDailyMenuItem(this.socket, data);
        });
    }
}

