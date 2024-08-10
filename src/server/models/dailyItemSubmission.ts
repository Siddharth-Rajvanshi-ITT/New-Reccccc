import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface DailyItemSubmissionAttributes {
    id: number;
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    date: string;
}

interface DailyItemSubmissionCreationAttributes extends Optional<DailyItemSubmissionAttributes, "id"> {}

class DailyItemSubmission extends Model<DailyItemSubmissionAttributes, DailyItemSubmissionCreationAttributes> implements DailyItemSubmissionAttributes {
    public breakfast!: boolean;
    public date!: string;
    public dinner!: boolean;
    public id!: number;
    public lunch!: boolean;
}

DailyItemSubmission.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        breakfast: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        lunch: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        dinner: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        tableName: "daily_item_submissions",
        sequelize,
    }
);

export default DailyItemSubmission;
