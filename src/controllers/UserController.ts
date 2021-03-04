import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from '../repositories/UserRepository';
import * as yup from 'yup'
import { AppError } from "../errors/AppError";
class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
        })

        try {
            await schema.validate(request.body, { abortEarly: false })
        } catch (err) {
            throw new AppError(err);
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyExist = await usersRepository.findOne({
            email
        })

        const user = usersRepository.create({
            name,
            email
        })

        if (userAlreadyExist) {
            throw new AppError("User already exist!");
        }

        await usersRepository.save(user)

        return response.status(201).json(user);
    };

    async show(request: Request, response: Response) {
        const usersRepository = getCustomRepository(UsersRepository);

        const all = await usersRepository.find();

        return response.json(all);
    }
}

export { UserController };
