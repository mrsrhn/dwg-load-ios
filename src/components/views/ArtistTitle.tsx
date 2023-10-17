import * as React from 'react';
import {observer} from 'mobx-react-lite';
import {Text, View, Image, StyleSheet, Pressable} from 'react-native';
import {DWGModal} from '../DWGModal';
import {useStores} from '../../hooks/useStores';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Appearance} from '../../appearance';

export const ArtistTitle = observer(() => {
  const {userSessionStore} = useStores();
  const artist = userSessionStore.selectedSermon?.artist;

  const showArtist = () => {
    userSessionStore.setArtistModalVisible(true);
  };

  return (
    <>
      <Pressable style={styles.artistName} onPress={showArtist}>
        <Ionicons
          name="person-circle-outline"
          color={Appearance.greyColor}
          size={15}
          style={styles.icon}
        />
        <View>
          <Text style={styles.artist}>
            {userSessionStore.selectedSermon?.artist?.name}
          </Text>
        </View>
      </Pressable>
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
    </>
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
  artist: {
    textAlign: 'center',
    color: Appearance.greyColor,
    fontWeight: 'bold',
    fontSize: 14,
  },
  artistName: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {marginRight: 5},
});
