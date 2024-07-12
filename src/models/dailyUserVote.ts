import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface DailyUserVoteAttributes {
    id: number;
    user_id: number;
    category: string;
    date: string;
}

interface DailyUserVoteCreationAttributes extends Optional<DailyUserVoteAttributes, "id"> {}

class DailyUserVote extends Model<DailyUserVoteAttributes, DailyUserVoteCreationAttributes> implements DailyUserVoteAttributes {
    public category!: string;
    public date!: string;
    public id!: number;
    public user_id!: number;
}

DailyUserVote.init(
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
        tableName: "daily_user_votes",
        sequelize,
    }
);

export default DailyUserVote;