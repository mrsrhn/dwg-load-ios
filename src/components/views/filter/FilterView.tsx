import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
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
import {strings} from '../../../strings';
import {useStores} from '../../../hooks/useStores';
import {createStackNavigator} from '@react-navigation/stack';
import {
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FilterTagsBar} from './FilterTagsBar';

const Stack = createStackNavigator();
interface FilterViewProps {}

export const FilterView: React.FC<FilterViewProps> = observer(() => {
  const {filterStore} = useStores();
  const {apiStore} = useStores();
  const navigation = useNavigation();

  const resetAndClose = () => {
    filterStore.filterViewUpdateFilteredArtist(undefined);
    filterStore.filterViewUpdateFilteredGenre(undefined);
    filterStore.filterViewUpdateFilteredBook(undefined);
    filterStore.filterViewUpdateFilteredChapter(undefined);

    apply();
    navigation.navigate('Alle');
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
    filterStore.filterViewFilteredChapter,
    apply,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalBackground}>
        <TouchableWithoutFeedback
          style={{height: '100%'}}
          onPress={() => navigation.navigate('Alle')}
        />
      </View>
      <View style={styles.modalContent}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {height: 80},
            headerTitleContainerStyle: {
              paddingTop: 13,
              justifyContent: 'flex-start',
            },
            headerLeftContainerStyle: {
              zIndex: 999,
              justifyContent: 'flex-start',
            },

            headerRight: () => (
              <View
                style={{
                  position: 'absolute',
                  paddingTop: 50,
                  minWidth: Dimensions.get('window').width,
                }}>
                <FilterTagsBar />
              </View>
            ),
            headerTintColor: Appearance.darkColor,
          }}>
          <Stack.Screen
            options={{
              headerBackTitle: strings.back,
              headerTitle: strings.availableFilter,
            }}
            name={strings.filter}
            component={FilterEntry}
          />
          <Stack.Screen
            options={{headerBackTitle: strings.filter}}
            name={strings.speaker}
            component={FilterArtist}
          />
          <Stack.Screen
            options={{headerBackTitle: strings.filter}}
            name={strings.category}
            component={FilterCategory}
          />
          <Stack.Screen
            options={{headerBackTitle: strings.filter}}
            name={strings.bible}
            component={FilterBook}
          />
          <Stack.Screen
            options={{headerBackTitle: strings.filter}}
            name={strings.chapter}
            component={FilterChapter}
          />
        </Stack.Navigator>
        <View style={{flexDirection: 'row'}}>
          <DWGButton
            style="secondary"
            title={strings.reset}
            onPress={() => resetAndClose()}
          />
          <DWGButton
            style="primary"
            title={strings.apply}
            onPress={() => navigation.navigate('Alle')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
});

const FilterBook = observer(() => {
  const {filterStore} = useStores();
  return (
    <Filter
      navigateTo={strings.chapter}
      selectCallback={filterStore.filterViewUpdateFilteredBook}
      items={filterStore.books}
    />
  );
});
const FilterChapter = observer(() => {
  const {filterStore} = useStores();
  return (
    <Filter
      pickerPrefix={strings.chapter}
      navigateTo={strings.filter}
      selectCallback={filterStore.filterViewUpdateFilteredChapter}
      items={filterStore.chapters}
    />
  );
});
const FilterArtist = observer(() => {
  const {filterStore} = useStores();
  return (
    <Filter
      navigateTo={strings.filter}
      selectCallback={filterStore.filterViewUpdateFilteredArtist}
      items={filterStore.artists}
    />
  );
});
const FilterCategory = observer(() => {
  const {filterStore} = useStores();
  return (
    <Filter
      navigateTo={strings.filter}
      selectCallback={filterStore.filterViewUpdateFilteredGenre}
      items={filterStore.genres}
    />
  );
});
interface FilterProps<Item> {
  navigateTo: string;
  items: Item[];
  disabled?: boolean;
  pickerPrefix?: string;
  selectCallback: (value: Item) => void;
}

const Filter: React.FC<
  FilterProps<Artist | Book | Genre | Chapter | NoFilter>
> = observer(props => {
  const navigation = useNavigation();

  const {apiStore} = useStores();

  const onPress = (item: Artist | Book | Genre | Chapter | NoFilter) => {
    props.selectCallback(item);
    navigation.navigate(props.navigateTo);
  };

  return apiStore.isLoadingFilterData ? (
    <ActivityIndicator size="small" style={{paddingTop: 20}} />
  ) : (
    <View>
      <FlatList
        data={props.items}
        renderItem={({item, index}) => (
          <TouchableHighlight onPress={() => onPress(item)}>
            <View style={filterStyles.button} key={`picker_${item.id}`}>
              <Text style={filterStyles.title}>{`${
                props.pickerPrefix && index !== 0 ? props.pickerPrefix : ''
              } ${item.name}`}</Text>
              <Text style={filterStyles.count}>
                {item.numTitles !== 0 ? item.numTitles : ''}
              </Text>
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
});

const FilterEntry = observer(() => {
  const navigation = useNavigation();

  const data = [strings.speaker, strings.category, strings.bible];
  const onPress = d => {
    navigation.navigate(d);
  };

  return (
    <>
      <View>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <TouchableHighlight
              key={`picker_${item}`}
              onPress={() => onPress(item)}>
              <View style={filterStyles.button}>
                <View />
                <View>
                  <Text style={filterStyles.title}>{item}</Text>
                </View>
                <View>
                  <Ionicons
                    size={15}
                    color={Appearance.baseColor}
                    name="chevron-forward-outline"
                  />
                </View>
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
    height: '60%',
    flex: 1,
    shadowOffset: {height: 100, width: 0},
    shadowColor: 'white',
    shadowOpacity: 1.0,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    backgroundColor: 'white',
    flex: 1,
    display: 'flex',
  },
  modalBackground: {
    height: '40%',
  },
});

const filterStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Appearance.greyColor,
    padding: 15,
    backgroundColor: 'white',
  },
  title: {color: Appearance.darkColor},
  count: {color: Appearance.greyColor, fontSize: 11},
});
