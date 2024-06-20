import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface MenuItemAttributes {
    item_id: number;
    name: string;
    category: string;
    price: number;
    availability_status: string;
}

interface MenuItemCreationAttributes extends Optional<MenuItemAttributes, "item_id"> {}

class MenuItem extends Model<MenuItemAttributes, MenuItemCreationAttributes> implements MenuItemAttributes {
    public item_id!: number;
    public name!: string;
    public category!: string;
    public price!: number;
    public availability_status!: string;
}

MenuItem.init(
    {
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        category: {
            type:  DataTypes.STRING(128),
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        availability_status: {
            type:  DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: "menu_items",
        sequelize,
    }
);

export default MenuItem;