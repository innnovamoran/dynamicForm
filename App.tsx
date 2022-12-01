import React, {useCallback, useEffect, useState} from 'react';

import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import uuid from 'react-native-uuid';
import useFetch, {MethodRequest} from './hooks/useFetch';

import RadioGroup from 'react-native-radio-buttons-group';
import CustomSelect, {optionsFeatures} from './components/customSelect';

interface structureForm {
  id: number;
  label: string;
  type: 'select' | 'radiobuttons' | 'input';
  options: optionsFeatures[];
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {CallServer} = useFetch();

  const [id_structure_selected, setIdStructureSelected] = useState<
    number | null
  >(null);

  const [screenBFF, setScreenBff] = useState<Array<structureForm>>([]);

  const [loadRender, setLoadRender] = useState(false);

  const [store, setStore] = useState<any>({});
  console.log(store);

  const [radioButtons, setRadioButtons] = useState([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Option 1',
      value: 'option1',
    },
    {
      id: '2',
      label: 'Option 2',
      value: 'option2',
    },
  ]);

  const _handleSetStore = (item: any, id_father: any) => {
    setLoadRender(true);
    CallServer(
      'feature-sub-structure',
      MethodRequest.GET,
      (error, response) => {
        if (error) {
          console.log('error de network', error);
        }
        const rr = response as any; // es un objeto dinamico con valores de array [key:string] : Array<OptionsForm>
        const found = rr[`${item.value}`];
        let s = store;
        if (typeof found === 'undefined') {
          s[id_father] = {...item, subForm: null};
        } else {
          s[id_father] = {...item, subForm: found};
        }
        setStore(s);
        setLoadRender(false);
      },
    );
  };

  useEffect(() => {
    CallServer('feature-structure', MethodRequest.GET, (error, response) => {
      if (error) {
        console.log('error de network', error);
      }
      setScreenBff(response as structureForm[]);
    });
  }, []);

  const select = (item: structureForm) => (
    <View key={uuid.v4().toString()}>
      <CustomSelect
        id_structure_selected={id_structure_selected}
        id_structure_step_1={item.id}
        isLoading={false}
        label={item.label}
        onPress={id => setIdStructureSelected(id)}
        options={item.options}
        onChange={state => {
          _handleSetStore(state, item.id);
        }}
        textSelected={store[`${item.id}`] ? store[`${item.id}`].value : null}
        value={store[`${item.id}`] ? store[`${item.id}`].id : null}
      />
      <View style={{paddingLeft: 20, borderLeftWidth: 1, borderColor: 'gray'}}>
        {_deckStructureBase(
          store[`${item.id}`] ? store[`${item.id}`].subForm : null,
        )}
      </View>
    </View>
  );

  const radiobuttons = (item: structureForm) => (
    <View key={uuid.v4().toString()}>
      <RadioGroup
        layout="row"
        radioButtons={item.options as any}
        onPress={state => {
          const found = state.find(f => f.selected);
          _handleSetStore({id: found?.id, value: found?.value}, item.id);
        }}
      />
      <View style={{paddingLeft: 20, borderLeftWidth: 1, borderColor: 'gray'}}>
        {_deckStructureBase(
          store[`${item.id}`] ? store[`${item.id}`].subForm : null,
        )}
      </View>
    </View>
  );
  const input = (item: structureForm) => (
    <TextInput
      key={uuid.v4().toString()}
      value=""
      placeholder={item.label}
      placeholderTextColor={'black'}
      onChangeText={text => {}}
      style={{
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 10,
        marginVertical: 5,
      }}
    />
  );

  const factoryInputs: any = () => ({select, radiobuttons, input});

  const _deckStructureBase = (bff: any) =>
    bff?.map((d: any) => factoryInputs()[d.type](d));

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {loadRender ? (
        <ActivityIndicator animating={loadRender} size={'large'} />
      ) : (
        <ScrollView
          style={{padding: 20}}
          contentInsetAdjustmentBehavior="automatic">
          {_deckStructureBase(screenBFF)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

/**
 * 
 * 
    const Akeys = Object.keys(store);
    Akeys.map((key, index) => {
      console.log(key, index);

      if (index === Akeys.length - 1) {
        // obtener el ultimo por clave - valor

        // a modo de prueba la logica se construye en el front pero esto lo debe procesar el backend
       
      }
    });
 */
