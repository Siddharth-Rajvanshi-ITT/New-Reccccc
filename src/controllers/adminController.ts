import { insertDataByAdmin, updatedItemData } from "../repositories/adminRepository"
import { deletedItemData } from "../repositories/adminRepository"

export const addMenu = async(id: number, name: string, category: string, price: number, availability:string) => {
    return await insertDataByAdmin(id, name, category, price, availability)
}

export const deleteItem = async(id: number) => {
    return await deletedItemData(id)
}

export const updateItem = async(id: number, name: string, category: string, price: number, availability:string) => {
    return await updatedItemData(id, name, category, price, availability)
}