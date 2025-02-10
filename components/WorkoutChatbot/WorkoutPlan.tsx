import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

interface WorkoutPlanProps {
  plan: {
    exercises: Exercise[];
    frequency: string;
    duration: string;
    notes?: string;
  };
  onSave: () => void;
}

export function WorkoutPlanView({ plan, onSave }: WorkoutPlanProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="dumbbell" size={24} color="#6b46c1" />
        <Text style={styles.title}>Your Personalized Workout Plan</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Details</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Frequency:</Text>
          <Text style={styles.detailText}>{plan.frequency}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailText}>{plan.duration}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {plan.exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.exerciseDetails}>
              <Text style={styles.exerciseText}>Sets: {exercise.sets}</Text>
              <Text style={styles.exerciseText}>Reps: {exercise.reps}</Text>
              <Text style={styles.exerciseText}>Rest: {exercise.rest}</Text>
            </View>
          </View>
        ))}
      </View>

      {plan.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <Text style={styles.notesText}>{plan.notes}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Save Workout Plan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a202c',
    padding: 16,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: '#bbb',
  },
  detailText: {
    color: 'white',
    fontWeight: 'bold',
  },
  exerciseCard: {
    backgroundColor: '#2c2c3e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  exerciseText: {
    color: '#bbb',
  },
  notesText: {
    color: '#bbb',
  },
  saveButton: {
    backgroundColor: '#6b46c1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

// import React from 'react';
// import { Dumbbell } from 'lucide-react';
// import { WorkoutPlan } from '@/types';

// interface WorkoutPlanProps {
//   plan: WorkoutPlan;
//   onSave: () => void;
// }

// export function WorkoutPlanView({ plan, onSave }: WorkoutPlanProps) {
//   return (
//     <div className="rounded-lg bg-gray-900 p-6">
//       <div className="mb-6 flex items-center gap-2">
//         <Dumbbell className="h-6 w-6 text-purple-500" />
//         <h2 className="text-2xl font-bold text-white">Your Personalized Workout Plan</h2>
//       </div>

//       <div className="space-y-6">
//         <div>
//           <h3 className="mb-2 text-lg font-semibold text-white">Workout Details</h3>
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <span className="text-gray-400">Frequency:</span>
//               <p className="font-medium text-white">{plan.frequency}</p>
//             </div>
//             <div>
//               <span className="text-gray-400">Duration:</span>
//               <p className="font-medium text-white">{plan.duration}</p>
//             </div>
//           </div>
//         </div>

//         <div>
//           <h3 className="mb-2 text-lg font-semibold text-white">Exercises</h3>
//           <div className="space-y-4">
//             {plan.exercises.map((exercise, index) => (
//               <div key={index} className="rounded-lg bg-gray-800 p-4">
//                 <h4 className="font-medium text-white">{exercise.name}</h4>
//                 <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-gray-300">
//                   <div>Sets: {exercise.sets}</div>
//                   <div>Reps: {exercise.reps}</div>
//                   <div>Rest: {exercise.rest}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {plan.notes && (
//           <div>
//             <h3 className="mb-2 text-lg font-semibold text-white">Additional Notes</h3>
//             <p className="text-gray-300">{plan.notes}</p>
//           </div>
//         )}

//         <button
//           onClick={onSave}
//           className="w-full rounded-lg bg-purple-500 p-3 text-white transition-colors hover:bg-purple-600">
//           Save Workout Plan
//         </button>
//       </div>
//     </div>
//   );
// }
