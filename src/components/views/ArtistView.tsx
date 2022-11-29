import * as React from 'react';
import {observer} from 'mobx-react-lite';
import {Text, View, Image, StyleSheet} from 'react-native';
import {DWGModal} from '../DWGModal';
import {useStores} from '../../hooks/useStores';

export const ArtistView = observer(() => {
  const {userSessionStore} = useStores();
  const artist = userSessionStore.selectedSermon?.artist;
  return (
    <DWGModal
      title={artist?.name}
      key="artistView-modal"
      visible={userSessionStore.artistModalVisible}
      onClose={() => userSessionStore.setArtistModalVisible(false)}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: artist?.image ?? '',
          }}
        />
      </View>
      <Text>{`${artist?.description ?? ''}`}</Text>
    </DWGModal>
  );
});

var styles = StyleSheet.create({
  image: {
    width: 107,
    height: 165,
    padding: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
