import { ActionButton } from '@/components/atoms/ActionButton';
import Container from '@/components/atoms/Container';
import { AppTextInput } from '@/components/atoms/AppTextInput';
import TextContainer from '@/components/atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import { Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
// import { LinearGradient } from 'expo-linear-gradient';

import * as yup from 'yup';
import ImageContainer from '@/components/atoms/ImageContainer';
import { IMAGES } from '@/utils/images';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface Values {
  email: string;
}

const validationSchema = yup.object().shape({
  email: yup.string().required('Field is required').email('Invalid email format'),
});

export default function SignInIndexPage() {
  const [responseError, setResponseError] = useState({});

  const submitFormData = async (values: any) => {
    console.log('data: ', values);
  };

  const handleSubmit = async (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
    console.log('asdfasd');
    try {
      // Submit form data to your backend
      console.log(values);

      await submitFormData(values);
      setSubmitting(false);
    } catch (error: any) {
      setResponseError(error.errors || {});
      setSubmitting(false);
    }
  };

  console.log(responseError, 'errorserrorserrors');

  return (
    <Container style={tailwind('flex-1 grow px-4')} className="flex h-screen justify-between gap-2">
      <Container style={tailwind('relative flex-1')} className="relative h-full  lg:w-1/2">
        {/* <LinearGradient
          colors={['#007AFF', 'red']}
          // start={{ x: 0, y: 0 }}
          // end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}> */}
        <ImageContainer
          source={IMAGES.signinBanner}
          styleNative={[tailwind(` grow self-center`), { width: width }]}
          styleWeb={tailwind('h-full self-center ')}
          contentFit="cover"
        />
        <Container
          style={tailwind(
            'h-100 opacity-0.2 absolute left-0 top-0 z-40 w-full flex-1 grow bg-red-800',
          )}></Container>
        {/* </LinearGradient> */}
      </Container>
      <Container
        style={tailwind('flex-1')}
        className="flex h-full flex-col items-center justify-center lg:w-1/2">
        <Container
          style={tailwind('w-full flex-1 gap-y-4  self-center')}
          className="flex flex-col items-center gap-8 lg:w-1/2">
          <TextContainer
            style={[tailwind('text-9 self-center font-bold  text-white')]}
            className="text-center font-bold leading-9 lg:text-4xl"
            data={'Welcome back'}
          />
          <TextContainer
            style={tailwind('text-6 self-center font-bold ')}
            className="text-2xl"
            data={'Sign in to your account'}
          />
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ handleChange, handleSubmit, values, errors, isSubmitting }: any) => (
              <Container className="w-full space-y-4" style={tailwind('gap-y-4')}>
                <AppTextInput
                  value={values.email}
                  placeholder="Enter your email"
                  onChangeText={handleChange('email')}
                  errorMessage={errors?.email}
                  placeholderTextColor={'#fff'}
                  containerStyle={{ marginBottom: 20 }}
                />
                <ActionButton
                  uppercase={true}
                  label={'Log in using OTP'}
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
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
      </Container>
    </Container>
  );
}
