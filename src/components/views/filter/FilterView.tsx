import * as React from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {observer} from 'mobx-react-lite';
import {Appearance} from '../../../appearance';
import {DWGFilterButton} from '../../DWGFilterButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Artist,
  Book,
  Genre,
  Chapter,
  NoFilter,
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
  const {userSessionStore, filterStore} = useStores();
  const {apiStore} = useStores();

  // Lokal filterstates
  const [selectedArtist, setSelectedArtist] = React.useState<
    Artist | undefined
  >(filterStore.filteredArtist);
  const [selectedGenre, setSelectedGenre] = React.useState<Genre | undefined>(
    filterStore.filteredGenre,
  );
  const [selectedBook, setSelectedBook] = React.useState<Book | undefined>(
    filterStore.filteredBook,
  );
  const [selectedChapter, setSelectedChapter] = React.useState<
    Chapter | undefined
  >(filterStore.filteredChapter);

  const close = () => filterStore.setFilterViewVisible(false);

  React.useEffect(() => {
    apiStore.updateFilterData(selectedArtist, selectedGenre, selectedBook);
  }, [selectedArtist, selectedGenre, selectedBook, apiStore]);

  const reset = async () => {
    filterStore.updateFilteredArtist(undefined);
    filterStore.updateFilteredGenre(undefined);
    filterStore.updateFilteredBook(undefined);
    filterStore.updateFilteredChapter(undefined);
    await apiStore.resetAllSermons();
    apiStore.updateAllSermons();
    close();
  };

  const apply = async () => {
    filterStore.updateFilteredArtist(selectedArtist);
    filterStore.updateFilteredGenre(selectedGenre);
    filterStore.updateFilteredBook(selectedBook);
    filterStore.updateFilteredChapter(selectedChapter);
    await apiStore.resetAllSermons();
    apiStore.updateAllSermons();
    close();
  };

  return (
    <View style={styles.container}>
      <ModalHeader onClose={() => filterStore.setFilterViewVisible(false)} />
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.title}>{strings.filter}</Text>
        {apiStore.isLoadingFilterData && <ActivityIndicator />}
      </View>
      <View>
        <Filter
          title={strings.speaker}
          items={userSessionStore.artists}
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
          items={userSessionStore.genres}
          selectedItem={selectedGenre?.id ?? 'none'}
          onChange={value =>
            setSelectedGenre(value.id === 'none' ? undefined : (value as Genre))
          }
          setGestureRecognizerActive={props.setGestureRecognizerActive}
        />
        <Filter
          title={strings.bible}
          items={userSessionStore.books}
          selectedItem={selectedBook?.id ?? 'none'}
          onChange={value => {
            setSelectedBook(value.id === 'none' ? undefined : (value as Book));
          }}
          setGestureRecognizerActive={props.setGestureRecognizerActive}
        />
        <Filter
          title={strings.chapter}
          items={userSessionStore.chapters}
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
    </View>
  );
});

interface FilterProps<Items> {
  items: Items;
  title: string;
  selectedItem: string;
  disabled?: boolean;
  pickerPrefix?: string;
  onChange: (item: Items) => void;
  setGestureRecognizerActive: (active: boolean) => void;
}

const Filter: React.FC<
  FilterProps<(Artist | Book | Genre | Chapter | NoFilter)[]>
> = observer(props => {
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
    height: '50%',
    marginTop: 'auto',
    backgroundColor: 'white',
    borderTopColor: Appearance.baseColor,
    borderTopWidth: 1,
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
