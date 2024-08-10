import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface DailyUserFeedbackAttributes {
    id: number;
    user_id: number;
    category: string;
    date: string;
}

interface DailyUserFeedbackCreationAttributes extends Optional<DailyUserFeedbackAttributes, "id"> {}

class DailyUserFeedback extends Model<DailyUserFeedbackAttributes, DailyUserFeedbackCreationAttributes> implements DailyUserFeedbackAttributes {
    public category!: string;
    public date!: string;
    public id!: number;
    public user_id!: number;
}

DailyUserFeedback.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        category: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        date: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: "daily_user_feedbacks",
        sequelize,
    }
);

export default DailyUserFeedback;
