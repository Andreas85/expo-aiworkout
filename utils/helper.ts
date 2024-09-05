import { ERROR_MESSAGE } from './appConstants';

export const extractedErrorMessage = (response: any) => {
  return response?.data?.result?.errText ?? ERROR_MESSAGE.SOMETHING_WENT_WRONG;
};
