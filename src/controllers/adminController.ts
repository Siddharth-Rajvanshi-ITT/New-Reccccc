import { insertDataByAdmin } from "../repositories/adminRepository"

export const addMenu = async(id: number, name: string, category: string, price: number, availability:string) => {
    return await insertDataByAdmin(id, name, category, price, availability)
}

