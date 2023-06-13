import React, {useEffect, useState, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {PlayerActions} from './PlayerActions';
import {PlayerInformation} from './PlayerInformation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ModalHeader} from '../ModalHeader';
import {ArtistView} from '../views/ArtistView';
import {Appearance} from '../../appearance';
import Video, {LoadError} from 'react-native-video';
import Toast from 'react-native-simple-toast';
import {strings} from '../../strings';
import {useStores} from '../../hooks/useStores';

export const VideoPlayer: React.FC = observer(() => {
  const [isBuffering, setIsBuffering] = useState(false);
  const [initialPosition, setInitialPosition] = useState(0);
  const [paused, setPaused] = useState(true);
  let videoRef = useRef(null);

  const {playerStore, userSessionStore, storageStore} = useStores();
  const {selectedSermon} = userSessionStore;
  const {setCurrentTime, updateIsBuffering, sermon, updatePaused} = playerStore;
  const [key, setKey] = React.useState(0);

  if (!selectedSermon) return null;

  useEffect(() => {
    const sermonWithSavedPosition = storageStore.sermonsPositions.find(
      savedSermon => savedSermon.id === selectedSermon.id,
    );
    setInitialPosition(sermonWithSavedPosition?.position ?? 0);
  }, [selectedSermon.id]);

  const localPath: string | undefined = storageStore.sermonsDownloaded.find(
    dlSermon => dlSermon.id === selectedSermon.id,
  )
    ? `${storageStore.localPathBase}/${selectedSermon.id}.mp4`
    : undefined;

  const showArtist = () => {
    userSessionStore.setArtistModalVisible(true);
  };

  const isDownloading =
    storageStore.currentlyDownloading.findIndex(
      item => item.id === selectedSermon.id,
    ) >= 0;
  const isDownloaded =
    storageStore.sermonsDownloaded.findIndex(s => s.id === selectedSermon.id) >=
    0;
  const isFavorised =
    storageStore.sermonsFavorised.findIndex(
      item => item.sermon.id === selectedSermon.id,
    ) >= 0;

  const downloadingObject = storageStore.currentlyDownloading.find(
    item => item.id === selectedSermon.id,
  );
  const downloadProgress = !downloadingObject
    ? undefined
    : downloadingObject.progress;

  const reload = () => {
    setKey(key + 1);
  };
  return (
    <React.Fragment>
      <ArtistView />
      <SafeAreaView style={{margin: 20, minWidth: '95%'}}>
        <ScrollView
          style={{minWidth: '100%'}}
          showsVerticalScrollIndicator={false}>
          <ModalHeader
            onClose={() => {
              userSessionStore.setPlayerModalVisible(false);
            }}
          />
          {
            <View style={styles.videoWrapper}>
              {isBuffering && <ActivityIndicator />}
              <Video
                source={{
                  uri: localPath || selectedSermon.url,
                }}
                paused={paused}
                ref={videoRef}
                playInBackground={true}
                onTouchStart={() => {
                  setPaused(false);
                  playerStore.updateSermon(selectedSermon, 0, localPath);
                  storageStore.addSermonToHistoryList(selectedSermon);
                }}
                onProgress={({currentTime}) => {
                  setCurrentTime(currentTime);
                  if (sermon) {
                    storageStore.addSermonPosition(sermon, currentTime);
                  }
                }}
                progressUpdateInterval={1000}
                onLoadStart={() => setIsBuffering(true)}
                onLoad={() => {
                  setIsBuffering(false);
                  updateIsBuffering(false);
                  videoRef.current.seek(initialPosition);
                }}
                onError={(e: LoadError) => {
                  if (e.error.code === -1009) {
                    Toast.showWithGravity(
                      strings.noConnection,
                      2,
                      Toast.BOTTOM,
                    );
                  } else {
                    Toast.showWithGravity(strings.error, 2, Toast.BOTTOM);
                  }
                  console.log(e);
                  reload();
                  updatePaused(true);
                  playerStore.clearPlayer();
                  Toast.showWithGravity(strings.noConnection, 2, Toast.BOTTOM);
                }}
                style={styles.video}
                fullscreen={true}
                rate={1.0}
                controls
              />
            </View>
          }
          <Pressable
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 10,
            }}
            onPress={showArtist}>
            <Text style={styles.artist}>{selectedSermon.artist?.name}</Text>
          </Pressable>
          <View style={styles.header}>
            <Text style={styles.titleString}>{selectedSermon.title}</Text>
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
            isFavorised={isFavorised}
            isDownloaded={isDownloaded}
            isDownloading={isDownloading}
            downloadProgress={downloadProgress}
            stopDownload={() => storageStore.stopDownladSermon(selectedSermon)}
            download={() => storageStore.downloadSermon(selectedSermon)}
            pause={() => {}}
            deactivateSleepTimer={true}
          />
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  );
});

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  text: {textAlign: 'center'},
  title: {
    textAlign: 'center',
    color: Appearance.baseColor,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  image: {
    width: 107,
    height: 165,
    padding: 10,
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    marginBottom: 20,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  header: {marginBottom: 10},
  titleString: {
    textAlign: 'center',
    color: Appearance.baseColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
  artist: {
    textAlign: 'center',
    color: Appearance.greyColor,
    fontWeight: 'bold',
    fontSize: 14,
  },
  albumInfo: {
    textAlign: 'center',
    color: Appearance.baseColor,
    fontSize: 14,
  },
});
