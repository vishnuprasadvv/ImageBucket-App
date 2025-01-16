import { IUserRepository } from "../interfaces/IUserRepository";

export class UserUseCases {
    constructor(private userRepository : IUserRepository){}

    async registerUser (email : string, phone : string, password: string) {
        return this.userRepository.createUser(email, phone, password)
    }

    async loginUser(email:string, password: string){
        const user = await this.userRepository.authenticateUser(email, password)
        console.log(user)
        if(!user) {
            throw new Error('Invalid credentials')
        }
        return user;
    }

    async resetPassword(userId:string, currentPassword: string, newPassword: string){
        return this.userRepository.updatePassword(userId, currentPassword, newPassword)
    }
    async resetPasswordByOtp(email:string, newPassword: string){
        return this.userRepository.resetPassword(email,newPassword)
    }

}