import { API_ENPOINTS } from '@/services/api';
import {
  IPayloadCreateWorkout,
  IPayloadWorkoutDetail,
  IPayloadUpdateWorkoutData,
  IPayloadAddExerciseToWorkout,
  IPayloadRemoveExerciseToWorkout,
  IPayloadUpdateExerciseToWorkout,
  IPayloadSortExercises,
  IPayloadWorkoutSessions,
  IPayloadWorkoutSessionsUpdate,
  IPayloadWorkoutSessionUserData,
  IPayloadWorkoutSessionsUpdateFinished,
  ICreateWorkoutCopy,
  ExerciseElement,
  IGeneratedWorkoutImage,
} from './interfaces';
import { deleteRequest, getRequest, postRequest, putRequest } from '@/utils/axios';
import { expandRestAsExercises, extractedErrorMessage } from '@/utils/helper';

export const fetchMyWorkoutService = async () => {
  try {
    const URL = API_ENPOINTS.MY_WORKOUT;
    const { data } = await getRequest({
      API: URL,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const fetchPublicWorkoutService = async () => {
  try {
    const URL = API_ENPOINTS.WORKOUT;
    const { data } = await getRequest({
      API: URL,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const fetchPublicWorkoutServiceById = async (payload: IPayloadWorkoutDetail) => {
  try {
    const { id } = payload;
    const params = `/${id}`;
    const URL = API_ENPOINTS.WORKOUT + params;
    const { data } = await getRequest({
      API: URL,
    });
    return data?.data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const addWorkoutService = async (payload: IPayloadCreateWorkout) => {
  try {
    const URL = API_ENPOINTS.MY_WORKOUT;
    const { data } = await postRequest({
      API: URL,
      DATA: payload.formData,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const getWorkoutDetailById = async (payload: IPayloadWorkoutDetail) => {
  try {
    const { id } = payload;
    const params = `/${id}`;
    const URL = API_ENPOINTS.MY_WORKOUT + params;
    const { data } = await getRequest({
      API: URL,
    });

    return data?.data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const deleteWorkoutDetail = async (payload: IPayloadWorkoutDetail) => {
  try {
    const { id } = payload;
    const params = `/${id}`;
    const URL = API_ENPOINTS.MY_WORKOUT + params;
    const { data } = await deleteRequest({
      API: URL,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const updateWorkoutDataRequest = async (payload: IPayloadUpdateWorkoutData) => {
  try {
    const { queryParams, formData } = payload;
    const { id } = queryParams;
    const params = `/${id}`;
    const URL = API_ENPOINTS.MY_WORKOUT + params;
    const { data } = await putRequest({
      API: URL,
      DATA: formData,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const addExerciseToWorkoutRequest = async (payload: IPayloadAddExerciseToWorkout) => {
  try {
    const { queryParams, formData } = payload;
    const { id } = queryParams;
    const params = `/${id}` + `/add-exercise`;
    const URL = API_ENPOINTS.MY_WORKOUT + params;
    const { data } = await putRequest({
      API: URL,
      DATA: formData,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const removeExerciseToWorkoutRequest = async (payload: IPayloadRemoveExerciseToWorkout) => {
  try {
    const { queryParams, formData } = payload;
    const { id } = queryParams;
    const params = `/${id}` + `/remove-exercise`;
    const URL = API_ENPOINTS.MY_WORKOUT + params;
    const { data } = await putRequest({
      API: URL,
      DATA: formData,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const updateExerciseToWorkoutRequest = async (payload: IPayloadUpdateExerciseToWorkout) => {
  try {
    const { queryParams, formData } = payload;
    const { id } = queryParams;
    const params = `/${id}` + `/update-exercise`;
    const URL = API_ENPOINTS.MY_WORKOUT + params;
    const { data } = await putRequest({
      API: URL,
      DATA: formData,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const sortExercisesRequest = async (payload: IPayloadSortExercises) => {
  try {
    const { queryParams, formData } = payload;
    const { id } = queryParams;
    const params = `/${id}` + `/sort-exercises`;
    const URL = API_ENPOINTS.MY_WORKOUT + params;
    const { data } = await putRequest({
      API: URL,
      DATA: formData,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const getWorkoutSessionUser = async (payload: IPayloadWorkoutSessionUserData) => {
  try {
    const { workoutId } = payload;
    const params = workoutId ? `?workoutId=${workoutId}` : '';
    const URL = API_ENPOINTS.WORKOUT_SESSION + '/user' + params;
    const { data } = await getRequest({
      API: URL,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const createWorkoutSession = async (payload: IPayloadWorkoutSessions) => {
  try {
    const { formData } = payload;
    const URL = API_ENPOINTS.WORKOUT_SESSION;
    const { data } = await postRequest({
      API: URL,
      DATA: formData,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const updateWorkoutSessionService = async (payload: IPayloadWorkoutSessionsUpdate) => {
  try {
    const { formData, id } = payload;
    const URL = API_ENPOINTS.WORKOUT_SESSION + '/' + id;
    const { data } = await putRequest({
      API: URL,
      DATA: formData,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const updateWorkoutSessionFinishedStatus = async (
  payload: IPayloadWorkoutSessionsUpdateFinished,
) => {
  try {
    const { formData, id } = payload;
    const URL = API_ENPOINTS.WORKOUT_SESSION + '/status/' + id;
    const { data } = await putRequest({
      API: URL,
      DATA: formData,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const getWorkoutSessionDetail = async (payload: { id: string }) => {
  try {
    const { id } = payload;
    const URL = API_ENPOINTS.WORKOUT_SESSION + '/' + id;
    const { data } = await getRequest({
      API: URL,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const getWorkoutSessionsAdmin = async () => {
  try {
    const URL = API_ENPOINTS.WORKOUT_SESSION;
    const { data } = await getRequest({
      API: URL,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const getUserWorkoutSessionsService = async () => {
  try {
    const URL = API_ENPOINTS.WORKOUT_SESSION + '/user';
    const { data } = await getRequest({
      API: URL,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const createWorkoutCopy = async (payload: ICreateWorkoutCopy) => {
  try {
    const { id } = payload;
    const params = `/${id}`;
    const URL = API_ENPOINTS.MY_WORKOUT + '/copy' + params;
    const { data } = await postRequest({
      API: URL,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const exerciseAutoSuggest = async (query: any) => {
  try {
    const params = query;
    const URL = API_ENPOINTS.EXERCISE_SEARCH + params;
    const { data } = await getRequest({
      API: URL,
    });
    return data.data.map((item: any) => {
      return { value: item._id, label: item.name };
    });
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const fetchExerciseService = async () => {
  try {
    const URL = API_ENPOINTS.EXERCISES;
    const { data } = await getRequest({
      API: URL,
    });
    return data?.data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const fetchPublicExerciseService = async () => {
  try {
    const URL = API_ENPOINTS.PUBLIC_EXERCISES + '?selectedProperties=_id,deleted,name';
    const { data } = await getRequest({
      API: URL,
    });
    return data?.data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const generateWorkoutService = async (payload: { prompt?: any }) => {
  try {
    const URL = API_ENPOINTS.WORKOUT_GENERATE;
    const { data } = await postRequest({
      API: URL,
      DATA: { prompt: payload.prompt },
    });
    return data;
  } catch (error: any) {
    console.log('Error:', error);
    throw extractedErrorMessage(error?.response);
  }
};

export const reGenerateWorkoutService = async (payload: { prompt: string; id: string }) => {
  try {
    const { id, prompt } = payload;
    const URL = `/workouts/${id}/re-generate`;
    const { data } = await postRequest({
      API: URL,
      DATA: { prompt },
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const updateGenerateWorkoutService = async (payload: {
  exercises: ExerciseElement[];
  id: string;
}) => {
  try {
    const { id, exercises } = payload;
    const URL = `/workouts/${id}/update-generated`;
    const { data } = await putRequest({
      API: URL,
      DATA: { exercises },
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const generateWorkoutInstructionService = async (payload: {
  formData: { index: number; exercise: ExerciseElement };
  queryParams: { id: string };
}) => {
  const { formData, queryParams } = payload;
  try {
    const URL = API_ENPOINTS.MY_WORKOUT + `/${queryParams.id}` + '/generate-instructions';
    const { data } = await putRequest({
      API: URL,
      DATA: formData,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const updateExerciseNotesOfWorkoutRequest = async (
  payload: IPayloadUpdateExerciseToWorkout,
) => {
  try {
    const { queryParams, formData } = payload;
    const { id } = queryParams;
    const params = `/${id}` + `/update-notes`;
    const URL = API_ENPOINTS.MY_WORKOUT + params;
    const { data } = await putRequest({
      API: URL,
      DATA: formData,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const generateSaveGeneratedWorkoutService = async (payload: any) => {
  try {
    const URL = API_ENPOINTS.SAVE_WORKOUT_GENERATE;
    const { data } = await postRequest({
      API: URL,
      DATA: { ...payload },
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const getImageService = async () => {
  try {
    const URL = API_ENPOINTS.IMAGES + `?entityType=workout`;
    const { data } = await getRequest({
      API: URL,
    });
    return data?.data as IGeneratedWorkoutImage[];
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const createImageService = async (payload: { url: string }) => {
  try {
    const URL = API_ENPOINTS.IMAGES;
    const { data } = await postRequest({
      API: URL,
      DATA: { url: payload.url, entityType: 'workout' },
    });
    return data?.data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const deleteImageService = async (payload: { id: string }) => {
  try {
    const URL = API_ENPOINTS.IMAGES + `/${payload.id}`;
    const { data } = await deleteRequest({
      API: URL,
    });
    return data?.data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const generateWorkoutImageService = async (payload: { prompt: string }) => {
  try {
    const URL = API_ENPOINTS.GENERATED_IMAGES;
    const { data } = await postRequest({
      API: URL,
      DATA: { prompt: payload.prompt },
      timeout: 30000, // 30 seconds
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};
