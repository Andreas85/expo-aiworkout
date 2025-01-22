import Container from '@/components/atoms/Container';
import GradientBackground from '@/components/atoms/GradientBackground';
import WorkoutSessions from '@/components/screens/WorkoutSessions';
import NoDataSvg from '@/components/svgs/NoDataSvg';
import { useFetchData } from '@/hooks/useFetchData';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { getUserWorkoutSessionsService } from '@/services/workouts';
import { useAuthStore } from '@/store/authStore';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { tailwind } from '@/utils/tailwind';
import { getWorkoutSessions } from '@/utils/workoutSessionHelper';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutSessionScreen() {
  const { isLargeScreen } = useWebBreakPoints();
  const { setWorkoutDetail } = useWorkoutDetailStore();
  const [productData, setProductData] = useState<any[]>([]);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const { data: dataWorkoutSession, refetch } = useFetchData({
    queryFn: async () => {
      const response = await getUserWorkoutSessionsService();
      console.log({ response });
      setWorkoutDetail(response);
      return response;
    },
    enabled: false,
    queryKey: [REACT_QUERY_API_KEYS.WORKOUT_SESSION_USER],
  });

  const fetchInitials = async () => {
    if (isAuthenticated) {
      refetch();
    } else {
      const result: any = await getWorkoutSessions();
      setProductData(result);
      setWorkoutDetail(result);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log('data', dataWorkoutSession);
      const results = dataWorkoutSession?.data;
      setProductData(results);
    }
  }, [isAuthenticated, dataWorkoutSession]);

  useFocusEffect(
    useCallback(() => {
      fetchInitials();
      // Cleanup function or additional logic when screen is unfocused
      return async () => {
        // console.log("Preference Screen is unfocused");
      };
    }, []),
  );

  const renderWorkingListing = () => {
    if (productData?.length === 0) {
      return (
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Container>
            <NoDataSvg label="No workout session " />
          </Container>
        </ScrollView>
      );
    }
    return <WorkoutSessions workoutSessionData={productData} />;
  };

  return (
    <SafeAreaView style={[tailwind('flex-1')]}>
      <GradientBackground
        styleNative={Platform.select({
          web: tailwind(isLargeScreen ? 'mt-0' : 'mt-24'),
        })}>
        {renderWorkingListing()}
      </GradientBackground>
    </SafeAreaView>
  );
}
