import { getUserByIdAndPassword } from "../repositories/userRepository"

export const getUserById = async (id:string,password:string)=>{
    return await getUserByIdAndPassword(id,password)
}