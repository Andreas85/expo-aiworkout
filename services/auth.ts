import { postRequest } from '@/utils/axios';
import { API_ENPOINTS } from './api';
import { extractedErrorMessage } from '@/utils/helper';
import { IRegister } from './interfaces';

export const registerService = async (payload: IRegister) => {
  try {
    const URL = API_ENPOINTS.REGISTER;
    const { data } = await postRequest({
      API: URL,
      DATA: payload,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const loginService = async (payload: { formData: { input: string } }) => {
  try {
    const URL = API_ENPOINTS.LOGIN;
    const { data } = await postRequest({
      API: URL,
      DATA: payload.formData,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const loginUsingOTPService = async (payload: {
  formData: { input: string; otp: string };
}) => {
  try {
    const URL = API_ENPOINTS.SIGNIN_USING_OTP;
    const { data } = await postRequest({
      API: URL,
      DATA: payload.formData,
    });
    return data;
  } catch (error: any) {
    throw extractedErrorMessage(error?.response);
  }
};

export const forgetService = async (payload: any) => {
  try {
    const URL = API_ENPOINTS.FORGET;
    const { data } = await postRequest({
      API: URL,
      DATA: payload.formData,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const resetService = async (payload: any) => {
  try {
    const URL = API_ENPOINTS.RESET;
    const { data } = await postRequest({
      API: URL,
      DATA: payload.formData,
    });
    return data;
  } catch (error) {
    return error;
  }
};
