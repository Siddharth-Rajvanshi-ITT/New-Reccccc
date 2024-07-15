import MenuAttributes from '../models/menuAttributes';

class MenuAttributesService {
    async createMenuAttribute(menuId: number, mealType: 'vegetarian' | 'non-vegetarian' | 'eggetarian', spiceLevel: 'high' | 'medium' | 'low', category: 'north indian' | 'south indian' | 'other', sweetTooth: boolean) {
        try {
            const menuAttributes = await MenuAttributes.create({ menuId, mealType, spiceLevel, category, sweetTooth });
            return menuAttributes;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteMenuAttribute(menuId: number) {
        try {
            const menuAttributes = await MenuAttributes.findOne({ where: { menuId } });
            if (!menuAttributes) {
                throw new Error('Menu attribute not found');
            }
            await menuAttributes.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllMenuAttributes() {
        try {
            const menuAttributes = await MenuAttributes.findAll();
            return menuAttributes;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMenuAttribute(menuId: number) {
        try {
            const menuAttributes = await MenuAttributes.findOne({ where: { menuId } });
            if (!menuAttributes) {
                throw new Error('Menu attribute not found');
            }
            return menuAttributes;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async initializeMenuAttributes(menuId: number) {
        try {
            const menuAttributes = await MenuAttributes.create({ menuId });
            return menuAttributes;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateMenuAttribute(menuId: number, mealType: 'vegetarian' | 'non-vegetarian' | 'eggetarian', spiceLevel: 'high' | 'medium' | 'low', category: 'north indian' | 'south indian' | 'other', sweetTooth: boolean) {
        try {
            const menuAttributes = await MenuAttributes.findOne({ where: { menuId } });
            if (!menuAttributes) {
                throw new Error('Menu attribute not found');
            }
            menuAttributes.mealType = mealType;
            menuAttributes.spiceLevel = spiceLevel;
            menuAttributes.category = category;
            menuAttributes.sweetTooth = sweetTooth;
            await menuAttributes.save();
            return menuAttributes;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default MenuAttributesService;
