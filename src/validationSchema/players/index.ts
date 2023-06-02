import * as yup from 'yup';
import { playerTrainingPlanValidationSchema } from 'validationSchema/player-training-plans';

export const playerValidationSchema = yup.object().shape({
  position: yup.string(),
  date_of_birth: yup.date(),
  user_id: yup.string().nullable().required(),
  team_id: yup.string().nullable().required(),
  player_training_plan: yup.array().of(playerTrainingPlanValidationSchema),
});
