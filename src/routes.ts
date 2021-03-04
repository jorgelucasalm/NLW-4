import { Router } from 'express';
import { SurveyController } from './controllers/SurveyController';
import { UserController } from './controllers/UserController';
import { SendEmailController } from './controllers/SendEmailController';
import { AnswersController } from './controllers/AnswersController';
import { NpsController } from './controllers/NpsController';

const router = Router();

const userController= new UserController();
const surveyController = new SurveyController();
const sendEmailController = new SendEmailController();
const answersController = new AnswersController();
const npsController = new NpsController();

//criar usuarios
router.post("/users", userController.create);
//mostrar usuarios
router.get("/showUsers", userController.show);

//criar uma pesquisa
router.post("/surveys", surveyController.create)

//enviar email de pesquisa
router.post("/sendMail", sendEmailController.execute)

//
router.get("/answers/:value", answersController.execute)

router.get("/nps/:survey_id", npsController.execute)

export {router};

