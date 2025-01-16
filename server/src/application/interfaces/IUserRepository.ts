import { User } from "../../domain/entities/User";

export interface IUserRepository {

    findById(userId: string) : Promise<User | null>
    findByEmail(email:string) : Promise<User | null>
    createUser (email: string, phone: string, password: string): Promise<User>
   
    authenticateUser(email: string, password: string):Promise<User| null>
    updatePassword(userId:string, currentPassword: string, newPassword: string):Promise<User>
    resetPassword(email: string, newPassword: string): Promise<User>
}