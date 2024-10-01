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
} from './interfaces';
import { deleteRequest, getRequest, postRequest, putRequest } from '@/utils/axios';
import { extractedErrorMessage } from '@/utils/helper';

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
  } catch (error) {
    return error;
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
  } catch (error) {
    return error;
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
  } catch (error) {
    return error;
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
  } catch (error) {
    return error;
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
  } catch (error) {
    return error;
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
  } catch (error) {
    return error;
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

export const updateWorkoutSession = async (payload: IPayloadWorkoutSessionsUpdate) => {
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

export const createWorkoutCopy = async (payload: ICreateWorkoutCopy) => {
  try {
    const { id } = payload;
    const params = `/${id}`;
    const URL = API_ENPOINTS.MY_WORKOUT + '/copy' + params;
    const { data } = await postRequest({
      API: URL,
    });
    return data;
  } catch (error) {
    return error;
  }
};
