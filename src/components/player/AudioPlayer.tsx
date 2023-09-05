import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  NativeScrollEvent,
} from 'react-native';
import {ProgressSlider} from './ProgressSlider';
import {PlayerControls} from './PlayerControls';
import {PlayerActions} from './PlayerActions';
import {PlayerInformation} from './PlayerInformation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ModalHeader} from '../ModalHeader';
import {ArtistTitle} from '../views/ArtistTitle';
import {Appearance} from '../../appearance';
import {DWGButton} from '../DWGButton';
import {CommentIcon} from '../views/CommentIcon';
import {useNetInfo} from '@react-native-community/netinfo';
import {strings} from '../../strings';
import {useStores} from '../../hooks/useStores';

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

  const pause = () => {
    if (selectedSermonIsCurrentlyPlaying) {
      updatePaused(!paused);
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
        {userSessionStore.selectedSermonAlbumTitles?.length &&
          userSessionStore.selectedSermonAlbumTitles?.length > 1 && (
            <ScrollView
              onScrollBeginDrag={({nativeEvent}) =>
                props.activateCloseGesture(isCloseToTop(nativeEvent))
              }
              onScrollEndDrag={() => props.activateCloseGesture(true)}
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}>
              {userSessionStore.selectedSermonAlbumTitles.length > 1 ? (
                <React.Fragment>
                  {userSessionStore.selectedSermonAlbumTitles.map(title => (
                    <DWGButton
                      icon={
                        title.id === playerStore.sermon?.id
                          ? 'volume-medium-outline'
                          : undefined
                      }
                      style="secondary"
                      key={`${selectedSermon.id}_${title.id}_button`}
                      selected={title.id === selectedSermon.id}
                      onPress={() => {
                        userSessionStore.setSelectedSermon(title);
                      }}
                      title={`${strings.part} ${title.track}: ${title.title}`}
                      subtitle={
                        title.Passages?.length
                          ? `${title.Passages[0].PassageBook.long} ${title.Passages[0].chapter}`
                          : undefined
                      }
                    />
                  ))}
                </React.Fragment>
              ) : null}
            </ScrollView>
          )}
      </SafeAreaView>
    </React.Fragment>
  );
});

const isCloseToTop = ({contentOffset}: NativeScrollEvent) => {
  return contentOffset.y <= 0;
};

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
  scrollView: {
    minWidth: '100%',
    borderTopColor: Appearance.baseColor,
    borderTopWidth: 1,
    marginTop: 10,
  },
});
