import {Linking} from 'react-native';
import {fetchAndOpenSermon} from './fetchAndOpenSermon';

export const handleUrlChange = async (event: {url: string}) => {
  const titleId = event?.url?.split('/play/')?.[1];
  if (!titleId) return;
  fetchAndOpenSermon(titleId);
};

export const openSermonFromInitialURL = async () => {
  const initial = await Linking.getInitialURL();
  const titleId = initial?.split('/play/')?.[1];
  if (!titleId) return;
  fetchAndOpenSermon(titleId);
};
