import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EmployeePreferencesAttributes {
    userId: number;
    mealType: 'vegetarian' | 'non-vegetarian' | 'eggetarian' | 'system_default';
    spiceLevel: 'high' | 'medium' | 'low' | 'system_default';
    category: 'north indian' | 'south indian' | 'other' | 'system_default';
    sweetTooth: boolean;
}

interface EmployeePreferencesCreationAttributes extends Optional<EmployeePreferencesAttributes, 'userId'> {}

class EmployeePreferences extends Model<EmployeePreferencesAttributes, EmployeePreferencesCreationAttributes> implements EmployeePreferencesAttributes {
    public category!: 'north indian' | 'south indian' | 'other' | 'system_default';
    public mealType!: 'vegetarian' | 'non-vegetarian' | 'eggetarian' | 'system_default';
    public spiceLevel!: 'high' | 'medium' | 'low' | 'system_default';
    public sweetTooth!: boolean;
    public userId!: number;
}

EmployeePreferences.init(
    {
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            unique: true,
        },
        mealType: {
            type: DataTypes.ENUM('vegetarian', 'non-vegetarian', 'eggetarian', 'system_default'),
            allowNull: false,
            defaultValue: 'system_default',
        },
        spiceLevel: {
            type: DataTypes.ENUM('high', 'medium', 'low', 'system_default'),
            allowNull: false,
            defaultValue: 'system_default',
        },
        category: {
            type: DataTypes.ENUM('north indian', 'south indian', 'other', 'system_default'),
            allowNull: false,
            defaultValue: 'system_default',
        },
        sweetTooth: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: 'employee_preferences',
        sequelize,
    }
);

export default EmployeePreferences;
