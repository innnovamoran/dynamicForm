import React, {FC, useRef} from 'react';
import {
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
  View,
  useColorScheme,
  Text,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';

export type optionsFeatures = {
  id: number;
  value: string;
}; // modularizar
type props = {
  options: optionsFeatures[];
  label: string;
  value: number | string | undefined;
  id_structure_step_1: number;
  onChange: (itemValue: optionsFeatures, id_pather: number) => void;
  onPress: (id_structure_step_1: number | null) => void;
  isLoading: boolean;
  id_structure_selected: number | null;
  textSelected: string | undefined;
};
const CustomSelect: FC<props> = ({
  label,
  options,
  value,
  id_structure_step_1,
  onPress,
  id_structure_selected,
  textSelected,
  onChange,
}) => {
  const {width, height} = useWindowDimensions();

  const SelecteIOS = () => (
    <Picker
      selectedValue={!value ? 0 : value}
      onValueChange={(itemValue, itemIndex) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onChange(options[itemIndex], id_structure_step_1);
        onPress(null);
      }}>
      {options
        .filter((item: any) => typeof item.id_pather === 'undefined')
        .map(item => (
          <Picker.Item key={item.id} label={item.value} value={item.id} />
        ))}
    </Picker>
  );

  const _renderIOSSelect = () => (
    <>
      {id_structure_selected !== id_structure_step_1 ? (
        <>
          <TouchableOpacity
            onPress={() => {
              onPress(id_structure_step_1);
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
            }}
            style={{
              marginVertical: 10,
              borderRadius: 5,
              paddingVertical: 15,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text>{`${textSelected ? textSelected : options[0].value}`}</Text>
          </TouchableOpacity>
        </>
      ) : null}

      {typeof id_structure_selected === 'number' &&
      id_structure_selected === id_structure_step_1 ? (
        <View
          style={{
            marginVertical: 10,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}>
          <SelecteIOS />
        </View>
      ) : null}
    </>
  );

  return (
    <View
      style={{
        flexGrow: 1,
        width: width * 0.85,
        marginVertical: '2%',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 5,
      }}>
      <Text>{label}</Text>

      {Platform.OS === 'ios' ? _renderIOSSelect() : null}
    </View>
  );
};

export default CustomSelect;
