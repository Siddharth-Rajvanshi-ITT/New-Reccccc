import MenuItem from "../models/menuItem";

class MenuItemService {
    async createMenuItem(name: string, description: string, category: 'breakfast' | 'lunch' | 'dinner', price: number, availability_status: 'available' | 'unavailable') {
        try {
            const menuItem = await MenuItem.create({ name, category, price, availability_status });
            return menuItem;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getMenuItems() {
        try {
            const menuItems = await MenuItem.findAll();
            return menuItems;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getMenuItemById(item_id: number) {
        try {
            const menuItem = await MenuItem.findByPk(item_id);
            if (!menuItem) {
                throw new Error("Menu item not found");
            }
            return menuItem;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getMenuItemByIds(item_ids: number[]) {
        try {
            const menuItems = await MenuItem.findAll({
                where: {
                    item_id: item_ids
                }
            });
            if (!menuItems) {
                throw new Error("Menu item not found");
            }
            return menuItems;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getRolledOutMenuItems(item_ids: number[]) {
        try {
            const menuItems = await MenuItem.findAll({
                where: {
                    item_id: item_ids
                }
            });
            if (!menuItems) {
                throw new Error("Menu item not found");
            }
            return menuItems;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async updateMenuItem(item_id: number, name: string, category: 'breakfast' | 'lunch' | 'dinner', price: number, availability_status: 'available' | 'unavailable') {
        try {
            const menuItem = await MenuItem.findByPk(item_id);
            if (!menuItem) {
                throw new Error("Menu item not found");
            }

            if (name){
                menuItem.name = name;
            }
            if (category){
                menuItem.category = category;
            }
            if (price){
                menuItem.price = price;
            }
            if (availability_status){
                menuItem.availability_status = availability_status;
            }

            await menuItem.save();
            return menuItem;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async deleteMenuItem(item_id: number) {
        try {
            const menuItem = await MenuItem.findByPk(item_id);
            if (!menuItem) {
                throw new Error("Menu item not found");
            }
            await menuItem.destroy();
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async updateMenuItemAvailability(item_id: number, availability_status: 'available' | 'unavailable') {
        try {
            const menuItem = await MenuItem.findByPk(item_id);
            if (!menuItem) {
                throw new Error("Menu item not found");
            }
            menuItem.availability_status = availability_status;
            await menuItem.save();
            return menuItem;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }
}

export default MenuItemService;