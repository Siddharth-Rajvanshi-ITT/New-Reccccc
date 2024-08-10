import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import MenuItem from "./menuItem";

interface RolloutMenuItemAttributes {
    item_id: number;
    rolloutmenuitemId: number;
}

interface MenuItemCreationAttributes extends Optional<RolloutMenuItemAttributes, "item_id"> {}
class RolloutMenuItem extends Model<RolloutMenuItemAttributes, MenuItemCreationAttributes> implements RolloutMenuItemAttributes {
    public item_id!: number;
    public rolloutmenuitemId!: number;
}

RolloutMenuItem.init(
    {
       item_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
       },
       rolloutmenuitemId:{
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: MenuItem,
            key: 'item_id'
        }
       }
    },
    {
        tableName: "rollout_items",
        sequelize,
    }
);
RolloutMenuItem.belongsTo(MenuItem, {foreignKey: 'rolloutmenuitemId'})


export default RolloutMenuItem;