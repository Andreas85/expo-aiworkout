import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { tailwind } from '@/utils/tailwind';
import Container from '@/components/atoms/Container';
import GradientBackground from '@/components/atoms/GradientBackground';

const LandingPage = () => {
  const handleGetStarted = () => {
    router.push('/(tabs)/(auth)/signup');
  };

  const handleSignIn = () => {
    router.push('/(tabs)/(auth)/signin');
  };

  const handleExploreWorkouts = () => {
    router.push('/(tabs)/(workout)/workouts/public');
  };

  return (
    <GradientBackground>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tailwind('pb-8')}
      >
        {/* Hero Section */}
        <View style={tailwind('relative min-h-screen justify-center items-center px-6 py-16')}>
          {/* Main Content */}
          <View style={tailwind('items-center z-10 max-w-4xl')}>
            {/* Main Title */}
            <Text style={tailwind('text-white text-5xl font-bold text-center mb-4')}>
              AI Fitness Journey
            </Text>
            
            {/* Subtitle */}
            <Text style={tailwind('text-white/90 text-xl text-center mb-6 leading-7')}>
              Smarter workouts. Simpler progress.
            </Text>

            {/* Availability */}
            <Text style={tailwind('text-white/80 text-lg text-center mb-12')}>
              Available on web and mobile – and completely free.
            </Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={tailwind('px-6 py-8')}>
          <View style={tailwind('max-w-4xl mx-auto')}>
            {/* Build Your Workouts */}
            <View style={tailwind('mb-16')}>
              <View style={tailwind('flex-row items-start space-x-4 mb-6')}>
                <Text style={tailwind('text-4xl')}>🏋️</Text>
                <View style={tailwind('flex-1')}>
                  <Text style={tailwind('text-white text-2xl font-bold mb-2')}>
                    Build Your Workouts
                  </Text>
                  <Text style={tailwind('text-gray-300 text-lg leading-7')}>
                    Create custom workouts with clear instructions for sets, reps, and rest – stay focused without second-guessing.
                  </Text>
                </View>
              </View>
            </View>

            {/* Powered by AI */}
            <View style={tailwind('mb-16')}>
              <View style={tailwind('flex-row items-start space-x-4 mb-6')}>
                <Text style={tailwind('text-4xl')}>🤖</Text>
                <View style={tailwind('flex-1')}>
                  <Text style={tailwind('text-white text-2xl font-bold mb-2')}>
                    Powered by AI
                  </Text>
                  <View style={tailwind('space-y-2')}>
                    <Text style={tailwind('text-gray-300 text-lg leading-7')}>
                      • Generate new workouts tailored to you
                    </Text>
                    <Text style={tailwind('text-gray-300 text-lg leading-7')}>
                      • AI-edit existing workouts
                    </Text>
                    <Text style={tailwind('text-gray-300 text-lg leading-7')}>
                      • Get real-time exercise explanations
                    </Text>
                    <Text style={tailwind('text-gray-300 text-lg leading-7')}>
                      • Visualize your workouts with personalized images
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Try Without Account */}
            <View style={tailwind('mb-16')}>
              <View style={tailwind('flex-row items-start space-x-4 mb-6')}>
                <Text style={tailwind('text-4xl')}>🌐</Text>
                <View style={tailwind('flex-1')}>
                  <Text style={tailwind('text-white text-2xl font-bold mb-2')}>
                    Try Without an Account
                  </Text>
                  <Text style={tailwind('text-gray-300 text-lg leading-7 mb-4')}>
                    Explore public workouts here – no registration needed.
                  </Text>
                  <TouchableOpacity
                    onPress={handleExploreWorkouts}
                    style={tailwind('bg-purple-600 rounded-full py-3 px-6 self-start')}
                  >
                    <Text style={tailwind('text-white font-semibold text-lg')}>
                      Explore Workouts
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Ready to Level Up */}
            <View style={tailwind('mb-16')}>
              <View style={tailwind('flex-row items-start space-x-4 mb-6')}>
                <Text style={tailwind('text-4xl')}>🚀</Text>
                <View style={tailwind('flex-1')}>
                  <Text style={tailwind('text-white text-2xl font-bold mb-2')}>
                    Ready to Level Up?
                  </Text>
                  <Text style={tailwind('text-gray-300 text-lg leading-7 mb-4')}>
                    Create your free account and start training smarter today.
                  </Text>
                  <TouchableOpacity
                    onPress={handleGetStarted}
                    style={tailwind('bg-purple-600 rounded-full py-3 px-6 self-start')}
                  >
                    <Text style={tailwind('text-white font-semibold text-lg')}>
                      Start Training Smarter
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

export default LandingPage; 