import * as yup from 'yup';
import { playerTrainingPlanValidationSchema } from 'validationSchema/player-training-plans';

export const trainingPlanValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  coach_id: yup.string().nullable().required(),
  player_training_plan: yup.array().of(playerTrainingPlanValidationSchema),
});
