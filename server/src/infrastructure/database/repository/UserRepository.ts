import { IUserRepository } from "../../../application/interfaces/IUserRepository";
import { User } from "../../../domain/entities/User";
import { UserModel } from "../models/UserModel";
import bcrypt from 'bcrypt'

export class UserRepository implements IUserRepository{

    async findById(userId: string) : Promise<User | null> {
        return await UserModel.findById(userId)
    }
    async findByEmail(email:string) : Promise<User | null> {
        return await UserModel.findOne({email})
    }
    async createUser(email: string, phone: string, password: string): Promise<User> {
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await UserModel.create({email, phone, password: hashPassword});
        return new User(user._id.toString(), user.email, user.phone)
    }

    async authenticateUser(email: string, password: string): Promise<User | null> {
        const user = await UserModel.findOne({email});
        if(!user) {
            throw new Error('User not found, create account')
        }
        if(user && (await bcrypt.compare(password, user.password))){
            return new User(user._id.toString(), user.email, user.phone,);
        }
        return null;
    }

    async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<User> {
        const user = await UserModel.findById(userId);
        if(!user){
            throw new Error('User not found')
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if(!isPasswordValid){
            throw new Error('Current password is incorrect')
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();
        
        return new User(user._id.toString(), user.email, user.phone,);
    }

    async resetPassword(email: string, newPassword: string): Promise<User> {
        const user = await UserModel.findOne({email});
        if(!user){
            throw new Error('User not found')
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();
        
        return new User(user._id.toString(), user.email, user.phone,);
    }
}