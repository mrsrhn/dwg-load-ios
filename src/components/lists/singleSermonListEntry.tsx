import React from 'react';
import {observer} from 'mobx-react-lite';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Sermon} from '../../types/userSessionStoreTypes';
import {Appearance} from '../../appearance';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useStores} from '../../hooks/useStores';

interface SingleSermonListEntryProps {
  sermon: Sermon;
}

export const SingleSermonListEntry: React.FC<SingleSermonListEntryProps> =
  observer(props => {
    const {userSessionStore, apiStore, storageStore} = useStores();

    const handleSermonPress = () => {
      userSessionStore.setSelectedSermon(props.sermon);
      apiStore.updateAlbumTitles(props.sermon.albumId);
      userSessionStore.setPlayerModalVisible(true);
    };

    const progress = storageStore.sermonsPositions.find(
      s => s.id === props.sermon.id,
    )?.position;

    const progressPercent = progress
      ? Math.round((progress / props.sermon.playtime) * 100)
      : undefined;

    const showAlbumInfo = props.sermon.album.numTitles > 1;
    const albumInfo = `${props.sermon.album.name} ${props.sermon.track}/${props.sermon.album.numTitles}`;

    return (
      <TouchableHighlight onPress={handleSermonPress} underlayColor="white">
        <View style={listEntryStyles.button}>
          <View style={{flexDirection: 'row'}}>
            <Text style={listEntryStyles.sermonTitle}>
              {props.sermon.title}
            </Text>
            {progressPercent !== undefined &&
              progressPercent > 0 &&
              progressPercent !== 100 && (
                <Text
                  style={
                    listEntryStyles.progress
                  }>{`${progressPercent}%`}</Text>
              )}
            {progressPercent === 100 && (
              <Ionicons
                name="checkmark-circle-outline"
                style={listEntryStyles.progressCheck}
                size={20}
                color={Appearance.baseColor}
              />
            )}
          </View>
          {showAlbumInfo && (
            <Text style={listEntryStyles.albumInfo}>{albumInfo}</Text>
          )}
          {props.sermon.Genres && (
            <Text style={listEntryStyles.sermonGenre}>
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
          <Text style={listEntryStyles.sermonArtist}>
            {props.sermon.artist?.name}
          </Text>
          <Text style={listEntryStyles.sermonPassage}>
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
      </TouchableHighlight>
    );
  });

export const listEntryStyles = StyleSheet.create({
  button: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Appearance.greyColor,
    padding: 15,
    backgroundColor: 'white',
    minHeight: 100,
  },
  sermonTitle: {
    textAlign: 'left',
    paddingLeft: 20,
    color: Appearance.baseColor,
    fontWeight: 'bold',
    fontSize: 18,
    maxWidth: '80%',
  },
  progress: {
    paddingLeft: 10,
    alignSelf: 'center',
    color: Appearance.baseColor,
    fontSize: 12,
  },
  progressCheck: {
    paddingLeft: 10,
    alignSelf: 'center',
    color: Appearance.baseColor,
  },
  albumInfo: {
    textAlign: 'left',
    paddingLeft: 20,
    color: Appearance.baseColor,
    fontSize: 18,
  },
  sermonGenre: {
    textAlign: 'left',
    paddingLeft: 20,
    color: Appearance.greyColor,
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
});
