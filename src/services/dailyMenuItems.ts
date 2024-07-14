import DailyMenuItems from "../models/dailyMenuItems";
import MenuItemService from "./menuItem";

class DailyMenuItemsService {
    async createDailyMenuItem(item_id: number, quantity_prepared: number, date: string) {
        try {
            const dailyMenuItem = await DailyMenuItems.create({ item_id, quantity_prepared, date });
            return dailyMenuItem;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteDailyMenuItem(id: number) {
        try {
            const dailyMenuItem = await DailyMenuItems.findByPk(id);
            if (!dailyMenuItem) {
                throw new Error("Daily menu item not found");
            }
            await dailyMenuItem.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyMenuItemByDate(date: string) {
        const menuItemService = new MenuItemService()
        try {
            const dailyMenuItems = await DailyMenuItems.findAll({ where: { date } });
            if (!dailyMenuItems) {
                throw new Error("Daily menu item not found");
            }
            return await Promise.all(
                dailyMenuItems.map(async (item) => {
                    const menuItem = await menuItemService.getMenuItemById(item.item_id);
                    return {
                        id: item.item_id,
                        name: menuItem.name,
                        category: menuItem.category,
                    }
                }));
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyMenuItemById(id: number) {
        try {
            const dailyMenuItem = await DailyMenuItems.findByPk(id);
            if (!dailyMenuItem) {
                throw new Error("Daily menu item not found");
            }
            return dailyMenuItem;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyMenuItems() {
        try {
            const dailyMenuItems = await DailyMenuItems.findAll();
            return dailyMenuItems;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateDailyMenuItem(id: number, menu_id: number, item_id: number, quantity_prepared: number) {
        try {
            const dailyMenuItem = await DailyMenuItems.findByPk(id);
            if (!dailyMenuItem) {
                throw new Error("Daily menu item not found");
            }
            dailyMenuItem.item_id = item_id;
            dailyMenuItem.quantity_prepared = quantity_prepared;
            await dailyMenuItem.save();
            return dailyMenuItem;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default DailyMenuItemsService;
