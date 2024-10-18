import { ExerciseElement } from '@/services/interfaces';
import React, { useEffect, useState } from 'react';
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
import ConfirmationModal from '../modals/ConfirmationModal';
import useModal from '@/hooks/useModal';
import { useMutation } from '@tanstack/react-query';
import {
  addExerciseToWorkoutRequest,
  removeExerciseToWorkoutRequest,
  updateExerciseToWorkoutRequest,
} from '@/services/workouts';
import { useLocalSearchParams } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';
import AddExercise from '../modals/AddExercise';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { debounce } from 'lodash';

interface IExerciseCard {
  data: ExerciseElement;
  children: React.ReactNode;
  handleSubmit?: (data: any) => void;
}

const ExerciseCard = (props: IExerciseCard) => {
  const { data, children, handleSubmit } = props;

  const { setWorkoutDetail } = useWorkoutDetailStore();
  const { slug } = useLocalSearchParams() as any;
  const toast = useToast();
  const { isLargeScreen, isMobileDeviceOnly } = useWebBreakPoints();
  const { hideModal, showModal, openModal } = useModal();
  const {
    hideModal: hideModalDeleteWorkoutExercise,
    showModal: showModalDeleteWorkoutExercise,
    openModal: openModalDeleteWorkoutExercise,
  } = useModal();
  const [isEnabled, setIsEnabled] = useState<boolean>(!data?.reps);
  const [inputValues, setInputValues] = useState<any>({
    weight: data?.weight ? data?.weight + '' : '',
    rest: data?.rest ? data?.rest + '' : '',
    reps: data?.reps ? data?.reps + '' : '',
    duration: data?.duration ? data?.duration + '' : '',
  });
  const toggleSwitch = () => {
    setIsEnabled(prev => {
      return !prev;
    });
    // console.log('inputValues', inputValues);
    updateExerciseRequest(inputValues);
  };

  useEffect(() => {
    setInputValues({
      weight: data?.weight ? data?.weight + '' : '',
      rest: data?.rest ? data?.rest + '' : '',
      reps: data?.reps ? data?.reps + '' : '',
      duration: data?.duration ? data?.duration + '' : '',
    });
  }, [data]);

  // Separate function to handle the payload and mutation
  const updateExerciseRequest = (updatedValues: any) => {
    // Prepare the 'send' object, ensuring numeric values where applicable
    const send = Object.entries(updatedValues).reduce((acc: any, [key, value]) => {
      acc[key] = isNaN(Number(value)) ? value : Number(value);
      return acc;
    }, {});

    // Modify 'reps' based on 'isEnabled'
    const payload = {
      formData: {
        index: data?.order,
        exercise: {
          ...send,
          reps: isEnabled ? 0 : send.reps, // Ensure 'reps' is set to 0 when 'isEnabled' is true
        },
      },
      queryParams: { id: slug },
    };

    // console.log(payload);

    // Call mutation function
    mutateUpdateExerciseToWorkoutRequest(payload);

    return send; // Return the send object if needed for further usage
  };

  const handleTextChange = debounce((fieldName: string, text: string) => {
    // Convert the input text to a number if it's numeric, otherwise keep it as text
    // const numericValue = isNaN(Number(text)) ? text : Number(text);

    setInputValues((prevValues: any) => {
      const updatedValues = {
        ...prevValues,
        [fieldName]: text,
      };

      // Reuse the updateExerciseRequest function
      const send = updateExerciseRequest(updatedValues);

      handleSubmit?.(send);

      return updatedValues;
    });
  }, 300); // Adjust debounce time as needed

  const { mutate: mutateAddExercise } = useMutation({
    mutationFn: addExerciseToWorkoutRequest,
    onSuccess: async data => {
      setWorkoutDetail(data?.data);
    },
  });

  const handleDuplicateExerciseCard = () => {
    const payload = {
      formData: {
        name: data?.exercise.name,
        exerciseId: data?.exercise?._id,
        duration: data?.duration,
        reps: data?.reps,
        rest: data?.rest,
        weight: data?.weight,
      },
      queryParams: { id: slug },
    };

    mutateAddExercise(payload);
  };

  const {
    mutate: mutateRemoveExerciseToWorkoutRequest,
    isPending: isPendingDeleteWorkoutExercise,
  } = useMutation({
    mutationFn: removeExerciseToWorkoutRequest,
    onSuccess: async data => {
      setWorkoutDetail(data?.data);
    },
    onError: (error: any) => {
      toast.show(error, { type: 'danger' });
    },
    onSettled: () => {
      hideModalDeleteWorkoutExercise();
    },
  });

  const { mutate: mutateUpdateExerciseToWorkoutRequest } = useMutation({
    mutationFn: updateExerciseToWorkoutRequest,
    onSuccess: async data => {
      setWorkoutDetail(data?.data);
      toast.show('Exercise Updated', { type: 'success' });
    },
    onError: (error: any) => {
      toast.show(error, { type: 'danger' });
    },
    onSettled: () => {
      hideModalDeleteWorkoutExercise();
    },
  });

  const handleDeleteExerciseCard = () => {
    showModalDeleteWorkoutExercise();
  };

  const handleDeleteWorkoutExercise = () => {
    // console.log('Api called to delete workout exercise', data?.order);
    mutateRemoveExerciseToWorkoutRequest({
      formData: { index: data?.order },
      queryParams: { id: slug },
    });
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
                label={'Add New'}
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
                // onPress={showModal}
                left={
                  <Ionicons
                    name="add-circle-outline"
                    color="#A27DE1"
                    size={Platform.OS === 'web' ? ICON_SIZE : 16}
                  />
                }
              />
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
                onPress={handleDuplicateExerciseCard}
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
                    native: tailwind('font-bold'),
                  }),
                ]}
                onPress={handleDeleteExerciseCard}
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
              {!isEnabled && (
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
              )}
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
              containerStyleAppTextInput={Platform.select({
                web: tailwind(`w-full`),
              })}
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
              containerStyleAppTextInput={Platform.select({
                web: tailwind(`w-full`),
              })}
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </Container>
          {isEnabled && (
            <Container style={tailwind('flex-1 flex-col gap-3')}>
              <TextContainer data={`Number of reps`} style={tailwind('flex-1 text-center')} />
              <AppTextSingleInput
                initialValues={{ reps: inputValues.reps }}
                placeholder=""
                fieldName={'reps'}
                onChangeText={handleTextChange}
                containerStyleAppTextInput={Platform.select({
                  web: tailwind(`w-full`),
                })}
                containerStyle={tailwind('border-none')}
                keyboardType="number-pad"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </Container>
          )}
          <Container style={tailwind('flex-1 flex-col gap-3')}>
            <TextContainer data={`Duration (sec)`} style={tailwind('flex-1 text-center')} />
            <AppTextSingleInput
              initialValues={{ duration: inputValues.duration }}
              placeholder=""
              fieldName={'duration'}
              onChangeText={handleTextChange}
              containerStyle={tailwind('border-none')}
              containerStyleAppTextInput={Platform.select({
                web: tailwind(`w-full`),
              })}
              keyboardType="number-pad"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </Container>
        </Container>
        <Container style={tailwind(' flex-col items-start justify-start gap-5')}>
          <LabelContainer
            label={'Add New'}
            labelStyle={[
              Platform.select({
                web: tailwind(
                  `flex-1  justify-between text-base  font-normal  not-italic leading-[150%] text-white`,
                ),
                native: tailwind('text-xl font-bold'),
              }),
            ]}
            // onPress={showModal}
            containerStyle={[
              Platform.select({
                web: tailwind('w-[7.25rem] flex-1 gap-x-2 self-stretch'),
                // native: tailwind('flex-1'),
              }),
            ]}
            left={<Ionicons name="add-circle-outline" color="#A27DE1" size={ICON_SIZE} />}
          />
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
            onPress={handleDuplicateExerciseCard}
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
            onPress={handleDeleteExerciseCard}
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

  return (
    <>
      {renderCard()}

      {openModalDeleteWorkoutExercise && (
        <ConfirmationModal
          isModalVisible={openModalDeleteWorkoutExercise}
          closeModal={hideModalDeleteWorkoutExercise}
          message="Are you sure you want to remove the exercise from workout ?"
          labelAction="Delete"
          isLoading={isPendingDeleteWorkoutExercise}
          handleAction={handleDeleteWorkoutExercise}
        />
      )}
      {openModal && <AddExercise isModalVisible={openModal} closeModal={hideModal} data={data} />}
    </>
  );
};

export default ExerciseCard;
