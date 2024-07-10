import MenuItem from "../models/notification";
import Notification from "../models/notification";
import MenuItemService from "./menuItem";

const menuItemService = new MenuItemService()


class NotificationService {
    async createNotification(notification_type: 'new_breakfast_menu' | 'new_lunch_menu' | 'new_dinner_menu' | 'item_added' | 'item_status_change', notification_data: any, notification_timestamp: string) {
        try {
            const notification = await Notification.create({
                notification_type,
                notification_data,
                notification_timestamp,
            });
            return notification;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getNotifications() {
        try {
            const notifications = await Notification.findAll();
            return notifications;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getNotificationById(notification_id: number) {
        try {
            const notification = await Notification.findByPk(notification_id);
            if (!notification) {
                throw new Error("Notification not found");
            }
            return notification;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getNotificationByDate(notification_timestamp: string) {
        try {
            const notifications = await Notification.findAll({ where: { notification_timestamp } });

            if (!notifications) {
                throw new Error("Notification not found");
            }

            const menuItemIds = notifications.flatMap(notification => {
                console.debug("Menu item ids", notification.notification_data)
                return +notification.notification_data
            });


            console.log(menuItemIds)


            const menuItems = await Promise.all(
                menuItemIds.map(async (menuItemId) => {
                    return await menuItemService.getMenuItemById(menuItemId);
                })
            )

            // const menuItemMap = new Map(menuItems.map(item => [item.item_id, item]));
      

            const notificationsWithDetails = notifications.map(notification => {
                const detailedItems = (notification.notification_data as number[]).map(id => menuItems);
                return {
                    ...notification.get({ plain: true }),
                    notification_data: detailedItems
                };
            });

            console.log("---------Notification details", notificationsWithDetails)

            return notificationsWithDetails;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async updateNotification(notification_id: number, notification_type: 'new_breakfast_menu' | 'new_lunch_menu' | 'new_dinner_menu' | 'item_added' | 'item_status_change', notification_data: any, notification_timestamp: string) {
        try {
            const notification = await Notification.findByPk(notification_id);
            if (!notification) {
                throw new Error("Notification not found");
            }
            notification.notification_type = notification_type;
            notification.notification_data = notification_data;
            notification.notification_timestamp = notification_timestamp;
            await notification.save();
            return notification;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async deleteNotification(notification_id: number) {
        try {
            const notification = await Notification.findByPk(notification_id);
            if (!notification) {
                throw new Error("Notification not found");
            }
            await notification.destroy();
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default NotificationService;