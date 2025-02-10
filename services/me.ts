import { deleteRequest, getRequest, putRequest } from '@/utils/axios';
import { API_ENPOINTS } from './api';
import { extractedErrorMessage } from '@/utils/helper';

interface IProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export const getProfileService = async () => {
  try {
    const URL = API_ENPOINTS.ME;
    const { data } = await getRequest({
      API: URL,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const updateProfileService = async (payload: IProfile) => {
  try {
    const URL = API_ENPOINTS.ME;
    const { data } = await putRequest({
      API: URL,
      DATA: payload,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const deleteProfileService = async () => {
  try {
    const URL = API_ENPOINTS.ME;
    const { data } = await deleteRequest({
      API: URL,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};
