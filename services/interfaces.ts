export interface ICreateWorkoutFormData {
  name?: string;
  isPublic?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAddExerciseToWorkout {
  exerciseId: string;
  name?: string;
  duration: any;
  reps?: any;
  rest?: any;
  weight?: any;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUpdateExerciseToWorkout {
  index: number;
  exercise: {
    duration: number;
    reps?: number;
  };
}

export interface IPayloadCreateWorkout {
  formData: ICreateWorkoutFormData;
}

export interface IPayloadWorkoutDetail {
  id: any;
}

export interface IRemoveExerciseToWorkout {
  index: any;
}

export interface IPayloadUpdateWorkoutData {
  formData: ICreateWorkoutFormData;
  queryParams: { id: any };
}

export interface IPayloadAddExerciseToWorkout {
  isDuplicated?: boolean;
  formData: IAddExerciseToWorkout;
  queryParams: { id: any };
}

export interface IPayloadRemoveExerciseToWorkout {
  formData: IRemoveExerciseToWorkout;
  queryParams: { id: any };
}

export interface IPayloadUpdateExerciseToWorkout {
  formData: any;
  queryParams: { id: any };
}

export interface IPayloadSortExercises {
  formData: any;
  queryParams: { id: any };
}

export interface IPayloadWorkoutSessions {
  formData: { id: string; createdAt?: Date; updatedAt?: Date };
}

export interface IPayloadWorkoutSessionsUpdate {
  id: string;
  formData: {
    exerciseId: string;
    repsTaken?: number;
    durationTaken: number;
    isCompleted: boolean;
  };
}

export interface IPayloadWorkoutSessionUserData {
  workoutId?: string;
}

export interface IPayloadWorkoutSessionsUpdateFinished {
  id: string;
  formData: {
    status: string;
  };
}

export interface ICreateWorkoutCopy {
  id: string;
}

export interface User {
  _id: string;
  deleted: boolean;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Workout {
  totalDuration: number;
  _id: string;
  deleted: boolean;
  name: string;
  totalExercises: number;
  isPublic: boolean;
  createdBy: string;
  exercises: ExerciseElement[];
  createdAt: Date;
  updatedAt: Date;
  slug?: string;
  status?: string;
  remainingTime?: number;
  __v: number;
  workoutId?: string;
}

export interface ExerciseElement {
  name?: string;
  _id: string;
  exercise: ExerciseExercise;
  reps: number;
  rest: number;
  weight: number;
  duration: number;
  order: number;
  type?: string;
  notes?: string;
  isCompleted?: boolean;
  exerciseId?: string;
  durationTaken?: number;
  repsTaken?: number;
  preExerciseOrder?: number; //only for rest exercise
  preExerciseId?: string; //only for rest exercise
}

export interface ExerciseExercise {
  _id: string;
  name: string;
  slug: string;
}

export interface ICreateExerciseFormData {
  name: string;
}

export interface IPayloadCreateExercise {
  formData: ICreateExerciseFormData;
}

export interface IPayloadExerciseDetail {
  id: any;
}

export interface IPayloadUpdateExerciseData {
  formData: any;
  queryParams: { id: any };
}

export interface IRegister {
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface WorkoutSessionResponseData {
  _id: string;
  deleted: boolean;
  workout: Workout;
  name?: string; // local workout name
  status: 'FINISHED' | 'PENDING';
  totalDuration: number;
  totalExercisesCompleted: number;
  totalWeightTaken: number;
  totalRestTaken: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
