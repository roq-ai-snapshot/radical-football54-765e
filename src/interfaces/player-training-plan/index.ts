import { PlayerInterface } from 'interfaces/player';
import { TrainingPlanInterface } from 'interfaces/training-plan';

export interface PlayerTrainingPlanInterface {
  id?: string;
  player_id: string;
  training_plan_id: string;

  player?: PlayerInterface;
  training_plan?: TrainingPlanInterface;
  _count?: {};
}
