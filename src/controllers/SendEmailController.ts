import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { UsersRepository } from "../repositories/UserRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';
class SendEmailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveyRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({ email });

        //verificação se existe user
        if (!user) {
            return response.status(400).json({
                error: "Users does not exists",
            });
        }

        const survey = await surveysRepository.findOne({ id: survey_id });

        //verificação se existe survey
        if (!survey) {
            return response.status(400).json({
                error: "Surveys does not exists",
            });
        }

        //pegando o caminho para o handle
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        //validando se existe mais de um envio de nota pelo mesmo user
        const surveyUserAlreadyExist = await surveysUsersRepository.findOne({
            where: { user_id: user.id,  value: null },
            relations: ["user", "survey"],
        });

        //variaveis usadas no handle
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL,
        }

        if (surveyUserAlreadyExist) {
            variables.id = surveyUserAlreadyExist.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExist)
        }

        //salvar as informaçoes na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser);

        //enviar email
        variables.id = surveyUser.id;

        //chamando o metodo execute de SendMailService
        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendEmailController }