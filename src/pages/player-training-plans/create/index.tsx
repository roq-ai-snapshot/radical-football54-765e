import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createPlayerTrainingPlan } from 'apiSdk/player-training-plans';
import { Error } from 'components/error';
import { playerTrainingPlanValidationSchema } from 'validationSchema/player-training-plans';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlayerInterface } from 'interfaces/player';
import { TrainingPlanInterface } from 'interfaces/training-plan';
import { getPlayers } from 'apiSdk/players';
import { getTrainingPlans } from 'apiSdk/training-plans';
import { PlayerTrainingPlanInterface } from 'interfaces/player-training-plan';

function PlayerTrainingPlanCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PlayerTrainingPlanInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPlayerTrainingPlan(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PlayerTrainingPlanInterface>({
    initialValues: {
      player_id: (router.query.player_id as string) ?? null,
      training_plan_id: (router.query.training_plan_id as string) ?? null,
    },
    validationSchema: playerTrainingPlanValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Player Training Plan
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<PlayerInterface>
            formik={formik}
            name={'player_id'}
            label={'player_id'}
            placeholder={'Select Player'}
            fetcher={getPlayers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.user_id}
              </option>
            )}
          />
          <AsyncSelect<TrainingPlanInterface>
            formik={formik}
            name={'training_plan_id'}
            label={'training_plan_id'}
            placeholder={'Select Training Plan'}
            fetcher={getTrainingPlans}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'player_training_plan',
  operation: AccessOperationEnum.CREATE,
})(PlayerTrainingPlanCreatePage);
