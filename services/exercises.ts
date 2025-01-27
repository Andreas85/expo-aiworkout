import { API_ENPOINTS } from '@/services/api';
import { deleteRequest, getRequest, postRequest, putRequest } from '@/utils/axios';
import {
  IPayloadCreateExercise,
  IPayloadExerciseDetail,
  IPayloadUpdateExerciseData,
} from './interfaces';

export const fetchPublicExerciseService = async () => {
  try {
    const URL = API_ENPOINTS.PUBLIC_EXERCISES;
    const { data } = await getRequest({
      API: URL,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const fetchExerciseService = async () => {
  try {
    const URL = API_ENPOINTS.EXERCISES;
    const { data } = await getRequest({
      API: URL,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const addExerciseService = async (payload: IPayloadCreateExercise) => {
  try {
    const URL = API_ENPOINTS.EXERCISES;
    const { data } = await postRequest({
      API: URL,
      DATA: payload.formData,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const getPublicExerciseDetailById = async (payload: IPayloadExerciseDetail) => {
  try {
    const { id } = payload;
    const params = `/${id}`;
    const URL = API_ENPOINTS.PUBLIC_EXERCISES + params;
    const { data } = await getRequest({
      API: URL,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const getExerciseDetailById = async (payload: IPayloadExerciseDetail) => {
  try {
    const { id } = payload;
    const params = `/${id}`;
    const URL = API_ENPOINTS.EXERCISES + params;
    const { data } = await getRequest({
      API: URL,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteExerciseDetail = async (payload: IPayloadExerciseDetail) => {
  try {
    const { id } = payload;
    const params = `${id}`;
    const URL = API_ENPOINTS.EXERCISES + params;
    const { data } = await deleteRequest({
      API: URL,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const updateExerciseDataRequest = async (payload: IPayloadUpdateExerciseData) => {
  try {
    const { queryParams, formData } = payload;
    const { id } = queryParams;
    const params = `${id}`;
    const URL = API_ENPOINTS.EXERCISES + params;
    const { data } = await putRequest({
      API: URL,
      DATA: formData,
    });
    return data;
  } catch (error) {
    return error;
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
  } catch (error) {
    return error;
  }
};

export const myExerciseAutoSuggest = async () => {
  try {
    const URL = API_ENPOINTS.EXERCISES;
    const { data } = await getRequest({
      API: URL,
    });
    return data.data.map((item: any) => {
      return { value: item._id, label: item.name };
    });
  } catch (error) {
    return error;
  }
};
