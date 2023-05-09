import * as React from 'react';
import {StyleSheet, View, Text, FlatList, SafeAreaView} from 'react-native';
import {observer} from 'mobx-react-lite';
import {Appearance} from '../../../appearance';
import {
  Artist,
  Book,
  Genre,
  Chapter,
  NoFilter,
} from '../../../types/userSessionStoreTypes';
import {DWGButton} from '../../DWGButton';
import {ModalHeader} from '../../ModalHeader';
import {strings} from '../../../strings';
import {useStores} from '../../../hooks/useStores';
import {createStackNavigator} from '@react-navigation/stack';

import {
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const Stack = createStackNavigator();
interface FilterViewProps {}
export const FilterView: React.FC<FilterViewProps> = observer(() => {
  const {filterStore} = useStores();
  const {apiStore} = useStores();

  const close = () => {
    filterStore.filterViewUpdateFilteredArtist(undefined);
    filterStore.filterViewUpdateFilteredGenre(undefined);
    filterStore.filterViewUpdateFilteredBook(undefined);
    filterStore.filterViewUpdateFilteredChapter(undefined);

    filterStore.setFilterViewVisible(false);
    apply();
  };

  const apply = React.useCallback(async () => {
    filterStore.updateFilteredArtist();
    filterStore.updateFilteredGenre();
    filterStore.updateFilteredBook();
    filterStore.updateFilteredChapter();
    await apiStore.resetAllSermons();
    apiStore.updateAllSermons();
  }, [apiStore, filterStore]);

  React.useEffect(() => {
    apiStore.updateFilterData(
      filterStore.filterViewFilteredArtist,
      filterStore.filterViewFilteredGenre,
      filterStore.filterViewFilteredBook,
    );
  }, []);

  React.useEffect(() => {
    apply();
  }, [
    filterStore.filterViewFilteredArtist,
    filterStore.filterViewFilteredBook,
    filterStore.filterViewFilteredGenre,
    apply,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalBackground}>
        <TouchableWithoutFeedback
          activeOpacity={0}
          style={{height: '100%'}}
          onPress={() => filterStore.setFilterViewVisible(false)}
        />
      </View>
      <View style={styles.modalHeader}>
        <ModalHeader onClose={() => filterStore.setFilterViewVisible(false)} />
      </View>
      <View style={styles.modalContent}>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerTintColor: Appearance.darkColor,
          }}>
          <Stack.Screen name="Filter" component={FilterEntry} />
          <Stack.Screen name="Redner" component={FilterArtist} />
          <Stack.Screen name="Kategorie" component={FilterCategory} />
          <Stack.Screen name="Buch" component={FilterBook} />
        </Stack.Navigator>
        <DWGButton
          style="primary"
          title={strings.reset}
          onPress={() => close()}
          isLoading={apiStore.isLoadingFilterData}
        />
      </View>
    </SafeAreaView>
  );
});

const FilterBook = () => {
  const {filterStore} = useStores();
  return (
    <Filter
      selectCallback={filterStore.filterViewUpdateFilteredBook}
      title={strings.bible}
      items={filterStore.books}
    />
  );
};
const FilterArtist = () => {
  const {filterStore} = useStores();
  return (
    <Filter
      selectCallback={filterStore.filterViewUpdateFilteredArtist}
      title={strings.speaker}
      items={filterStore.artists}
    />
  );
};
const FilterCategory = () => {
  const {filterStore} = useStores();
  return (
    <Filter
      selectCallback={filterStore.filterViewUpdateFilteredGenre}
      title={strings.category}
      items={filterStore.genres}
    />
  );
};
interface FilterProps<Item> {
  items: Item[];
  title: string;
  disabled?: boolean;
  pickerPrefix?: string;
  selectCallback: (value: Item) => void;
}

const Filter: React.FC<
  FilterProps<Artist | Book | Genre | Chapter | NoFilter>
> = observer(props => {
  const navigation = useNavigation();

  const [itemsList, setItemsList] = React.useState(props.items);
  const {apiStore} = useStores();
  React.useEffect(() => {
    console.log(props.items.map(i => i.id));
    setItemsList(props.items);
  }, [props.items, setItemsList]);
  const onPress = (item: Artist | Book | Genre | Chapter | NoFilter) => {
    props.selectCallback(item);
    navigation.navigate('Filter');
  };
  return apiStore.isLoadingFilterData ? null : (
    <View style={filterStyles.flatList}>
      <FlatList
        data={itemsList}
        renderItem={({item, index}) => (
          <TouchableHighlight onPress={() => onPress(item)}>
            <View style={filterStyles.button} key={`picker_${item.id}`}>
              <Text style={filterStyles.title}>{`${
                props.pickerPrefix && index !== 0 ? props.pickerPrefix : ''
              } ${item.name} ${
                item.numTitles !== 0 ? `(${item.numTitles})` : ''
              }`}</Text>
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
});

const FilterEntry = observer(props => {
  const navigation = useNavigation();

  const data = ['Redner', 'Kategorie', 'Buch'];
  const onPress = d => {
    if (d === 'Redner') {
      navigation.navigate('Redner');
    }
    if (d === 'Kategorie') {
      navigation.navigate('Kategorie');
    }
    if (d === 'Buch') {
      navigation.navigate('Buch');
    }
  };

  return (
    <>
      <View style={filterStyles.flatList}>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <TouchableHighlight onPress={() => onPress(item)}>
              <View style={filterStyles.button} key={`picker_${item}`}>
                <Text style={filterStyles.title}>{item}</Text>
              </View>
            </TouchableHighlight>
          )}
        />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    shadowOffset: {height: 10, width: 0},
    shadowColor: 'white',
    shadowOpacity: 1.0,
  },
  title: {
    textAlign: 'center',
    color: Appearance.baseColor,
    flex: 1,
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContent: {
    backgroundColor: 'white',
    height: '50%',
  },
  modalBackground: {
    height: '40%',
  },
  modalHeader: {
    height: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: Appearance.greyColor,
    paddingLeft: 10,
    paddingTop: 10,
  },
});

const filterStyles = StyleSheet.create({
  button: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Appearance.greyColor,
    padding: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  flatList: {height: '100%'},
  title: {color: Appearance.darkColor},
});
