import React from 'react';
import {observer} from 'mobx-react-lite';
import {StyleSheet, View} from 'react-native';

import {SimilarSermonsMenu} from './SimilarSermonsMenu';
import {PlaybackSpeedAction} from './playerActions/PlaybackSpeedAction';
import {SleepTimerAction} from './playerActions/SleepTimerAction';
import {ShareAction} from './playerActions/ShareAction';
import {FavoriseAction} from './playerActions/FavoriseAction';
import {DownloadAction} from './playerActions/DownloadAction';

interface PlayerActionsProps {
  forVideo: boolean;
}

export const PlayerActions: React.FC<PlayerActionsProps> = observer(props => {
  const {forVideo} = props;

  return (
    <React.Fragment>
      <View style={styles.container}>
        <DownloadAction />
        <FavoriseAction />
        {!forVideo && <SleepTimerAction />}
        {!forVideo && <PlaybackSpeedAction />}
        <SimilarSermonsMenu />
        <ShareAction />
      </View>
    </React.Fragment>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});
