import React from 'react';
import {observer} from 'mobx-react-lite';
import {Pressable, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useStores} from '../../../hooks/useStores';
import Toast from 'react-native-simple-toast';
import {strings} from '../../../strings';
import {Appearance} from '../../../appearance';

export const FavoriseAction = observer(() => {
  const {userSessionStore, storageStore} = useStores();

  const toggleFavorite = () => {
    if (!userSessionStore.selectedSermon) return;
    if (userSessionStore.selectedSermonIsFavorised) {
      Toast.showWithGravity(strings.removedSaved, 2, Toast.BOTTOM);

      storageStore.removeFavorisedSermon(userSessionStore.selectedSermon);
    } else {
      Toast.showWithGravity(strings.saved, 2, Toast.BOTTOM);
      storageStore.addSermonToFavorisedSermonsList(
        userSessionStore.selectedSermon,
      );
    }
  };

  const FavoriseActionView = observer(({pressed}: {pressed: boolean}) => (
    <Ionicons
      name={
        userSessionStore.selectedSermonIsFavorised
          ? 'ios-star'
          : 'ios-star-outline'
      }
      size={27}
      color={pressed ? Appearance.baseColor : Appearance.darkColor}
    />
  ));
  return (
    <Pressable style={styles.button} onPress={toggleFavorite}>
      {({pressed}) => <FavoriseActionView pressed={pressed} />}
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
