import { RowDataPacket } from "mysql2";
import { pool } from "../config/db";
import User from "../models/user";
import MenuItem from "../models/menuItem";

export const insertDataByAdmin = async (id: number, name: string, category: string, price: number, availability: string) => {
  const itemDetails = await MenuItem.create({ item_id: id, name, category, price, availability_status: availability })


  if (itemDetails)
    return itemDetails
  else
    return null
}

export const deletedItemData = async (id: number) => {
  try {
    const menuItem = await MenuItem.findByPk(id);
    if (!menuItem) {
      return null;
    }
    await menuItem.destroy();
    return menuItem;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const updatedItemData = async (id: number, name: string, category: string, price: number, availability: string) => {
  try {
    const menuItem = await MenuItem.findByPk(id);
    if (!menuItem) {
      return null;
    }
    
    menuItem.name=name
    menuItem.category=category
    menuItem.price=price
    menuItem.availability_status=availability
    const updatedMenuItem= await menuItem.save()
    return menuItem

  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const viewMenuItems = async () => {
  try {
    const menuItems = await MenuItem.findAll();
    return menuItems;
  } catch (error: any) {
    throw new Error(error.message);
  }
};