import { ExerciseElement } from '@/services/interfaces';
import React, { useState } from 'react';
import Container from './Container';
import TextContainer from './TextContainer';
import { tailwind } from '@/utils/tailwind';
import LabelContainer from './LabelContainer';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { ICON_SIZE } from '@/utils/appConstants';
import { Platform } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import CustomSwitch from './CustomSwitch';
import AppTextSingleInput from './AppTextSingleInput';

interface IExerciseCard {
  data: ExerciseElement;
  children: React.ReactNode;
  handleSubmit?: (data: any) => void;
}

const ExerciseCard = (props: IExerciseCard) => {
  const { data, children, handleSubmit } = props;
  const { isLargeScreen, isMobileDeviceOnly } = useWebBreakPoints();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState({
    weight: '',
    rest: data?.rest || '',
    reps: data?.reps || '',
    duration: data?.duration || '',
  });
  const toggleSwitch = () => setIsEnabled(!isEnabled);

  // Handle change in any text field and update the corresponding value in the state
  const handleTextChange = (fieldName: string, text: string) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [fieldName]: text,
    }));
    handleSubmit?.({ ...inputValues, [fieldName]: text });
  };

  const renderCard = () => {
    if (isLargeScreen) {
      return (
        <Container
          style={[
            Platform.select({
              web: tailwind(
                `mx-auto flex flex-1 flex-row items-center justify-start gap-2 self-stretch rounded-lg  bg-[#252425] p-2`,
              ),
            }),
          ]}>
          <Container style={tailwind(' ')}>{children}</Container>
          <Container
            style={[
              Platform.select({
                web: tailwind(`flex w-full flex-1 flex-col   gap-4 `),
              }),
            ]}>
            <Container
              style={tailwind(
                'flex  flex-1 flex-row items-center justify-between border-b border-solid border-b-[#767676] pb-1',
              )}>
              <TextContainer
                data={`${data.exercise.name}`}
                style={tailwind(
                  'flex-1 text-[0.9375rem] font-bold capitalize not-italic leading-5 tracking-[-0.005rem] text-white',
                )}
                numberOfLines={1}
              />
              <Container style={tailwind('')}>
                <CustomSwitch
                  isEnabled={isEnabled}
                  toggleSwitch={toggleSwitch}
                  label="Reps"
                  hasRightLabel={true}
                  labelRight={'Duration'}
                  labelStyle={
                    'text-white text-center text-[0.8125rem] not-italic font-normal leading-[150%]'
                  }
                  containerWebStyle={'gap-2 !my-0'}
                />
              </Container>
            </Container>
            <Container style={tailwind('flex-1 flex-row items-start justify-between ')}>
              <LabelContainer
                label={'Duplicate'}
                labelStyle={[
                  Platform.select({
                    web: tailwind(
                      ` flex-1 justify-between text-xs  font-normal  not-italic leading-[150%] text-white`,
                    ),
                    native: tailwind('text-xl font-bold'),
                  }),
                ]}
                containerStyle={[
                  Platform.select({
                    web: tailwind(''),
                    // native: tailwind('flex-1'),
                  }),
                ]}
                left={<Ionicons name="duplicate-sharp" color="#fff" size={ICON_SIZE} />}
              />
              <LabelContainer
                label={'Delete'}
                labelStyle={[
                  Platform.select({
                    web: tailwind(
                      ` flex-1 justify-between text-xs  font-normal  not-italic leading-[150%] text-white`,
                    ),
                    native: tailwind('text-xl font-bold'),
                  }),
                ]}
                containerStyle={[
                  Platform.select({
                    web: tailwind(''),
                    // native: tailwind('flex-1'),
                  }),
                ]}
                left={<Ionicons name="trash-bin" color="#fff" size={ICON_SIZE} />}
              />
            </Container>
            <Container style={tailwind('flex-1 flex-row items-center justify-between gap-2')}>
              <Container style={tailwind(`flex-col gap-3 ${isMobileDeviceOnly && 'flex-1'}`)}>
                <TextContainer
                  data={`Weight (kg)`}
                  style={tailwind(' text-center text-xs')}
                  numberOfLines={1}
                />
                <AppTextSingleInput
                  initialValues={{ weight: inputValues.weight }}
                  placeholder=""
                  fieldName={'weight'}
                  onChangeText={handleTextChange}
                  containerStyle={tailwind('w-full self-center border-none')}
                  containerStyleAppTextInput={tailwind(`${isMobileDeviceOnly && 'w-auto'} `)}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                  testInputStyle={tailwind('h-[1.875rem]  px-0 py-[0.3125rem]')}
                />
              </Container>
              <Container style={tailwind(`flex-col gap-3 ${isMobileDeviceOnly && 'flex-1'}`)}>
                <TextContainer data={`Rest (sec)`} style={tailwind('flex-1 text-center text-xs')} />
                <AppTextSingleInput
                  initialValues={{ rest: inputValues.rest }}
                  placeholder=""
                  fieldName={'rest'}
                  onChangeText={handleTextChange}
                  containerStyle={tailwind('self-center border-none')}
                  keyboardType="number-pad"
                  containerStyleAppTextInput={tailwind(`${isMobileDeviceOnly && 'w-auto'} `)}
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                  testInputStyle={tailwind('h-[1.875rem] flex-1 px-0 py-[0.3125rem]')}
                />
              </Container>
              <Container style={tailwind(`flex-col gap-3 ${isMobileDeviceOnly && 'flex-1'}`)}>
                <TextContainer
                  data={`Number of reps`}
                  style={tailwind('flex-1 text-center text-xs')}
                  numberOfLines={1}
                />
                <AppTextSingleInput
                  initialValues={{ reps: inputValues.reps }}
                  placeholder=""
                  fieldName={'reps'}
                  onChangeText={handleTextChange}
                  containerStyleAppTextInput={tailwind(`${isMobileDeviceOnly && 'w-auto'} `)}
                  containerStyle={tailwind('self-center border-none')}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                  testInputStyle={tailwind('h-[1.875rem] flex-1 px-0 py-[0.3125rem]')}
                />
              </Container>
              <Container style={tailwind(`flex-col gap-3 ${isMobileDeviceOnly && 'flex-1'}`)}>
                <TextContainer
                  data={`Duration (sec)`}
                  style={tailwind('flex-1 text-center text-xs')}
                  numberOfLines={1}
                />
                <AppTextSingleInput
                  initialValues={{ duration: inputValues.duration }}
                  placeholder=""
                  fieldName={'duration'}
                  onChangeText={handleTextChange}
                  containerStyle={tailwind('self-center border-none')}
                  keyboardType="number-pad"
                  containerStyleAppTextInput={tailwind(`${isMobileDeviceOnly && 'w-auto'} `)}
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                  testInputStyle={tailwind('h-[1.875rem] flex-1 px-0 py-[0.3125rem]')}
                />
              </Container>
            </Container>
          </Container>
        </Container>
      );
    }
    return (
      <Container
        style={[
          Platform.select({
            web: tailwind(
              `'w-[73.125rem] mx-auto flex-1 flex-row items-center justify-between gap-[2.3125rem] rounded-lg bg-[#252425] p-[1.25rem]`,
            ),
          }),
        ]}>
        <Container
          style={tailwind(
            'flex h-28 w-[10.1875rem] shrink-0 flex-row items-start items-center justify-center gap-5',
          )}>
          <Container style={tailwind(' ')}>{children}</Container>
          <TextContainer
            data={`${data.exercise.name}`}
            style={tailwind('flex-1')}
            numberOfLines={1}
          />
        </Container>
        <Container style={tailwind('')}>
          <CustomSwitch
            isEnabled={isEnabled}
            toggleSwitch={toggleSwitch}
            label="Reps"
            hasRightLabel={true}
            labelRight={'Duration'}
            labelStyle={'text-base'}
            containerWebStyle={'gap-3 h-28 !my-0'}
          />
        </Container>
        <Container style={tailwind('flex h-28 w-[33.75rem] shrink-0 flex-row items-center gap-9')}>
          <Container style={tailwind('flex-1 flex-col gap-3')}>
            <TextContainer data={`Weight (kg)`} style={tailwind('flex-1 text-center')} />
            <AppTextSingleInput
              initialValues={{ weight: inputValues.weight }}
              placeholder=""
              fieldName={'weight'}
              onChangeText={handleTextChange}
              containerStyle={tailwind('border-none')}
              keyboardType="number-pad"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </Container>
          <Container style={tailwind('flex-1 flex-col items-center justify-center gap-3')}>
            <TextContainer data={`Rest (sec)`} style={tailwind('flex-1 text-center ')} />
            <AppTextSingleInput
              initialValues={{ rest: inputValues.rest }}
              placeholder=""
              fieldName={'rest'}
              onChangeText={handleTextChange}
              containerStyle={tailwind('border-none')}
              keyboardType="number-pad"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </Container>
          <Container style={tailwind('flex-1 flex-col gap-3')}>
            <TextContainer data={`Number of reps`} style={tailwind('flex-1 text-center')} />
            <AppTextSingleInput
              initialValues={{ reps: inputValues.reps }}
              placeholder=""
              fieldName={'reps'}
              onChangeText={handleTextChange}
              containerStyle={tailwind('border-none')}
              keyboardType="number-pad"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </Container>
          <Container style={tailwind('flex-1 flex-col gap-3')}>
            <TextContainer data={`Duration (sec)`} style={tailwind('flex-1')} />
            <AppTextSingleInput
              initialValues={{ duration: inputValues.duration }}
              placeholder=""
              fieldName={'duration'}
              onChangeText={handleTextChange}
              containerStyle={tailwind('border-none')}
              keyboardType="number-pad"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </Container>
        </Container>
        <Container style={tailwind(' flex-col items-start justify-start gap-5')}>
          <LabelContainer
            label={'Duplicate'}
            labelStyle={[
              Platform.select({
                web: tailwind(
                  `flex-1  justify-between text-base  font-normal  not-italic leading-[150%] text-white`,
                ),
                native: tailwind('text-xl font-bold'),
              }),
            ]}
            containerStyle={[
              Platform.select({
                web: tailwind('w-[7.25rem] flex-1 gap-x-2 self-stretch'),
                // native: tailwind('flex-1'),
              }),
            ]}
            left={<Ionicons name="duplicate-sharp" color="#A27DE1" size={ICON_SIZE} />}
          />
          <LabelContainer
            label={'Delete'}
            labelStyle={[
              Platform.select({
                web: tailwind(
                  `flex-1 justify-between text-base font-normal  not-italic leading-[150%] text-white`,
                ),
                native: tailwind('text-xl font-bold'),
              }),
            ]}
            containerStyle={[
              Platform.select({
                web: tailwind('w-[7.25rem] flex-1 gap-x-2 self-stretch'),
                // native: tailwind('flex-1'),
              }),
            ]}
            left={<FontAwesome6 name="trash-can" color="#A27DE1" size={ICON_SIZE} />}
          />
        </Container>
      </Container>
    );
  };

  return <>{renderCard()}</>;
};

export default ExerciseCard;
