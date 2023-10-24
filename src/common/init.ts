import {store} from '../providers/rootStoreProvider';
import {handleUrlChange, openSermonFromInitialURL} from './urlChanges';
import {initWithSermon} from './initWithSermon';
import RNBootSplash from 'react-native-bootsplash';
import {Linking} from 'react-native';
import {AppState} from 'react-native';
import {handleAppStateChange} from './handleAppStateChange';

export async function initializeOnlineStuff() {
  const {apiStore} = store;
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

export async function initializeOfflineStuff() {
  Linking.addEventListener('url', handleUrlChange);
  AppState.addEventListener('change', handleAppStateChange);

  const {storageStore} = store;

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

export async function afterInit() {
  RNBootSplash.hide({fade: true});
  store.userSessionStore.setIsInitialized(true);
}
