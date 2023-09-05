import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Appearance} from '../../../appearance';
import {useStores} from '../../../hooks/useStores';
import {strings} from '../../../strings';
import Share, {ShareOptions} from 'react-native-share';
import {observer} from 'mobx-react-lite';

export const ShareAction = observer(() => {
  const {userSessionStore} = useStores();

  const shareOptions: ShareOptions = {
    message: `${userSessionStore.selectedSermon?.artist?.name ?? ''} - ${
      userSessionStore.selectedSermon?.title
    }`,
    title: userSessionStore.selectedSermon?.title,
    subject: `${userSessionStore.selectedSermon?.artist?.name ?? ''} - ${
      userSessionStore.selectedSermon?.title
    }`,
    url: `${strings.base}play/${userSessionStore.selectedSermon?.id}`,
  };

  const onShare = () => {
    Share.open(shareOptions);
  };

  return (
    <Pressable style={styles.button} onPress={onShare}>
      {({pressed}) => (
        <Ionicons
          name="ios-share-outline"
          size={27}
          color={pressed ? Appearance.baseColor : Appearance.darkColor}
        />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
