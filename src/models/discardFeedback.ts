import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface DiscardFeedbackAttributes {
    id: number;
    item_id: number;
    user_id: number;
    date: string;
    question1: string;
    question2: string;
    question3: string;
}

interface DiscardFeedbackCreationAttributes extends Optional<DiscardFeedbackAttributes, 'id'> {}

class DiscardFeedback extends Model<DiscardFeedbackAttributes, DiscardFeedbackCreationAttributes> implements DiscardFeedbackAttributes {
    public date!: string;
    public id!: number;
    public item_id!: number;
    public question1!: string;
    public question2!: string;
    public question3!: string;
    public user_id!: number;
}

DiscardFeedback.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        date: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        question1: {
            type: new DataTypes.STRING(512),
            allowNull: false,
        },
        question2: {
            type: new DataTypes.STRING(512),
            allowNull: false,
        },
        question3: {
            type: new DataTypes.STRING(512),
            allowNull: false,
        },
    },
    {
        tableName: 'discard_feedback',
        sequelize,
    }
);

export default DiscardFeedback;
