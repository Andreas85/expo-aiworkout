import { Platform, StyleProp, TextInputProps, ViewStyle } from 'react-native';
import React, { useRef } from 'react';
import { Formik } from 'formik';
import Container from './Container';
import { AppTextInput } from './AppTextInput';
import { tailwind } from '@/utils/tailwind';
import * as yup from 'yup';
import TextContainer from './TextContainer';

interface AppTextSingleInputProps {
  initialValues: any; // Initial form values
  validationSchema?: yup.ObjectSchema<any>; // Validation schema
  placeholder: string; // Placeholder for input field
  handleSubmit?: (values: any) => void; // Submission handler
  fieldName: string; // Name of the field
  containerStyle?: StyleProp<ViewStyle> | any; // Style for the input container
  keyboardType?: TextInputProps['keyboardType']; // Keyboard type
  autoCapitalize?: TextInputProps['autoCapitalize']; // Autocapitalize
  placeholderTextColor?: string; // Placeholder text color
  testInputStyle?: StyleProp<ViewStyle>;
  containerStyleAppTextInput?: StyleProp<ViewStyle>;
  right?: any;
  onChangeText?: (fieldName: string, text: string) => void;
}

const AppTextSingleInput: React.FC<AppTextSingleInputProps> = ({
  initialValues,
  validationSchema,
  placeholder,
  handleSubmit = () => {},
  fieldName,
  containerStyle,
  keyboardType = 'default',
  autoCapitalize = 'none',
  placeholderTextColor = '#fff',
  testInputStyle,
  containerStyleAppTextInput,
  onChangeText,
  ...rest
}) => {
  const formikRef = useRef<any>(null);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formikRef}
      enableReinitialize={true}
      onSubmit={handleSubmit}>
      {({ handleChange, handleSubmit, values, errors, touched }: any) => (
        <Container style={[tailwind('w-full gap-y-4'), containerStyle]}>
          <AppTextInput
            value={values[fieldName]}
            placeholder={placeholder}
            onChangeText={
              text => (onChangeText ? onChangeText(fieldName, text) : handleChange(fieldName)(text)) // Pass fieldName with onChangeText
            }
            errorMessage={
              errors?.[fieldName] && touched?.[fieldName] ? errors[fieldName] : undefined
            }
            keyboardType={keyboardType}
            placeholderTextColor={placeholderTextColor}
            testInputStyle={[
              { borderWidth: 0 },
              Platform.select({
                web: tailwind('text-center text-lg font-bold not-italic'),
              }),
              testInputStyle,
            ]}
            autoCapitalize={autoCapitalize}
            containerStyle={[
              Platform.select({
                web: tailwind('w-[6.375rem] rounded-lg bg-[#4B3E46] '),
                native: tailwind('rounded-lg bg-[#4B3E46] '),
              }),
              containerStyleAppTextInput,
            ]}
            {...rest}
          />
          {errors?.[fieldName] && touched?.[fieldName] && (
            <TextContainer style={{ color: 'red' }} data={errors[fieldName]} />
          )}
        </Container>
      )}
    </Formik>
  );
};

export default AppTextSingleInput;
