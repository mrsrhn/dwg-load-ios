import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Text, StyleSheet, View} from 'react-native';
import {ProgressSlider} from './ProgressSlider';
import {PlayerControls} from './PlayerControls';
import {PlayerActions} from './PlayerActions';
import {PlayerInformation} from './PlayerInformation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ModalHeader} from '../ModalHeader';
import {ArtistTitle} from '../views/ArtistTitle';
import {Appearance} from '../../appearance';
import {CommentIcon} from '../views/CommentIcon';
import {useNetInfo} from '@react-native-community/netinfo';
import {useStores} from '../../hooks/useStores';
import {AlbumTitles} from './AlbumTitles';

interface PlayerProps {
  activateCloseGesture: (isOnTop: boolean) => void;
}

export const Player: React.FC<PlayerProps> = observer(props => {
  const [initialPosition, setInitialPosition] = useState(0);
  const {playerStore, userSessionStore, storageStore} = useStores();
  const {selectedSermon, selectedSermonIsCurrentlyPlaying} = userSessionStore;
  const netInfo = useNetInfo();

  if (!selectedSermon) return null;

  const {
    paused,
    position: currentTime,
    updatePaused,
    seek,
    isBuffering,
  } = playerStore;

  useEffect(() => {
    return () => {
      if (playerStore.sermon && playerStore.sermon.id !== selectedSermon.id) {
        userSessionStore.setSelectedSermon(playerStore.sermon);
      }
    };
  }, []);

  useEffect(() => {
    const sermonWithSavedPosition = storageStore.sermonsPositions.find(
      savedSermon => savedSermon.id === selectedSermon.id,
    );
    setInitialPosition(sermonWithSavedPosition?.position ?? 0);
  }, [selectedSermon.id]);

  const onPlayButtonPress = () => {
    if (selectedSermonIsCurrentlyPlaying) {
      updatePaused(!paused);
    } else {
      playerStore.updateSermon(
        selectedSermon,
        initialPosition,
        userSessionStore.localPathMp3,
      );
      updatePaused(false);
      storageStore.addSermonToHistoryList(selectedSermon);
    }
  };

  return (
    <React.Fragment>
      <SafeAreaView style={styles.container}>
        <ModalHeader
          onClose={() => userSessionStore.setPlayerModalVisible(false)}
        />
        <ArtistTitle />
        <View style={styles.header}>
          <View style={styles.titleWrapper}>
            <Text style={styles.titleString}>{selectedSermon.title}</Text>
            <CommentIcon />
          </View>
          {!!userSessionStore.selectedSermonAlbumInfo && (
            <Text style={styles.albumInfo}>
              {userSessionStore.selectedSermonAlbumInfo}
            </Text>
          )}
        </View>
        <PlayerInformation />
        <PlayerActions forVideo={false} />
        <ProgressSlider
          enabled={selectedSermonIsCurrentlyPlaying}
          initialProgress={
            selectedSermonIsCurrentlyPlaying ? undefined : initialPosition
          }
          duration={selectedSermon.playtime}
          seekTo={selectedSermonIsCurrentlyPlaying ? seek : setInitialPosition}
        />
        <PlayerControls
          isPlaying={selectedSermonIsCurrentlyPlaying && !paused}
          isBuffering={isBuffering}
          onPressPlay={onPlayButtonPress}
          onPressForward={() =>
            selectedSermonIsCurrentlyPlaying
              ? seek(currentTime + 10)
              : setInitialPosition(initialPosition + 10)
          }
          onPressReplay={() =>
            selectedSermonIsCurrentlyPlaying
              ? seek(currentTime - 10)
              : setInitialPosition(initialPosition - 10)
          }
          isDeactivated={
            !netInfo.isInternetReachable &&
            !userSessionStore.selectedSermonIsDownloaded
          }
        />
        <AlbumTitles activateCloseGesture={props.activateCloseGesture} />
      </SafeAreaView>
    </React.Fragment>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
    minWidth: '95%',
  },
  header: {marginBottom: 10},
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  titleString: {
    flex: 1,
    textAlign: 'center',
    color: Appearance.baseColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
  albumInfo: {
    textAlign: 'center',
    color: Appearance.baseColor,
    fontSize: 14,
  },
});
