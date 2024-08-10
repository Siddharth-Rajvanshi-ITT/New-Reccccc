import { getMenuItems, getUserByIdAndPassword } from "../repositories/userRepository"

export const getUser = async(id:string,password:string) => {
    return await getUserByIdAndPassword(id,password)
}

// export const viewItem = async() => {
//     return await getMenuItems()
// }