import { Request, Response, Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

interface UserWithoutPassword {
    id: string;
    name: string;
    email: string;
    password?: string;
    created_at: Date;
    updated_at: Date;
}

sessionsRouter.post('/', async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const authenticateUser = await new AuthenticateUserService();

    const { user, token } = await authenticateUser.execute({
        email,
        password
    });

    const userWithoutPassword: UserWithoutPassword = user;

    delete userWithoutPassword.password;

    return response.json({ userWithoutPassword, token });

});

export default sessionsRouter;
