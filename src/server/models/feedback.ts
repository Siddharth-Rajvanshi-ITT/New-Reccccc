import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import MenuItem from "./menuItem";
import User from "./user";

interface FeedbackAttributes {
    feedback_id: number;
    item_id: number;
    user_id: number;
    rating: number;
    comment: string;
    feedback_date: Date;
}

interface FeedbackCreationAttributes extends Optional<FeedbackAttributes, "feedback_id"> {}

class Feedback extends Model<FeedbackAttributes, FeedbackCreationAttributes> implements FeedbackAttributes {
    public feedback_id!: number;
    public item_id!: number;
    public user_id!: number;
    public rating!: number;
    public comment!: string;
    public feedback_date!: Date;
}

Feedback.init(
    {
        feedback_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: MenuItem,
                key: 'item_id',
            },
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        rating: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        comment: {
            type: new DataTypes.STRING(512),
            allowNull: false,
        },
        feedback_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "feedback",
        sequelize,
    }
);

// Setting up the associations
MenuItem.hasMany(Feedback, { foreignKey: 'item_id' });
User.hasMany(Feedback, { foreignKey: 'user_id' });
Feedback.belongsTo(MenuItem, { foreignKey: 'item_id' });
Feedback.belongsTo(User, { foreignKey: 'user_id' });

export default Feedback;
