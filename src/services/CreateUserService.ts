import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface Request {
    name: string;
    email: string;
    password: string;
}

interface UserWithoutPassword {
    id: string;
    name: string;
    email: string;
    password?: string;
    created_at: Date;
    updated_at: Date;
    avatar: string;
}

class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<UserWithoutPassword> {
        const usersRepository = getRepository(User);

        const checkUserExists = await usersRepository.findOne({
            where: { email },
        });

        if (checkUserExists) {
            throw Error('Email address already used');
        };

        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword
        });


        await usersRepository.save(user);

        const { ...userWithoutPassword }: UserWithoutPassword = user;

        delete userWithoutPassword.password

        return userWithoutPassword;
    }
};

export default CreateUserService;
