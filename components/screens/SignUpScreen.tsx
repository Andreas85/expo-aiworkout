import { ActionButton } from '@/components/atoms/ActionButton';
import Container from '@/components/atoms/Container';
import { AppTextInput } from '@/components/atoms/AppTextInput';
import TextContainer from '@/components/atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import { Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { Platform } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { loginService, loginUsingOTPService, registerService } from '@/services/auth';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import useBreakPoints from '@/hooks/useBreakPoints';
import '@/input.css';
import OtpTextInputWrapper from '../atoms/OtpTextInputWrapper';
import { Text } from '../Themed';
import { formatTimeForMinutes } from '@/utils/helper';
import React from 'react';
import KeyboardView from '../atoms/KeyboardView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IRegister } from '@/services/interfaces';

const validationSchema = yup.object().shape({
  firstName: yup.string().required('Field is required'),
  lastName: yup.string().required('Field is required'),
  email: yup.string().required('Field is required').email('Invalid email format'),
});

const initialValues: IRegister = {
  firstName: '',
  lastName: '',
  email: '',
};

const OTP_EXPIRED_TIME = 180; // minutes

export default function SignupIndexPage() {
  const { isMediumScreen, isLargeScreen } = useBreakPoints();
  const [responseError, setResponseError] = useState<string>();
  const [otpSendSuccess, setOtpSendSuccess] = useState<boolean>(false);
  const [timePassed, setTimePassed] = useState<number>(OTP_EXPIRED_TIME);
  const [otpCode, setOtpCode] = useState<string>('');
  const formikRef = useRef<any>();
  const authStore = useAuthStore();
  const [formValues, setFormValues] = useState<IRegister | null>(null);

  // Update the timer
  useEffect(() => {
    if (timePassed > 0 && otpSendSuccess) {
      const timer = setTimeout(() => setTimePassed(timePassed - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timePassed, otpSendSuccess]);

  const { mutate: register, isPending: isPendingRegister } = useMutation({
    mutationFn: registerService,
    onSuccess: data => {
      const responseData = data?.data;
      const extractedEmail = responseData?.user?.email;
      setFormValues({
        firstName: responseData?.user?.firstName,
        lastName: responseData?.user?.lastName,
        email: extractedEmail,
      });

      setOtpSendSuccess(true);
      setResponseError('');
    },
    onError: (error: string) => {
      setResponseError(error);
      setOtpSendSuccess(false);
    },
  });

  const { mutate: mutateResend, isPending: isPendingResend } = useMutation({
    mutationFn: loginService,
    onSuccess: (data, variables) => {
      // console.log('datas-uccess', { variables });
      setOtpSendSuccess(true);
      setResponseError('');
    },
    onError: (error: string) => {
      setResponseError(error);
      setOtpSendSuccess(false);
    },
  });

  const { mutate: loginOtp, isPending: loginOtpPending } = useMutation({
    mutationFn: loginUsingOTPService,
    onSuccess: data => {
      setResponseError('');
      setOtpSendSuccess(true);
      router.navigate('/');
      authStore.setAuthTokenAndUser(data?.data);
    },
    onError: (error: string) => {
      console.log(error, 'Erre');
      setResponseError(error);
    },
  });

  const submitFormData = async (values: Partial<IRegister>) => {
    const { email, firstName, lastName } = values;
    if (email) {
      const payload = {
        email,
        firstName,
        lastName,
      };
      register(payload);
    }
  };

  const handleSubmit = async (
    values: Omit<IRegister, 'firstName' | 'lastName'>,
    isResendOtp?: boolean,
  ) => {
    if (isResendOtp) {
      setTimePassed(OTP_EXPIRED_TIME);
      if (formValues?.email) {
        mutateResend({ formData: { input: formValues?.email } });
      }
      return;
    }
    await submitFormData(values);
  };

  const renderSiginForm = () => {
    if (!otpSendSuccess) {
      return renderForm();
    }
    return renderVerifyOtpForm();
  };

  const handleOtpVerification = () => {
    const payload = {
      formData: {
        input: formValues?.email ?? '',
        otp: otpCode,
      },
    };
    loginOtp(payload);
  };

  const handleChange = () => {
    setTimePassed(OTP_EXPIRED_TIME);
    setOtpSendSuccess(false);
  };

  const renderForm = () => {
    return (
      <Container
        style={Platform.select({
          native: tailwind(
            `h-full w-full flex-1 grow justify-center gap-y-4 self-center px-4 ${!isMediumScreen && 'px-40'}`,
          ),
          web: tailwind(
            `w-full grow justify-center gap-y-4 self-center bg-transparent px-4 ${isLargeScreen ? '' : 'px-40'}`,
          ),
        })}>
        <TextContainer
          style={tailwind('text-6 self-center font-bold ')}
          className="text-2xl"
          data={'Create an account'}
        />
        <Formik
          initialValues={{
            ...initialValues,
            ...formValues,
          }}
          validationSchema={validationSchema}
          innerRef={e => (formikRef.current = e)}
          enableReinitialize={true}
          onSubmit={values => handleSubmit(values)}>
          {({ handleChange, handleSubmit, values, errors, isSubmitting }: any) => (
            <Container
              className="w-full space-y-4"
              style={tailwind('w-full gap-y-4 bg-transparent')}>
              <AppTextInput
                value={values.firstName}
                placeholder="Enter your first name"
                onChangeText={handleChange('firstName')}
                errorMessage={errors?.firstName}
                keyboardType="name-phone-pad"
                placeholderTextColor={'#fff'}
                autoCapitalize="none"
                containerStyle={{ marginBottom: 20 }}
              />
              <AppTextInput
                value={values.lastName}
                placeholder="Enter your last name"
                onChangeText={handleChange('lastName')}
                errorMessage={errors?.lastName}
                keyboardType="name-phone-pad"
                placeholderTextColor={'#fff'}
                autoCapitalize="none"
                containerStyle={{ marginBottom: 20 }}
              />
              <AppTextInput
                value={values.email}
                placeholder="Enter your email"
                onChangeText={handleChange('email')}
                errorMessage={errors?.email}
                keyboardType="email-address"
                placeholderTextColor={'#fff'}
                autoCapitalize="none"
                containerStyle={{ marginBottom: 20 }}
              />
              {responseError && (
                <TextContainer
                  style={tailwind('text-3 text-center text-red-400')}
                  className="text-center text-sm !text-red-400"
                  data={responseError}
                />
              )}
              <ActionButton
                uppercase={true}
                label={'Create Account'}
                onPress={handleSubmit}
                isLoading={isPendingRegister}
                type="submit"
                style={tailwind('rounded-lg')}
              />
              <Container style={tailwind('flex-row items-center justify-center')}>
                <TextContainer
                  style={tailwind('text-sm')}
                  className="inline text-xs"
                  data={'Already have an account?'}
                />
                <TouchableOpacity
                  onPress={() => router.push('/signin')}
                  style={tailwind('p-1 font-bold text-WORKOUT_PURPLE')}>
                  <TextContainer style={tailwind('text-sm font-bold underline')} data={'Sign in'} />
                </TouchableOpacity>
              </Container>
            </Container>
          )}
        </Formik>
      </Container>
    );
  };

  const renderVerifyOtpForm = () => {
    return (
      <Container
        style={Platform.select({
          web: tailwind(
            `h-full w-full flex-1 grow justify-center gap-y-4 self-center px-4 ${!isMediumScreen && 'px-56'}`,
          ),
          native: tailwind(
            `h-full w-full flex-1 grow justify-center gap-y-4 self-center px-4 py-8`,
          ),
        })}
        className="items-center1 flex flex-col  gap-8 lg:w-1/2">
        <TextContainer
          style={[tailwind('text-7 justify-center self-center  font-bold text-white')]}
          className="text-center font-bold leading-9 lg:text-4xl"
          data={'Verify your email'}
        />

        <Text
          style={[
            Platform.select({
              web: tailwind('text-4 justify-center self-center  '),
              native: tailwind('text-5  self-center  '),
            }),
            tailwind('break-words'),
          ]}>
          We have send an OTP on you email {formValues?.email}
          &nbsp;(
          <Text
            onPress={handleChange}
            style={[
              Platform.select({
                web: tailwind('text-4'),
                native: tailwind('text-5 flex-1 '),
              }),
              tailwind('text-WORKOUT_PURPLE'),
            ]}>
            change
          </Text>
          ){/* </Pressable> */}
        </Text>
        <Container style={tailwind('gap-y-4')}>
          <OtpTextInputWrapper onChange={data => setOtpCode(data)} />
          {responseError && (
            <TextContainer
              style={tailwind('text-3 text-center text-red-400')}
              className="text-center text-sm !text-red-400"
              data={responseError}
            />
          )}
          <ActionButton
            uppercase={true}
            disabled={otpCode.length < 4}
            label={'Verify'}
            isLoading={loginOtpPending}
            onPress={handleOtpVerification}
            style={tailwind('h-8 grow rounded-lg')}
          />
          <Container style={tailwind('flex flex-1 flex-row items-center justify-between gap-y-4')}>
            <ActionButton
              uppercase={true}
              label={formatTimeForMinutes(timePassed)}
              isLoading={isPendingResend}
              style={tailwind('cursor-default rounded-lg bg-transparent p-0')}
            />
            <ActionButton
              uppercase={true}
              label={'Resend'}
              onPress={() => handleSubmit({ email: formValues?.email ?? '' }, true)}
              // isLoading={loginOtpPending}
              labelStyle={tailwind('font-bold text-WORKOUT_PURPLE')}
              style={tailwind('rounded-lg bg-transparent p-0 ')}
            />
          </Container>
        </Container>
      </Container>
    );
  };

  return (
    <KeyboardView
      nativeStyle={Platform.select({
        web: tailwind('w-full flex-1 flex-col self-center'),
        native: tailwind('w-full flex-1 flex-col self-center '),
      })}>
      {renderSiginForm()}
    </KeyboardView>
  );
}
