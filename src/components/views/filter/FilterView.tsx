import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {Appearance} from '../../../appearance';
import {DWGFilterButton} from '../../DWGFilterButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Artist,
  Book,
  Genre,
  Chapter,
} from '../../../types/userSessionStoreTypes';
import {Picker} from '@react-native-picker/picker';
import {DWGButton} from '../../DWGButton';
import {ModalHeader} from '../../ModalHeader';
import {DWGModal} from '../../DWGModal';
import {strings} from '../../../strings';
import {useStores} from '../../../hooks/useStores';

interface FilterViewProps {
  setGestureRecognizerActive: (active: boolean) => void;
}
export const FilterView: React.FC<FilterViewProps> = observer(props => {
  const {userSessionStore} = useStores();
  const {apiStore} = useStores();

  // Lokal filterstates
  const [selectedArtist, setSelectedArtist] = React.useState<
    Artist | undefined
  >(userSessionStore.filteredArtist);
  const [selectedGenre, setSelectedGenre] = React.useState<Genre | undefined>(
    userSessionStore.filteredGenre,
  );
  const [selectedBook, setSelectedBook] = React.useState<Book | undefined>(
    userSessionStore.filteredBook,
  );
  const [selectedChapter, setSelectedChapter] = React.useState<
    Chapter | undefined
  >(userSessionStore.filteredChapter);

  const close = () => userSessionStore.setFilterViewVisible(false);

  React.useEffect(() => {
    apiStore.updateFilterData(selectedArtist, selectedGenre, selectedBook);
  }, [selectedArtist, selectedGenre, selectedBook, apiStore]);

  const reset = async () => {
    userSessionStore.updateFilteredArtist(undefined);
    userSessionStore.updateFilteredGenre(undefined);
    userSessionStore.updateFilteredBook(undefined);
    userSessionStore.updateFilteredChapter(undefined);
    await apiStore.resetAllSermons();
    apiStore.updateAllSermons();
    close();
  };

  const apply = async () => {
    userSessionStore.updateFilteredArtist(selectedArtist);
    userSessionStore.updateFilteredGenre(selectedGenre);
    userSessionStore.updateFilteredBook(selectedBook);
    userSessionStore.updateFilteredChapter(selectedChapter);
    await apiStore.resetAllSermons();
    apiStore.updateAllSermons();
    close();
  };

  const artistList = [
    {id: 'none', name: strings.notFiltered, numTitles: 0},
    ...userSessionStore.artists,
  ];
  const genreList = [
    {id: 'none', name: strings.notFiltered, numTitles: 0},
    ...userSessionStore.genres,
  ];
  const booksList = [
    {id: 'none', name: strings.notFiltered, numTitles: 0},
    ...userSessionStore.books,
  ];
  const chapterList = [
    {id: 'none', name: strings.notFiltered, numTitles: 0},
    ...userSessionStore.chapters,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ModalHeader
        onClose={() => userSessionStore.setFilterViewVisible(false)}
      />
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.title}>{strings.filter}</Text>
        {apiStore.isLoadingFilterData && <ActivityIndicator />}
      </View>

      <View>
        <Filter
          title={strings.speaker}
          items={artistList}
          selectedItem={selectedArtist?.id ?? 'none'}
          onChange={value => {
            setSelectedArtist(
              value.id === 'none' ? undefined : (value as Artist),
            );
          }}
          setGestureRecognizerActive={props.setGestureRecognizerActive}
        />
        <Filter
          title={strings.category}
          items={genreList}
          selectedItem={selectedGenre?.id ?? 'none'}
          onChange={value =>
            setSelectedGenre(value.id === 'none' ? undefined : (value as Genre))
          }
          setGestureRecognizerActive={props.setGestureRecognizerActive}
        />
        <Filter
          title={strings.bible}
          items={booksList}
          selectedItem={selectedBook?.id ?? 'none'}
          onChange={value => {
            setSelectedBook(value.id === 'none' ? undefined : (value as Book));
          }}
          setGestureRecognizerActive={props.setGestureRecognizerActive}
        />
        <Filter
          title={strings.chapter}
          items={chapterList}
          selectedItem={selectedChapter?.id ?? 'none'}
          onChange={value =>
            setSelectedChapter(
              value.id === 'none' ? undefined : (value as Chapter),
            )
          }
          pickerPrefix={strings.chapter}
          disabled={selectedBook === undefined}
          setGestureRecognizerActive={props.setGestureRecognizerActive}
        />
      </View>
      <View style={styles.actionButtons}>
        <DWGButton
          disabled={apiStore.isLoadingFilterData}
          style="secondary"
          title={strings.reset}
          onPress={reset}
        />
        <DWGButton
          disabled={apiStore.isLoadingFilterData}
          style="primary"
          title={strings.apply}
          onPress={apply}
        />
      </View>
    </SafeAreaView>
  );
});

type Item =
  | Artist
  | Book
  | Genre
  | Chapter
  | {
      id: string;
      name: string;
      numTitles: number;
    };

interface FilterProps {
  items: Item[];
  title: string;
  selectedItem: string;
  disabled?: boolean;
  pickerPrefix?: string;
  onChange: (item: Item) => void;
  setGestureRecognizerActive: (active: boolean) => void;
}

const Filter: React.FC<FilterProps> = observer(props => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedPickerValue, setSelectedPickerValue] = React.useState(
    props.selectedItem,
  );
  const [itemsList, setItemsList] = React.useState(props.items);

  const {apiStore} = useStores();
  React.useEffect(() => setItemsList(props.items), [props.items]);
  React.useEffect(() => {
    if (modalVisible) {
      props.setGestureRecognizerActive(false);
    } else {
      props.setGestureRecognizerActive(true);
    }
  }, [modalVisible]);

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      apply();
    }
  }, [selectedPickerValue]);

  React.useEffect(() => {
    // Reset selected value if filter gets disabled
    if (props.disabled) {
      props.onChange(props.items[0]);
    }
  }, [props.disabled]);

  const apply = () => {
    props.onChange(
      props.items.find(i => i.id === selectedPickerValue) ?? props.items[0],
    );
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.buttonsContainer}>
        <DWGFilterButton
          title={props.title}
          onPress={() => setModalVisible(true)}
          value={
            props.selectedItem === 'none'
              ? ''
              : props.items.find(item => item.id === props.selectedItem)
                  ?.name ?? ''
          }
          disabled={
            apiStore.isLoadingFilterData ||
            props.disabled ||
            props.items.length === 1
          }
        />
        <DWGModal
          title={props.title}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}>
          <Picker
            selectedValue={selectedPickerValue}
            onValueChange={itemValue => setSelectedPickerValue(itemValue)}>
            {itemsList.map((item, index) => (
              <Picker.Item
                key={`picker_${item.id}`}
                label={`${
                  props.pickerPrefix && index !== 0 ? props.pickerPrefix : ''
                } ${item.name} ${
                  item.numTitles !== 0 ? `(${item.numTitles})` : ''
                }`}
                value={item.id}
              />
            ))}
          </Picker>
          <View style={styles.buttonsContainer}>
            <DWGButton
              title={strings.select}
              style="secondary"
              onPress={apply}
            />
          </View>
        </DWGModal>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    textAlign: 'center',
    color: Appearance.baseColor,
    flex: 1,
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  listEntry: {
    height: 40,
    width: '100%',
    backgroundColor: 'white',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  listEntryText: {
    fontSize: 16,
  },
  iconContainer: {
    width: 40,
  },
  actionButtons: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
