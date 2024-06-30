import RolloutMenuItem from "../models/rolloutMenuItem";
import MenuItem from "../models/menuItem";

export const insertRolloutItem = async (item_id: number) => {
  const item = await RolloutMenuItem.create({rolloutmenuitemId: item_id})
}

export const getRolloutItmes = async () => {
  try {
    const rollOutItems = await RolloutMenuItem.findAll({attributes:['item_id'], include:{ model: MenuItem, attributes: ['name']}, raw: true});
    return rollOutItems;
  } catch (error: any) {
    throw new Error(error.message);
  }
};