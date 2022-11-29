import * as React from 'react';
import {StyleSheet, View, SafeAreaView, FlatList} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SingleSermonListEntry} from './singleSermonListEntry';
import {RouteProp} from '@react-navigation/native';
import {useStores} from '../../hooks/useStores';

type RootStackParamList = {
  AlbumList: {albumId: string};
};

type AlbumListScreenRouteProp = RouteProp<RootStackParamList, 'AlbumList'>;

interface Props {
  navigation: any;
  route: AlbumListScreenRouteProp;
}

export const AlbumTitlesList = observer(({route}: Props) => {
  const {userSessionStore, apiStore} = useStores();

  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = React.useState(false);

  const albumList = userSessionStore.currentAlbumTitles.find(
    album => album.id === route.params.albumId,
  );

  return albumList ? (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={albumList.titles}
          renderItem={({item}) => {
            return <SingleSermonListEntry key={item.id} sermon={item} />;
          }}
          onEndReachedThreshold={5}
          onMomentumScrollBegin={() =>
            setOnEndReachedCalledDuringMomentum(false)
          }
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum) {
              if (!apiStore.isLoadingNewSermons) {
                apiStore.updateNewSermons();
              }
            }
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
