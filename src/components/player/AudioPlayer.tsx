import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Text, StyleSheet, ScrollView, View, Pressable} from 'react-native';
import {ProgressSlider} from './ProgressSlider';
import {PlayerControls} from './PlayerControls';
import {PlayerActions} from './PlayerActions';
import {PlayerInformation} from './PlayerInformation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ModalHeader} from '../ModalHeader';
import {ArtistView} from '../views/ArtistView';
import {Appearance} from '../../appearance';
import {DWGButton} from '../DWGButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CommentView} from '../views/CommentView';
import {useNetInfo} from '@react-native-community/netinfo';
import {strings} from '../../strings';
import {useStores} from '../../hooks/useStores';

interface PlayerProps {
  activateCloseGesture: (isOnTop: boolean) => void;
}

export const Player: React.FC<PlayerProps> = observer(props => {
  const [initialPosition, setInitialPosition] = useState(0);
  const {playerStore, userSessionStore, storageStore} = useStores();
  const {selectedSermon} = userSessionStore;
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
    if (isCurrentlyPlaying) {
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
    if (isCurrentlyPlaying) {
      updatePaused(!paused);
    }
  };

  const showArtist = () => {
    userSessionStore.setArtistModalVisible(true);
  };

  const isCurrentlyPlaying = playerStore.sermon?.id === selectedSermon.id;

  return (
    <React.Fragment>
      <ArtistView />
      <CommentView />
      <SafeAreaView
        style={{
          marginTop: 50,
          marginLeft: 20,
          marginRight: 20,
          minWidth: '95%',
        }}>
        <ModalHeader
          onClose={() => userSessionStore.setPlayerModalVisible(false)}
        />
        <Pressable
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 10,
          }}
          onPress={showArtist}>
          <View style={{flexDirection: 'row'}}>
            <Ionicons
              name="person-circle-outline"
              color={Appearance.greyColor}
              style={{marginRight: 5}}
              size={15}
            />
            <Text style={styles.artist}>{selectedSermon.artist?.name}</Text>
          </View>
        </Pressable>
        <View style={styles.header}>
          <View style={styles.titleWrapper}>
            <Text style={styles.titleString}>{selectedSermon.title}</Text>
            {selectedSermon.comment?.length ? (
              <Pressable
                onPress={() => userSessionStore.setCommentModalVisible(true)}>
                <Ionicons
                  size={25}
                  style={{marginLeft: 5}}
                  color={Appearance.baseColor}
                  name="information-circle-outline"
                />
              </Pressable>
            ) : null}
          </View>
          {selectedSermon.isPartOfAlbum && (
            <Text
              style={
                styles.albumInfo
              }>{`${selectedSermon.album.name} ${selectedSermon.track}/${selectedSermon.album.numTitles}`}</Text>
          )}
        </View>
        <PlayerInformation
          date={selectedSermon.date}
          year={selectedSermon.year}
          passages={selectedSermon.Passages}
          genres={selectedSermon.Genres}
        />
        <PlayerActions
          download={() => storageStore.downloadSermon(selectedSermon)}
          stopDownload={() => storageStore.stopDownladSermon(selectedSermon)}
          pause={pause}
          forVideo={false}
        />
        <ProgressSlider
          enabled={isCurrentlyPlaying}
          initialProgress={isCurrentlyPlaying ? undefined : initialPosition}
          duration={selectedSermon.playtime}
          seekTo={isCurrentlyPlaying ? seek : setInitialPosition}
        />
        <PlayerControls
          isPlaying={isCurrentlyPlaying && !paused}
          isBuffering={isBuffering}
          onPressPlay={onPlayButtonPress}
          onPressForward={() =>
            isCurrentlyPlaying
              ? seek(currentTime + 10)
              : setInitialPosition(initialPosition + 10)
          }
          onPressReplay={() =>
            isCurrentlyPlaying
              ? seek(currentTime - 10)
              : setInitialPosition(initialPosition - 10)
          }
          isDeactivated={
            !netInfo.isInternetReachable &&
            !userSessionStore.selectedSermonIsDownloaded
          }
        />
        <ScrollView
          onScrollBeginDrag={({nativeEvent}) =>
            props.activateCloseGesture(isCloseToTop(nativeEvent))
          }
          onScrollEndDrag={() => props.activateCloseGesture(true)}
          style={{
            minWidth: '100%',
            borderTopColor: Appearance.baseColor,
            borderTopWidth:
              userSessionStore.selectedSermonAlbumTitles &&
              userSessionStore.selectedSermonAlbumTitles.length > 1
                ? 1
                : 0,
            marginTop: 10,
          }}
          showsVerticalScrollIndicator={false}>
          {userSessionStore.selectedSermonAlbumTitles &&
          userSessionStore.selectedSermonAlbumTitles.length > 1 ? (
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
      </SafeAreaView>
    </React.Fragment>
  );
});

const isCloseToTop = ({contentOffset}) => {
  return contentOffset.y <= 0;
};

const styles = StyleSheet.create({
  text: {textAlign: 'center'},
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
  artist: {
    textAlign: 'center',
    color: Appearance.greyColor,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
