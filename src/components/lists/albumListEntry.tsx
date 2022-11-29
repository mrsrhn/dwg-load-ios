import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Album} from '../../types/userSessionStoreTypes';
import {Appearance} from '../../appearance';
import {useStores} from '../../hooks/useStores';

export const AlbumListEntry = (props: {
  album: Album;
  artist: string | undefined;
  genre: string | undefined;
}) => {
  const navigation = useNavigation();
  const {apiStore} = useStores();

  const handleAlbumPress = () => {
    apiStore.updateAlbumTitles(props.album.id);
    navigation.navigate('AlbumList', {
      albumId: props.album.id,
      name: props.album.name,
    });
  };

  return (
    <TouchableHighlight onPress={handleAlbumPress} underlayColor="white">
      <View style={styles.button}>
        <View style={styles.stringsContainer}>
          <Text style={styles.albumTitle}>{props.album.name}</Text>
          {props.genre && <Text style={styles.albumGenre}>{props.genre}</Text>}
          {props.artist && (
            <Text style={styles.albumArtist}>{props.artist}</Text>
          )}
        </View>
        <View style={styles.albumTitleCounterContainer}>
          <View style={styles.albumTitleCounter}>
            <Text style={styles.albumTitleCounterText}>
              {props.album.numTitles}
            </Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Appearance.greyColor,
    padding: 15,
    backgroundColor: 'white',
    minHeight: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stringsContainer: {
    flex: 5,
    flexDirection: 'column',
  },
  albumTitle: {
    textAlign: 'left',
    paddingLeft: 20,
    color: Appearance.baseColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
  albumArtist: {
    textAlign: 'left',
    paddingLeft: 20,
    color: Appearance.greyColor,
  },
  albumGenre: {
    textAlign: 'left',
    paddingLeft: 20,
    color: Appearance.baseColor,
    fontSize: 18,
  },
  albumTitleCounterContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  albumTitleCounter: {
    marginLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    backgroundColor: Appearance.baseColor,
  },
  albumTitleCounterText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
