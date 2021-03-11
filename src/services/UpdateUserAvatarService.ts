import { getRepository } from 'typeorm'
import path from 'path';
import uploadConfig from '../config/upload';
import fs from 'fs';
import User from '../models/User';

import AppError from '../errors/AppError';

interface Request {
    user_id: string;
    avatarFilename: string;
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

class UpdateUserAvatarService {
    public async execute({ user_id, avatarFilename }: Request): Promise<UserWithoutPassword> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

        if (!user) {
            throw new AppError('Only authenticated users can change avatar.', 401);
        };

        if (user.avatar) {
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            };
        };

        user.avatar = avatarFilename;

        await usersRepository.save(user);

        const userWithoutPassword: UserWithoutPassword = user;

        delete userWithoutPassword.password;

        return userWithoutPassword;

    }
}

export default UpdateUserAvatarService;
