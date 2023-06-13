import React from 'react';
import {observer} from 'mobx-react-lite';
import {Player} from '../player/AudioPlayer';
import {StyleSheet, Modal, View} from 'react-native';
import {VideoPlayer} from '../player/VideoPlayer';
import GestureRecognizer from 'react-native-swipe-gestures';
import * as RootNavigation from '../../RootNavigation';
import {Artist, Genre, Book} from '../../types/userSessionStoreTypes';
import {useStores} from '../../hooks/useStores';

export const PlayerView = observer(() => {
  const {userSessionStore, apiStore, filterStore} = useStores();
  const [scrollViewIsOnTop, activateCloseGesture] = React.useState(true);

  const showGenreTitles = async (genre: Genre) => {
    filterStore.resetFilter();
    filterStore.filterViewUpdateFilteredGenre(genre);
    filterStore.updateFilteredGenre();
    userSessionStore.setPlayerModalVisible(false);
    RootNavigation.goBack();
    RootNavigation.navigate('TabAllSermons', {});
    await apiStore.resetAllSermons();
    apiStore.updateAllSermons();
  };

  const showArtistTitles = async (artist: Artist) => {
    filterStore.resetFilter();
    filterStore.filterViewUpdateFilteredArtist(artist);
    filterStore.updateFilteredArtist();
    userSessionStore.setPlayerModalVisible(false);
    RootNavigation.goBack();
    RootNavigation.navigate('TabAllSermons', {});
    await apiStore.resetAllSermons();
    apiStore.updateAllSermons();
  };

  const showBookTitles = async (book: Book) => {
    filterStore.resetFilter();
    filterStore.filterViewUpdateFilteredBook(book);
    filterStore.updateFilteredBook();
    userSessionStore.setPlayerModalVisible(false);
    RootNavigation.goBack();
    RootNavigation.navigate('TabAllSermons', {});
    await apiStore.resetAllSermons();
    apiStore.updateAllSermons();
  };

  return (
    <GestureRecognizer
      onSwipeDown={() => {
        if (!scrollViewIsOnTop) return;
        if (!userSessionStore.artistModalVisible) {
          userSessionStore.setPlayerModalVisible(false);
        }
      }}>
      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        visible={userSessionStore.playerModalVisible}
        style={styles.container}
        onRequestClose={() => userSessionStore.setPlayerModalVisible(false)}>
        <View style={styles.container}>
          {userSessionStore.selectedSermonIsVideo ? (
            <VideoPlayer />
          ) : (
            <Player activateCloseGesture={activateCloseGesture} />
          )}
        </View>
      </Modal>
    </GestureRecognizer>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});
