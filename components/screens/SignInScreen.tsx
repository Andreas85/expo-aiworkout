import { ActionButton } from '@/components/atoms/ActionButton';
import Container from '@/components/atoms/Container';
import { AppTextInput } from '@/components/atoms/AppTextInput';
import TextContainer from '@/components/atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import { Formik, FormikHelpers } from 'formik';
import { useRef, useState } from 'react';
import * as yup from 'yup';
import { IMAGES } from '@/utils/images';
import { Image, ScrollView, StyleSheet } from 'react-native';
import KeyboardView from '@/components/atoms/KeyboardView';
import { useMutation } from '@tanstack/react-query';
import { loginService, loginUsingOTPService } from '@/services/auth';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import useBreakPoints from '@/hooks/useBreakPoints';
import '@/style.css';

interface Values {
  email: string;
}

const validationSchema = yup.object().shape({
  email: yup.string().required('Field is required').email('Invalid email format'),
});

export default function SignInIndexPage() {
  const { isMediumScreen } = useBreakPoints();
  const [responseError, setResponseError] = useState<string>();
  const [otpSendSuccess, setOtpSendSuccess] = useState<boolean>(false);
  // const [otpCode, setOtpCode] = useState<string>('3291');
  const [email, setEmail] = useState<string>();
  const formikRef = useRef<any>();
  const authStore = useAuthStore();

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginService,
    onSuccess: data => {
      console.log('datas-uccess', data);
      setEmail(formikRef.current?.values?.email);
      setOtpSendSuccess(true);
    },
    onError: (error: string) => {
      setEmail('');
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

  const submitFormData = async (values: { email: string }) => {
    const { email } = values;
    const payload = {
      formData: {
        input: email,
      },
    };
    login(payload);
  };

  const handleSubmit = async (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
    await submitFormData(values);
  };

  const renderSiginForm = () => {
    if (!otpSendSuccess) {
      return renderForm();
    }
    return renderVerifyOtpForm();
  };

  const handleOtpVerification = async (values: { otpCode: string }) => {
    const { otpCode } = values;
    const payload = {
      formData: {
        input: email ?? '',
        otp: otpCode,
      },
    };
    loginOtp(payload);
  };

  const renderForm = () => {
    return (
      <Container
        style={[
          tailwind(
            `h-full w-full flex-1 grow justify-center gap-y-4 self-center px-4 ${!isMediumScreen && 'px-40'}`,
          ),
        ]}
        className="items-center1 flex  w-96 flex-col gap-8 ">
        <TextContainer
          style={[tailwind('text-9 w-full text-center font-bold text-white')]}
          className="text-center text-3xl font-bold leading-9 lg:text-4xl"
          data={'Welcome back'}
        />
        <TextContainer
          style={tailwind('text-6 self-center font-bold ')}
          className="text-2xl"
          data={'Sign in to your account'}
        />
        <Formik
          initialValues={{ email: 'saurabhshukla3107@gmail.com' }}
          validationSchema={validationSchema}
          innerRef={e => (formikRef.current = e)}
          enableReinitialize={true}
          onSubmit={handleSubmit}>
          {({ handleChange, handleSubmit, values, errors, isSubmitting }: any) => (
            <Container className="w-full space-y-4" style={tailwind('w-full gap-y-4')}>
              <AppTextInput
                value={values.email}
                placeholder="Enter your email"
                onChangeText={handleChange('email')}
                errorMessage={errors?.email}
                placeholderTextColor={'#fff'}
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
                label={'Log in using OTP'}
                onPress={handleSubmit}
                isLoading={isPending}
                style={tailwind('rounded-lg')}
              />
              <Container className="text-center" style={tailwind('flex-row self-center')}>
                <TextContainer
                  style={tailwind('text-sm')}
                  className="inline text-xs"
                  data={'Not Registered?'}
                />
                <TextContainer
                  style={tailwind('text-sm font-bold')}
                  className="inline text-xs font-medium"
                  data={' Create an account'}
                />
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
        style={tailwind(
          `h-full w-full flex-1 grow justify-center gap-y-4 self-center px-4 ${!isMediumScreen && 'px-56'}`,
        )}
        className="items-center1 flex flex-col gap-8 lg:w-1/2">
        <TextContainer
          style={[tailwind('text-9 justify-center self-center  font-bold text-white')]}
          className="text-center font-bold leading-9 lg:text-4xl"
          data={'Verify your email'}
        />
        <TextContainer
          style={tailwind('text-4 justify-center self-center font-bold')}
          className=""
          data={`We have send an OTP on you email ${email} `}
        />
        <Container className="mb-4 w-full flex-col space-y-4" style={tailwind('gap-y-4')}>
          <Formik
            initialValues={{ otpCode: '' }}
            enableReinitialize={true}
            onSubmit={handleOtpVerification}>
            {({ handleChange, handleSubmit, values, errors, isSubmitting }: any) => (
              <Container className="w-full space-y-4" style={tailwind('gap-y-4')}>
                <AppTextInput
                  value={values.otpCode}
                  placeholder="Enter your otp"
                  onChangeText={handleChange('otpCode')}
                  errorMessage={errors?.otpCode}
                  placeholderTextColor={'#fff'}
                  containerStyle={{ marginBottom: 20 }}
                  keyboardType="phone-pad"
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
                  label={'Verify'}
                  onPress={handleSubmit}
                  isLoading={loginOtpPending}
                  style={tailwind('rounded-lg')}
                />
                {/* <Container style={tailwind('flex justify-between')}>
                  <Container>
                    {{ formatTimeForMinutes(timePassed) }}
                  </Container>
                <Container style={tailwind('')} >
                  Resend</Container>
                </Container> */}
              </Container>
            )}
          </Formik>
        </Container>
      </Container>
    );
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <Container
          style={[styles.containerRowView, { flexDirection: isMediumScreen ? 'column' : 'row' }]}>
          <Container style={styles.card}>
            <Image
              resizeMode="cover"
              style={[
                styles.storeIcon,
                {
                  height: '100%',
                  paddingHorizontal: 0,
                  margin: 0,
                },
              ]}
              source={IMAGES.signinBanner}
            />
          </Container>
          <Container style={styles.card}>
            <KeyboardView nativeStyle={tailwind('w-full flex-1 flex-col self-center')}>
              {renderSiginForm()}
            </KeyboardView>
          </Container>
        </Container>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  storeIcon: {
    width: 'auto',
    margin: 10,
    position: 'relative',
  },
  card: {
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
    flexGrow: 1,
  },
  containerRowView: {
    flex: 1,
    flexWrap: 'wrap',
    width: 'auto',
  },
});
