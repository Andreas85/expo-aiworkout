import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { Text, View } from '../Themed';
import { tailwind } from '@/utils/tailwind';
import { exerciseAutoSuggest, fetchExerciseService } from '@/services/workouts';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { useFetchData } from '@/hooks/useFetchData';
import { useFocusEffect } from 'expo-router';
import { ExerciseElement } from '@/services/interfaces';

interface ICustomAutoComplete {
  isNewExercise?: boolean;
  setIsNewExercise: (value: boolean) => void;
  onchange: (value: any) => void;
  placeholder: string;
}

const CustomAutoComplete = (props: ICustomAutoComplete) => {
  const { onchange, placeholder, setIsNewExercise } = props;
  const [query, setQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<any>([]);
  const [hideResults, setHideResults] = useState(true);

  const { data, refetch, isSuccess } = useFetchData({
    queryFn: fetchExerciseService,
    queryKey: [REACT_QUERY_API_KEYS.MY_EXERCISES],
    enabled: false,
  });

  // Fetch exercises based on the query input
  const handleExercisesOptionsFetch = async (input: string) => {
    if (!input) return [];
    try {
      const response = await exerciseAutoSuggest(input);
      return response || [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  const findExercise = async (input: string) => {
    setQuery(input);
    onchange?.(input);

    // If input is empty, display cached `data`
    if (!input && isSuccess) {
      setFilteredExercises(data || []);
      setHideResults(false);
      return;
    }

    // Otherwise, fetch matching exercises from API
    const result = (await handleExercisesOptionsFetch(input)) ?? [];
    result > 0 ? setIsNewExercise(false) : setIsNewExercise(true);
    setFilteredExercises(result);
    setHideResults(false);
  };

  useEffect(() => {
    if (isSuccess && Array.isArray(data)) {
      setFilteredExercises(data);
    }
  }, [data, isSuccess]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleSelect = (item: any) => {
    onchange?.(item);
    setQuery(item?.name || item); // Set query to the selected item name or item itself
    setHideResults(true); // Hide suggestions when an item is selected
  };

  return (
    <View
      style={[
        Platform.select({
          web: tailwind('relative inset-x-0 top-0 z-20 max-h-10 flex-1'),
          native: styles.autocompleteContainer,
        }),
      ]}>
      <Autocomplete
        data={filteredExercises || []} // Ensure it’s an array
        value={query}
        placeholder={placeholder}
        onChangeText={findExercise}
        hideResults={hideResults}
        onFocus={() => setHideResults(false)}
        listContainerStyle={{
          padding: 0,
          // backgroundColor: '#ff00ff',
        }}
        containerStyle={{
          // backgroundColor: '#ff000f',
          padding: 0,
        }}
        flatListProps={{
          style: styles.flatList,
          contentContainerStyle: {
            padding: 0,
            // backgroundColor: '#ff0f',
          },
          nestedScrollEnabled: false,
          keyExtractor: (item: ExerciseElement, idx: number) => item?._id + idx.toString(),
          renderItem: ({ item, index }: any) => (
            <TouchableOpacity
              style={styles.item}
              key={index?.toString()}
              onPress={() => handleSelect(item)}>
              <Text style={styles.itemText}>{item?.name ?? item ?? 'Unknown'}</Text>
            </TouchableOpacity>
          ),
        }}
        inputContainerStyle={styles.input}
        // style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    padding: 0,
  },
  input: {
    // paddingHorizontal: 10,
    borderWidth: 0,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  itemText: {
    color: '#000',
    fontSize: 16,
  },
  flatList: {
    flex: 1,
    maxHeight: 200,
    padding: 0,
  },
});

export default CustomAutoComplete;
