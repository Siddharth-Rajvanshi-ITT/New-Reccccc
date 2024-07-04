import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./user";

interface NotificationAttributes {
    notification_id: number;
    notification_type: 'new_breakfast_menu' | 'new_lunch_menu' | 'new_dinner_menu' | 'item_added' | 'item_status_change';
    notification_data: object;
    notification_timestamp: string;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, "notification_id"> { }

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
    public notification_id!: number;
    public notification_type!: 'new_breakfast_menu' | 'new_lunch_menu' | 'new_dinner_menu' | 'item_added' | 'item_status_change';
    public notification_data!: object;
    public notification_timestamp!: string;
}

Notification.init(
    {
        notification_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        notification_type: {
            type: DataTypes.ENUM('new_breakfast_menu', 'new_lunch_menu', 'new_dinner_menu', 'item_added', 'item_status_change'),
            allowNull: false,
        },
        notification_data: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        notification_timestamp: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: "notifications",
        sequelize,
    }
);

export default Notification;