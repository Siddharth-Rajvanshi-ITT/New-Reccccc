import { insertRolloutItem, getRolloutItmes } from "../repositories/chefRepository"


export const addToRolloutMenu = async(item_id: number) => {
    return await insertRolloutItem(item_id)
}



export const viewRolloutItems = async() => {
    return await getRolloutItmes()
}

export default {addToRolloutMenu, viewRolloutItems}