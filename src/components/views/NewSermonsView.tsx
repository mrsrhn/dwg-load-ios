import * as React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Linking,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SingleSermonListEntry} from '../lists/singleSermonListEntry';
import {AlbumListEntry} from '../lists/albumListEntry';
import {useControlCenter} from '../../hooks/useControlCenter';
import {useNetInfo} from '@react-native-community/netinfo';
import RNBootSplash from 'react-native-bootsplash';
import {ListInfo} from '../ListInfo';
import {strings} from '../../strings';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import {Endpoints} from '../../stores/apiStore';
import {Sermon} from '../../types/userSessionStoreTypes';
import {ApiSermon} from '../../types/apiStoreTypes';
import {useStores} from '../../hooks/useStores';

export const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const fetchSermon = async (id): Promise<ApiSermon> => {
  const response = await axios
    .get(`${strings.url}${Endpoints.title}/${id}`)
    .then(r => r.data);

  return response;
};

export const NewSermonsView = observer(() => {
  const {userSessionStore, apiStore, storageStore, playerStore} = useStores();
  const controlCenter = useControlCenter();
  const netInfo = useNetInfo();
  const [refreshing, setRefreshing] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);

  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = React.useState(false);

  React.useEffect(() => {
    controlCenter.init();
  }, []);

  const initWithSermon = (sermon: Sermon, hasBeenPlayedBefore = false) => {
    apiStore.updateAlbumTitles(sermon.albumId);
    userSessionStore.setSelectedSermon(sermon);

    const lastPlayedPosition =
      storageStore.sermonsPositions.find(
        savedSermon => savedSermon.id === sermon.id,
      )?.position ?? 0;

    const lastPlayedLocalPath = storageStore.sermonsDownloaded.find(
      dlSermon => dlSermon.id === sermon.id,
    )
      ? `${storageStore.localPathBase}/${sermon.id}${
          userSessionStore.selectedSermonIsVideo ? '.mp4' : '.mp3'
        }`
      : undefined;

    if (userSessionStore.selectedSermonIsVideo) {
      userSessionStore.setPlayerModalVisible(false);
      playerStore.clearPlayer();
    }
    if (hasBeenPlayedBefore) {
      playerStore.updateSermon(sermon, lastPlayedPosition, lastPlayedLocalPath);
    }
    controlCenter.setNewSermon(sermon);
    userSessionStore.setSelectedSermon(sermon);
  };

  React.useEffect(() => {
    async function initializeOfflineStuff() {
      await Promise.all([
        storageStore.setSermonsDownloadedList(),
        storageStore.setSermonsFavorisedList(),
        storageStore.setSermonsHistoryList(),
        storageStore.setSermonsPositionsList(),
      ]);

      if (storageStore.sermonsHistory.length) {
        // Set inital sermon
        const lastPlayedSermon =
          storageStore.sermonsHistory[storageStore.sermonsHistory.length - 1]
            .sermon;
        initWithSermon(lastPlayedSermon, true);
      }
    }
    async function initialize() {
      await Promise.all([
        apiStore.updateAllSermonsTotal(),
        apiStore.updateNewSermonsTotal(),
      ]);

      await Promise.all([
        apiStore.updateNewSermons(),
        apiStore.updateAllSermons(),
        apiStore.updateCollections(),
      ]);

      openSermonFromInitialURL();
    }

    initializeOfflineStuff();

    if (netInfo.isInternetReachable) {
      initializeOfflineStuff();

      initialize().finally(async () => {
        await RNBootSplash.hide({fade: true});
        setIsInitialized(true);
      });
    } else {
      initializeOfflineStuff().finally(async () => {
        await RNBootSplash.hide({fade: true});
        setIsInitialized(true);
      });
    }
  }, [netInfo.isInternetReachable]);

  // Universal Link handling
  React.useEffect(() => {
    Linking.addEventListener('url', handleAppStateChange);
  }, []);

  const openSermonFromInitialURL = async () => {
    const initial = await Linking.getInitialURL();
    const titleId = initial?.split('/play/')?.[1];
    fetchAndOpenSermon(titleId);
  };

  const handleAppStateChange = async event => {
    const titleId = event?.url?.split('/play/')?.[1];
    if (!titleId) return;
    fetchAndOpenSermon(titleId);
  };

  const fetchAndOpenSermon = async (titleId: string) => {
    const linkedSermon = await fetchSermon(titleId);
    if (!linkedSermon?.id) return;
    initWithSermon(userSessionStore.mapTitles([linkedSermon])[0]);
    userSessionStore.setPlayerModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={userSessionStore.newSermons}
          renderItem={({item}) => {
            return item.groupalbum ? (
              <AlbumListEntry
                key={`album-list-entry_${item.id}_${item.artistId}`}
                album={item.album}
                artist={item.artist?.name}
                genre={item.Genres?.length ? item.Genres[0].name : undefined}
              />
            ) : (
              <SingleSermonListEntry
                key={`sermon-list-entry_${item.id}_${item.artistId}`}
                sermon={item}
              />
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={apiStore.isLoadingNewSermons || refreshing}
              onRefresh={async () => {
                if (netInfo.isInternetReachable) {
                  setRefreshing(true);
                  wait(1000)
                    .then(async () => {
                      await apiStore.resetNewSermons();
                      await apiStore.updateNewSermons();
                    })
                    .then(() => setRefreshing(false));
                } else {
                  Toast.showWithGravity(strings.noConnection, 2, Toast.BOTTOM);
                }
              }}
            />
          }
          onEndReachedThreshold={5}
          onMomentumScrollBegin={() =>
            setOnEndReachedCalledDuringMomentum(false)
          }
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum) {
              if (!apiStore.isLoadingNewSermons) {
                apiStore.updateNewSermons();
              }
            }
          }}
          ListEmptyComponent={
            isInitialized && !netInfo.isInternetReachable ? (
              <ListInfo info={strings.noConnection} />
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
