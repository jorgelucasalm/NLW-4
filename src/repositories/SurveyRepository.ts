import { EntityRepository, Repository } from "typeorm";
import { Surveys } from "../models/Survey";

@EntityRepository(Surveys)
class SurveyRepository extends Repository<Surveys>{}

export { SurveyRepository };

