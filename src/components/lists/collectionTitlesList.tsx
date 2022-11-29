import * as React from 'react';
import {StyleSheet, View, SafeAreaView, FlatList} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SingleSermonListEntry} from './singleSermonListEntry';
import {RouteProp} from '@react-navigation/native';
import {AlbumListEntry} from './albumListEntry';
import {useStores} from '../../hooks/useStores';

type RootStackParamList = {
  CollectionList: {collectionId: string};
};

type CollectionListScreenRouteProp = RouteProp<
  RootStackParamList,
  'CollectionList'
>;

interface Props {
  navigation: any;
  route: CollectionListScreenRouteProp;
}

export const CollectionTitlesList = observer(({route}: Props) => {
  const {userSessionStore} = useStores();
  const collectionList = userSessionStore.currentCollectionTitles.find(
    collection => collection.id === route.params.collectionId,
  );
  return collectionList ? (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={collectionList.titles}
          renderItem={({item}) => {
            return item.isPartOfAlbum ? (
              <AlbumListEntry
                key={`album-list-entry_${item.id}_${item.artistId}`}
                album={item.album}
                artist={item.artist?.name}
                genre={item.Genres?.length ? item.Genres[0].name : undefined}
              />
            ) : (
              <SingleSermonListEntry key={item.id} sermon={item} />
            );
          }}
        />
      </View>
    </SafeAreaView>
  ) : null;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
