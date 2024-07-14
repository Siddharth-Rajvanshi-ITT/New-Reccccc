import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface DailyMenuItemsAttributes {
    id: number;
    item_id: number;
    quantity_prepared: number;
    date: string;
}

interface DailyMenuItemsCreationAttributes extends Optional<DailyMenuItemsAttributes, "id"> {}

class DailyMenuItems extends Model<DailyMenuItemsAttributes, DailyMenuItemsCreationAttributes> implements DailyMenuItemsAttributes {
    public date!: string;
    public id!: number;
    public item_id!: number;
    public quantity_prepared!: number;
}

DailyMenuItems.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        quantity_prepared: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        date: {
            type: new DataTypes.STRING(10),
            allowNull: false,
        },
    },
    {
        tableName: "daily_menu_items",
        sequelize,
    }
);

export default DailyMenuItems;
