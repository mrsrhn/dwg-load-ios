import {AppStateStatus} from 'react-native';
import {store} from '../providers/rootStoreProvider';

export function handleAppStateChange(e: AppStateStatus) {
  console.log(e);
  if (e === 'inactive' && store.playerStore.sermon) {
    store.storageStore.addSermonPosition(
      store.playerStore.sermon,
      store.playerStore.position,
    );
  }
}
