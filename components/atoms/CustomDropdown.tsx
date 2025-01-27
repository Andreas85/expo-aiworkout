import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';
import { tailwind } from '@/utils/tailwind';
import { Text, View } from '../Themed';
import { generateBigNumberId } from '@/utils/helper';
import { getWorkoutExercisesList } from '@/utils/workoutExercisesHelper';

interface CustomDropdownProps {
  open: boolean;
  selectedItem?: any;
  items: { label: string; value: string }[];
  placeholder?: string;
  showLabel?: boolean;
  setValue?: React.Dispatch<React.SetStateAction<any>>;
  onchange?: (event: any) => void;
  searchQuery?: any;
  search?: boolean;
}

const CustomDropdown = (props: CustomDropdownProps) => {
  const {
    open,
    selectedItem,
    showLabel = false,
    items,
    placeholder,
    search,
    searchQuery,
    onchange = () => {},
    ...restProps
  } = props;

  const [isFocus, setIsFocus] = React.useState(false);
  const [dropdownItems, setDropdownItems] = React.useState(items);

  const renderLabel = () => {
    if (selectedItem || isFocus) {
      return <Text style={[styles.label, isFocus && { color: 'blue' }]}>Dropdown label</Text>;
    }
    return null;
  };

  const handleSearchChange = (input: string) => {
    // setQuery(input);

    const foundItem = dropdownItems.some(item => item.label.toLowerCase() === input.toLowerCase());
    if (!foundItem && input.trim() !== '') {
      const clientSideExerciseId = generateBigNumberId();
      const newItem = {
        label: input,
        name: input,
        value: clientSideExerciseId,
        _id: clientSideExerciseId,
      };
      setDropdownItems([...items, newItem]);
    }
  };

  const updateDropdownItems = async (items: any) => {
    const localExercises = await getWorkoutExercisesList();
    // console.log('localExercises', localExercises);
    setDropdownItems([...items, ...localExercises]);
    // setDropdownItems(items);
  };

  useEffect(() => {
    if (items?.length) {
      updateDropdownItems(items);
    }
  }, [items]);

  return (
    <View style={{}}>
      {showLabel && renderLabel()}
      <Dropdown
        containerStyle={tailwind('')}
        itemContainerStyle={tailwind('')}
        itemTextStyle={tailwind('')}
        style={[styles.dropdown, tailwind(''), isFocus && { borderColor: 'blue' }]}
        placeholderStyle={[styles.placeholderStyle, tailwind('')]}
        selectedTextStyle={[styles.selectedTextStyle, tailwind('')]}
        selectedTextProps={{ numberOfLines: 1 }}
        inputSearchStyle={[styles.inputSearchStyle, tailwind(''), { outlineStyle: 'none' }]}
        iconStyle={styles.iconStyle}
        data={dropdownItems}
        search={search}
        // searchQuery={query}
        searchQuery={(keyword, labelValue) =>
          labelValue.toLowerCase().includes(keyword.toLowerCase())
        }
        value={selectedItem}
        onChangeText={handleSearchChange}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        // onChangeText={onchange}
        onChange={onchange}
        renderRightIcon={() => {
          return <AntDesign name="caretdown" size={10} />;
        }}
        placeholder={placeholder ?? 'Select'}
        labelField={'label'}
        valueField={'value'}
        {...restProps}
      />
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F3F8',
    padding: 16,
  },
  dropdown: {
    borderRadius: 6,
    shadowColor: '#F0F3F8',
    paddingHorizontal: 14,
    minWidth: 120,
    height: 45,
    backgroundColor: '#F0F3F8',
  },
  label: {
    position: 'absolute',
    backgroundColor: '#F0F3F8',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
