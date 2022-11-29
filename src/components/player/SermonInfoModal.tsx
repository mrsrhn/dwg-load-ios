import * as React from 'react';
import {observer} from 'mobx-react-lite';
import {Text, View, StyleSheet} from 'react-native';
import {DWGModal} from '../DWGModal';
import {Appearance} from '../../appearance';
import {DWGButton} from '../DWGButton';
import {Artist, Genre, Passage, Book} from '../../types/userSessionStoreTypes';
import {strings} from '../../strings';
import {useStores} from '../../hooks/useStores';

interface SermonInfoModalProps {
  showArtistTitles: (artist: Artist) => void;
  showGenreTitles: (genre: Genre) => void;
  showBookTitles: (book: Book) => void;
  artist: Artist | undefined;
  genres: Genre[];
  passages: Passage[];
}
export const SermonInfoModal: React.FC<SermonInfoModalProps> = observer(
  props => {
    const {userSessionStore} = useStores();

    let books = props.passages.map(passage => passage.PassageBook.long);
    books = [...new Set(books)];
    return (
      <DWGModal
        title={strings.otherSermons}
        key="infoView-modal"
        visible={userSessionStore.infoModalVisible}
        onClose={() => userSessionStore.setInfoModalVisible(false)}>
        <View style={styles.textWrapper}>
          <Text style={styles.text}>{strings.speaker}</Text>
        </View>
        <DWGButton
          style="secondary"
          key={`more-from-${props.artist?.name}`}
          title={props.artist?.name ?? ''}
          onPress={() => {
            userSessionStore.setInfoModalVisible(false);
            if (!props.artist) throw Error('no-artist-defined');
            props.showArtistTitles(props.artist);
          }}
        />
        {props.genres.length > 0 && (
          <View style={styles.textWrapper}>
            <Text style={styles.text}>{strings.category}</Text>
          </View>
        )}
        {props.genres.map(genre => (
          <DWGButton
            style="secondary"
            key={`more-from-${genre.id}`}
            title={genre.name ?? ''}
            onPress={() => {
              userSessionStore.setInfoModalVisible(false);
              if (!props.artist) throw Error('no-artist-defined');
              props.showGenreTitles(genre);
            }}
          />
        ))}
        {props.passages.length > 0 && (
          <View style={styles.textWrapper}>
            <Text style={styles.text}>{strings.biblePassage}</Text>
          </View>
        )}
        {books.map((book, index) => (
          <DWGButton
            style="secondary"
            key={`more-from-${book}`}
            title={book}
            onPress={() => {
              userSessionStore.setInfoModalVisible(false);
              if (!props.artist) throw Error('no-artist-defined');
              props.showBookTitles(props.passages[index].PassageBook);
            }}
          />
        ))}
      </DWGModal>
    );
  },
);

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    color: Appearance.greyColor,
  },
});
