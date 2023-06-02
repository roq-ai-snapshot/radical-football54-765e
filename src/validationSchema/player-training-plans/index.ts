import * as yup from 'yup';

export const playerTrainingPlanValidationSchema = yup.object().shape({
  player_id: yup.string().nullable().required(),
  training_plan_id: yup.string().nullable().required(),
});
