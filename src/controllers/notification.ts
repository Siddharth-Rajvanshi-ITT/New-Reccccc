import { Socket } from 'socket.io';
import NotificationService from '../services/notifications';

class NotificationController {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
    }

    public createNotification = async (socket: Socket, data: any): Promise<void> => {
        const { category, rolloutItemId: notification_data } = data;

        // console.log("-------data-----", data)

        let notification_type

        if(category == '1'){
            notification_type = 'new_breakfast_menu'
        } else if(category == '2'){
            notification_type = 'new_lunch_menu'
        } else {
            notification_type = 'new_dinner_menu'
        }

        let notification_timestamp: any = new Date();
        notification_timestamp = notification_timestamp.toISOString().split('T')[0]
        console.log('createNotification', notification_type, notification_data, notification_timestamp)
        try {
            const notification = await this.notificationService.createNotification(notification_type, [notification_data], notification_timestamp);
            socket.emit('createNotificationSuccess', notification);
        } catch (error:any) {
            console.log(error)
            socket.emit('createNotificationError', { error: error.message });
        }
    };

    public getNotifications = async (socket: Socket): Promise<void> => {
        try {
            const notifications = await this.notificationService.getNotifications();
            socket.emit('getNotificationsSuccess', notifications);
        } catch (error:any) {
            socket.emit('getNotificationsError', { error: error.message });
        }
    };

    public getNotificationById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const notification = await this.notificationService.getNotificationById(+id);
            socket.emit('getNotificationByIdSuccess', notification);
        } catch (error:any) {
            socket.emit('getNotificationByIdError', { error: error.message });
        }
    };

    public getNotificationByDate = async (socket: Socket, data: any): Promise<void> => {
        const { date } = data;
        try {
            const notification = await this.notificationService.getNotificationByDate(date);
            socket.emit('getNotificationByDateSuccess', {notification});
        } catch (error:any) {
            socket.emit('getNotificationByDateError', { error: error.message });
        }
    };

    public updateNotification = async (socket: Socket, data: any): Promise<void> => {
        const { id, user_id, notification_type, notification_data, notification_timestamp } = data;
        try {
            const notification = await this.notificationService.updateNotification(+id, notification_type, notification_data, notification_timestamp);
            socket.emit('updateNotificationSuccess', notification);
        } catch (error:any) {
            socket.emit('updateNotificationError', { error: error.message });
        }
    };

    public deleteNotification = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.notificationService.deleteNotification(+id);
            socket.emit('deleteNotificationSuccess');
        } catch (error:any) {
            socket.emit('deleteNotificationError', { error: error.message });
        }
    };
}

export default NotificationController;