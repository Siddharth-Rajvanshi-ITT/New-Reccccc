import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MenuAttributes {
    menuId: number;
    mealType: 'vegetarian' | 'non-vegetarian' | 'eggetarian';
    spiceLevel: 'high' | 'medium' | 'low';
    category: 'north indian' | 'south indian' | 'other';
    sweetTooth: boolean;
}

interface MenuAttributesCreationAttributes extends Optional<MenuAttributes, 'menuId'> {}

class MenuAttributesModel extends Model<MenuAttributes, MenuAttributesCreationAttributes> implements MenuAttributes {
    public category!: 'north indian' | 'south indian' | 'other';
    public mealType!: 'vegetarian' | 'non-vegetarian' | 'eggetarian';
    public menuId!: number;
    public spiceLevel!: 'high' | 'medium' | 'low';
    public sweetTooth!: boolean;
}

MenuAttributesModel.init(
    {
        menuId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
        },
        mealType: {
            type: DataTypes.ENUM('vegetarian', 'non-vegetarian', 'eggetarian'),
            allowNull: false,
        },
        spiceLevel: {
            type: DataTypes.ENUM('high', 'medium', 'low'),
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM('north indian', 'south indian', 'other'),
            allowNull: false,
        },
        sweetTooth: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        tableName: 'menuAttributes',
        sequelize,
    }
);

export default MenuAttributesModel;
