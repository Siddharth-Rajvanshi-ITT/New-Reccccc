import { getUserByIdAndPassword } from "../repositories/userRepository"

export const getUser = async(id:string,password:string) => {
    return await getUserByIdAndPassword(id,password)
}