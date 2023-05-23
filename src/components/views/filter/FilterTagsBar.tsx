import {observer} from 'mobx-react';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useStores} from '../../../hooks/useStores';
import {FilterTag} from './FilterTag';

export const FilterTagsBar: React.FC = observer(() => {
  const {filterStore} = useStores();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={filterStyles.filterTagsContainer}>
        {filterStore.filterViewFilteredArtist?.numTitles ? (
          <FilterTag
            type="artist"
            title={filterStore.filterViewFilteredArtist.name}
          />
        ) : null}
        {filterStore.filterViewFilteredGenre?.numTitles ? (
          <FilterTag
            type="genre"
            title={filterStore.filterViewFilteredGenre.name}
          />
        ) : null}
        {filterStore.filterViewFilteredBook?.numTitles ? (
          <FilterTag
            type="book"
            title={`${filterStore.filterViewFilteredBook.name}${
              filterStore.filterViewFilteredChapter?.name
                ? ` ${filterStore.filterViewFilteredChapter.name}`
                : ''
            }`}
          />
        ) : null}
      </View>
    </ScrollView>
  );
});

const filterStyles = StyleSheet.create({
  filterTagsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
});
