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
    weight: data?.weight ?? '0',
    rest: data?.rest ?? '0',
    reps: data?.reps ?? '0',
    duration: data?.duration ?? '0',
  });
  const toggleSwitch = () => setIsEnabled(!isEnabled);

  // Handle change in any text field and update the corresponding value in the state
  const handleTextChange = (fieldName: string, text: string) => {
    // Convert the string to a number if it's numeric, otherwise fallback to original text or set default as 0
    const numericValue = isNaN(Number(text)) ? text : Number(text);

    setInputValues(prevValues => ({
      ...prevValues,
      [fieldName]: numericValue,
    }));

    handleSubmit?.({ ...inputValues, [fieldName]: numericValue });
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
              native: tailwind(
                'mb-1 flex-row items-center justify-between gap-2 rounded-lg bg-[#252425] px-1',
              ),
            }),
          ]}>
          <Container style={tailwind(' ')}>{children}</Container>
          <Container
            style={[
              Platform.select({
                web: tailwind(`flex w-full flex-1 flex-col   gap-4 `),
                native: tailwind('flex w-full flex-1 flex-col   gap-4'),
              }),
            ]}>
            <Container
              style={[
                Platform.select({
                  web: tailwind(
                    'flex  flex-1 flex-row items-center justify-between border-b border-solid border-b-[#767676] pb-1',
                  ),
                  native: tailwind(
                    ' flex-1 flex-row items-center justify-between border-b border-solid border-b-[#767676] ',
                  ),
                }),
              ]}>
              <TextContainer
                data={`${data.exercise.name}`}
                style={[
                  Platform.select({
                    web: tailwind(
                      'flex-1 text-[0.9375rem] font-bold capitalize not-italic leading-5 tracking-[-0.005rem] text-white',
                    ),
                    native: tailwind(
                      'text-[0.9375rem] font-bold capitalize not-italic leading-5 tracking-[-0.005rem] text-white',
                    ),
                  }),
                ]}
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
                  containerStyle={tailwind('my-0 ')}
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
                    native: tailwind('text-sm font-bold'),
                  }),
                ]}
                containerStyle={[
                  Platform.select({
                    web: tailwind(''),
                    // native: tailwind('flex-1'),
                  }),
                ]}
                left={
                  <Ionicons
                    name="duplicate-sharp"
                    color="#A27DE1"
                    size={Platform.OS === 'web' ? ICON_SIZE : 16}
                  />
                }
              />
              <LabelContainer
                label={'Delete'}
                labelStyle={[
                  Platform.select({
                    web: tailwind(
                      ` flex-1 justify-between text-xs  font-normal  not-italic leading-[150%] text-white`,
                    ),
                    native: tailwind('ttext-sm font-bold'),
                  }),
                ]}
                containerStyle={[
                  Platform.select({
                    web: tailwind(''),
                    // native: tailwind('flex-1'),
                  }),
                ]}
                left={
                  <FontAwesome6
                    name="trash-can"
                    color="#A27DE1"
                    size={Platform.OS === 'web' ? ICON_SIZE : 16}
                  />
                }
              />
            </Container>
            <Container
              style={[
                Platform.select({
                  web: tailwind('flex-1 flex-row items-center justify-between gap-2'),
                  native: tailwind('flex-1 flex-row items-center justify-between gap-2'),
                }),
              ]}>
              <Container
                style={[
                  Platform.select({
                    web: tailwind(`flex-col gap-3 ${isMobileDeviceOnly && 'flex-1'}`),
                    native: tailwind(`flex-1 flex-col gap-3`),
                  }),
                ]}>
                <TextContainer
                  data={`Weight (kg)`}
                  style={[
                    Platform.select({
                      web: tailwind(' text-center text-xs'),
                      native: tailwind('text-2.5 text-center'),
                    }),
                  ]}
                  numberOfLines={1}
                />
                <AppTextSingleInput
                  initialValues={{ weight: inputValues.weight }}
                  placeholder=""
                  fieldName={'weight'}
                  onChangeText={handleTextChange}
                  containerStyle={[
                    Platform.select({
                      web: tailwind('w-full self-center border-none'),
                      native: tailwind('flex-1 self-center border-none '),
                    }),
                  ]}
                  containerStyleAppTextInput={Platform.select({
                    web: tailwind(`${isMobileDeviceOnly && 'w-auto'} `),
                    native: tailwind(`w-auto flex-1 `),
                  })}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                  testInputStyle={[
                    Platform.select({
                      web: tailwind('h-[1.875rem]  px-0 py-[0.3125rem]'),
                      native: tailwind('h-[1.875rem]  px-0 py-[0.3125rem]'),
                    }),
                  ]}
                />
              </Container>
              <Container
                style={Platform.select({
                  web: tailwind(`flex-col gap-3 ${isMobileDeviceOnly && 'flex-1'}`),
                  native: tailwind(`flex-1 flex-col gap-3`),
                })}>
                <TextContainer
                  data={`Rest (sec)`}
                  style={[
                    Platform.select({
                      web: tailwind('text-center text-xs'),
                      native: tailwind('text-2.5 text-center'),
                    }),
                  ]}
                />
                <AppTextSingleInput
                  initialValues={{ rest: inputValues.rest }}
                  placeholder=""
                  fieldName={'rest'}
                  onChangeText={handleTextChange}
                  containerStyle={Platform.select({
                    web: tailwind('w-full self-center border-none'),
                    native: tailwind('flex-1 self-center border-none'),
                  })}
                  containerStyleAppTextInput={Platform.select({
                    web: tailwind(`${isMobileDeviceOnly && 'w-auto'} `),
                    native: tailwind(`w-auto flex-1 `),
                  })}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                  testInputStyle={[
                    Platform.select({
                      web: tailwind('h-[1.875rem]  px-0 py-[0.3125rem]'),
                      native: tailwind('h-[1.875rem]  px-0 py-[0.3125rem]'),
                    }),
                  ]}
                />
              </Container>
              <Container
                style={Platform.select({
                  web: tailwind(`flex-col gap-3 ${isMobileDeviceOnly && 'flex-1'}`),
                  native: tailwind(`flex-1 flex-col gap-3`),
                })}>
                <TextContainer
                  data={`Number of reps`}
                  style={[
                    Platform.select({
                      web: tailwind('text-center text-xs'),
                      native: tailwind('text-2.5 text-center'),
                    }),
                  ]}
                  numberOfLines={1}
                />
                <AppTextSingleInput
                  initialValues={{ reps: inputValues.reps }}
                  placeholder=""
                  fieldName={'reps'}
                  onChangeText={handleTextChange}
                  containerStyleAppTextInput={Platform.select({
                    web: tailwind(`${isMobileDeviceOnly && 'w-auto'} `),
                    native: tailwind(`w-auto flex-1 `),
                  })}
                  containerStyle={tailwind('self-center border-none')}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                  testInputStyle={[
                    Platform.select({
                      web: tailwind('h-[1.875rem]  px-0 py-[0.3125rem]'),
                      native: tailwind('h-[1.875rem]  px-0 py-[0.3125rem]'),
                    }),
                  ]}
                />
              </Container>
              <Container
                style={Platform.select({
                  web: tailwind(`flex-col gap-3 ${isMobileDeviceOnly && 'flex-1'}`),
                  native: tailwind(`flex-1 flex-col gap-3`),
                })}>
                <TextContainer
                  data={`Duration (sec)`}
                  style={[
                    Platform.select({
                      web: tailwind('text-center text-xs'),
                      native: tailwind('text-2.5 text-center'),
                    }),
                  ]}
                  numberOfLines={1}
                />
                <AppTextSingleInput
                  initialValues={{ duration: inputValues.duration }}
                  placeholder=""
                  fieldName={'duration'}
                  onChangeText={handleTextChange}
                  containerStyle={tailwind('self-center border-none')}
                  keyboardType="number-pad"
                  containerStyleAppTextInput={Platform.select({
                    web: tailwind(`${isMobileDeviceOnly && 'w-auto'} `),
                    native: tailwind(`w-auto flex-1 `),
                  })}
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                  testInputStyle={[
                    Platform.select({
                      web: tailwind('h-[1.875rem]  px-0 py-[0.3125rem]'),
                      native: tailwind('h-[1.875rem]  px-0 py-[0.3125rem]'),
                    }),
                  ]}
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
