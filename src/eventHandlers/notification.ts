import { Socket } from "socket.io";
import NotificationSocketHandler from "../controllers/notification";

const notificationSocketHandler = new NotificationSocketHandler();


export default class NotificationEventHandler {
    private socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    listen(){
        this.socket.on("createNotification", async (data) => {
            console.log("Data: ", data)
            await notificationSocketHandler.createNotification(this.socket, data);
        });
        this.socket.on("getNotifications", async () => {
            await notificationSocketHandler.getNotifications(this.socket);
        });
        this.socket.on("getNotificationById", async (data) => {
            await notificationSocketHandler.getNotificationById(this.socket, data);
        });
        this.socket.on("getNotificationByDate", async (data) => {
            console.log("Date: ", data)
            await notificationSocketHandler.getNotificationByDate(this.socket, data);
        });
        this.socket.on("updateNotification", async (data) => {
            await notificationSocketHandler.updateNotification(this.socket, data);
        });
        this.socket.on("deleteNotification", async (data) => {
            await notificationSocketHandler.deleteNotification(this.socket, data);
        });
    }
}
