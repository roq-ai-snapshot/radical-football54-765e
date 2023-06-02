import { PlayerTrainingPlanInterface } from 'interfaces/player-training-plan';
import { CoachInterface } from 'interfaces/coach';

export interface TrainingPlanInterface {
  id?: string;
  name: string;
  description?: string;
  coach_id: string;
  player_training_plan?: PlayerTrainingPlanInterface[];
  coach?: CoachInterface;
  _count?: {
    player_training_plan?: number;
  };
}
