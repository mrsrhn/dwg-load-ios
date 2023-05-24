import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Pressable,
  Alert,
} from 'react-native';
import {Sermon} from '../../types/userSessionStoreTypes';
import {Appearance} from '../../appearance';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import {strings} from '../../strings';
import {useStores} from '../../hooks/useStores';

export const DownloadsListEntry = (props: {sermon: Sermon}) => {
  const {userSessionStore, storageStore, apiStore} = useStores();
  const handleSermonPress = () => {
    userSessionStore.setSelectedSermon(props.sermon);
    apiStore.updateAlbumTitles(props.sermon.albumId);
    userSessionStore.setPlayerModalVisible(true);
  };

  const showAlbumInfo = props.sermon.album.numTitles > 1;
  const albumInfo = `${props.sermon.album.name} ${props.sermon.track}/${props.sermon.album.numTitles}`;

  const onDelete = () => {
    Alert.alert(
      strings.deleteQuestion,
      undefined,
      [
        {
          text: strings.delete,
          onPress: () => {
            storageStore.deleteSermon(props.sermon);
            Toast.showWithGravity(strings.downloadDeleted, 2, Toast.BOTTOM);
          },
          style: 'destructive',
        },
        {
          text: strings.cancel,
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <TouchableHighlight onPress={handleSermonPress} underlayColor="white">
      <View style={styles.container}>
        <View style={styles.button}>
          <Text style={styles.sermonTitle}>{props.sermon.title}</Text>
          {showAlbumInfo && <Text style={styles.albumInfo}>{albumInfo}</Text>}
          {props.sermon.Genres && (
            <Text style={styles.sermonGenre}>
              {props.sermon.Genres?.map((genre, index) => {
                if (props.sermon.Genres) {
                  return index === props.sermon.Genres?.length - 1
                    ? genre.name
                    : `${genre.name}, `;
                }
                return '';
              })}
            </Text>
          )}
          <Text style={styles.sermonArtist}>{props.sermon.artist?.name}</Text>
          <Text style={styles.sermonPassage}>
            {props.sermon.Passages?.map((passage, index) => {
              if (props.sermon.Passages) {
                return index === props.sermon.Passages?.length - 1
                  ? `${passage.PassageBook.long} ${passage.chapter}`
                  : `${passage.PassageBook.long} ${passage.chapter}, `;
              }
              return '';
            })}
          </Text>
        </View>
        <View style={styles.deleteButton}>
          <Pressable onPress={onDelete} style={{padding: 20}}>
            <Ionicons
              name="trash-outline"
              color={Appearance.alarmColor}
              size={25}
            />
          </Pressable>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row'},
  button: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Appearance.greyColor,
    padding: 20,
    backgroundColor: 'white',
    minHeight: 100,
    width: '80%',
  },
  deleteButton: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Appearance.greyColor,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 100,
    width: '20%',
  },
  sermonTitle: {
    textAlign: 'left',
    paddingLeft: 20,
    color: Appearance.baseColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
  sermonGenre: {
    textAlign: 'left',
    paddingLeft: 20,
    color: Appearance.baseColor,
    fontSize: 18,
  },
  sermonArtist: {
    textAlign: 'left',
    paddingLeft: 20,
    color: Appearance.greyColor,
  },
  sermonPassage: {
    textAlign: 'left',
    paddingLeft: 20,
    color: Appearance.greyColor,
  },
  albumInfo: {
    textAlign: 'left',
    paddingLeft: 20,
    color: Appearance.baseColor,
    fontSize: 18,
  },
});
