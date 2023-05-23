import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Appearance} from '../../../appearance';
import {useStores} from '../../../hooks/useStores';
import {NOFILTERVALUE} from '../../../stores/filterStore';

type FilterType = 'artist' | 'genre' | 'book';

interface FilterTagProps {
  title: string;
  type: FilterType;
}

export const FilterTag: React.FC<FilterTagProps> = observer(({title, type}) => {
  const {filterStore} = useStores();
  const onPress = () => {
    switch (type) {
      case 'artist':
        filterStore.filterViewUpdateFilteredArtist(NOFILTERVALUE);
        break;
      case 'genre':
        filterStore.filterViewUpdateFilteredGenre(NOFILTERVALUE);
        break;
      case 'book':
        filterStore.filterViewUpdateFilteredBook(NOFILTERVALUE);
        filterStore.filterViewUpdateFilteredChapter(NOFILTERVALUE);
        break;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <>
        <Ionicons name="close-circle-outline" size={18} color="white" />
        <Text style={styles.title}>{title}</Text>
      </>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Appearance.darkColor,
    paddingVertical: 3,
    paddingRight: 15,
    paddingLeft: 5,
    borderRadius: 20,
    marginLeft: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    paddingLeft: 3,
    color: 'white',
    fontWeight: 'bold',
  },
});
