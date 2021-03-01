import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { UsersRepository } from "../repositories/UserRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class SendEmailController {
    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;
        
        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveyRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userAlreadyExist = await usersRepository.findOne({email});

        if(!userAlreadyExist){
            return response.status(400).json({
                error: "Users does not exists",
            });
        }

        const surveyAlreadyExist = await surveysRepository.findOne({id: survey_id});

        if(!surveyAlreadyExist){
            return response.status(400).json({
                error: "Surveys does not exists",
            });
        }

        //salvar as informaçoes
        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExist.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser);
        //enviar email
        return response.json(surveyUser);
    }
}

export { SendEmailController }