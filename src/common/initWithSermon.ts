import {store} from '../providers/rootStoreProvider';
import {Sermon} from '../types/userSessionStoreTypes';

export const initWithSermon = (sermon: Sermon, hasBeenPlayedBefore = false) => {
  const {userSessionStore, apiStore, storageStore, playerStore} = store;
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
  userSessionStore.setSelectedSermon(sermon);
};
