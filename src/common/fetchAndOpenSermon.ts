import {store} from '../providers/rootStoreProvider';
import {fetchSermon} from './fetchSermon';
import {initWithSermon} from './initWithSermon';

export const fetchAndOpenSermon = async (titleId: string) => {
  const linkedSermon = await fetchSermon(titleId);
  if (!linkedSermon?.id) return;
  initWithSermon(store.userSessionStore.mapTitles([linkedSermon])[0]);
  store.userSessionStore.setPlayerModalVisible(true);
};
