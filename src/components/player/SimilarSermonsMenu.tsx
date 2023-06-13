import React from 'react';
import {MenuView} from '@react-native-menu/menu';
import {Appearance} from '../../appearance';
import {Artist, Book, Genre} from '../../types/userSessionStoreTypes';
import {useStores} from '../../hooks/useStores';
import * as RootNavigation from '../../RootNavigation';
import {strings} from '../../strings';
import {Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const SimilarSermonsMenu = () => {
  const {userSessionStore, filterStore, apiStore} = useStores();

  const showArtistTitles = async (artist: Artist) => {
    filterStore.resetFilter();
    filterStore.filterViewUpdateFilteredArtist(artist);
    filterStore.updateFilteredArtist();
    filterSermons();
  };

  const showBookTitles = async (book: Book) => {
    filterStore.resetFilter();
    filterStore.filterViewUpdateFilteredBook(book);
    filterStore.updateFilteredBook();
    filterSermons();
  };

  const showGenreTitles = async (genre: Genre) => {
    filterStore.resetFilter();
    filterStore.filterViewUpdateFilteredGenre(genre);
    filterStore.updateFilteredGenre();
    filterSermons();
  };

  const filterSermons = async () => {
    userSessionStore.setPlayerModalVisible(false);
    RootNavigation.goBack();
    RootNavigation.navigate('TabAllSermons', {});
    await apiStore.resetAllSermons();
    apiStore.updateAllSermons();
  };

  return (
    <MenuView
      title={strings.otherSermons}
      onPressAction={({nativeEvent}) => {
        const splittedId = nativeEvent.event.split('-');
        const type = splittedId[0];
        const id = splittedId[1];
        switch (type) {
          case 'artist':
            if (!userSessionStore.selectedSermon?.artist) return;
            showArtistTitles(userSessionStore.selectedSermon.artist);
            break;
          case 'genre':
            const genre = userSessionStore.selectedSermon?.Genres?.find(
              g => g.id === id,
            );
            if (!genre) return;
            showGenreTitles(genre);
            break;
          case 'passage':
            const book = userSessionStore.selectedSermon?.Passages?.find(
              p => p.id === id,
            )?.PassageBook;
            if (!book) return;
            showBookTitles(book);
            break;
          default:
            return;
        }
      }}
      actions={[
        {
          id: `artist-${userSessionStore.selectedSermon?.artist?.id}`,
          title: userSessionStore.selectedSermon?.artist?.name ?? '',
          image: Platform.select({
            ios: 'person',
          }),
        },
        ...(userSessionStore.selectedSermon?.Genres ?? []).map(genre => ({
          id: `genre-${genre.id}`,
          title: genre.name,
          image: Platform.select({
            ios: 'tag',
          }),
        })),
        ...(userSessionStore.selectedSermon?.Passages ?? []).map(passage => ({
          id: `passage-${passage.id}`,
          title: passage.PassageBook.long,
          image: Platform.select({
            ios: 'book',
          }),
        })),
      ]}>
      <Ionicons
        name={'ellipsis-horizontal-circle-outline'}
        size={33}
        color={Appearance.darkColor}
      />
    </MenuView>
  );
};
