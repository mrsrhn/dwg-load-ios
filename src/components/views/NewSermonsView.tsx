import * as React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SingleSermonListEntry} from '../lists/singleSermonListEntry';
import {AlbumListEntry} from '../lists/albumListEntry';
import {useNetInfo} from '@react-native-community/netinfo';
import {ListInfo} from '../ListInfo';
import {strings} from '../../strings';
import Toast from 'react-native-simple-toast';
import {useStores} from '../../hooks/useStores';
import {wait} from '../../common/wait';

export const NewSermonsView = observer(() => {
  const {userSessionStore, apiStore} = useStores();
  const netInfo = useNetInfo();
  const [refreshing, setRefreshing] = React.useState(false);

  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={userSessionStore.newSermons}
          renderItem={({item}) => {
            return item.groupalbum ? (
              <AlbumListEntry
                key={`album-list-entry_${item.id}_${item.artistId}`}
                album={item.album}
                artist={item.artist?.name}
                genre={item.Genres?.length ? item.Genres[0].name : undefined}
              />
            ) : (
              <SingleSermonListEntry
                key={`sermon-list-entry_${item.id}_${item.artistId}`}
                sermon={item}
              />
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={apiStore.isLoadingNewSermons || refreshing}
              onRefresh={async () => {
                if (netInfo.isInternetReachable) {
                  setRefreshing(true);
                  wait(1000)
                    .then(async () => {
                      await apiStore.resetNewSermons();
                      await apiStore.updateNewSermons();
                    })
                    .then(() => setRefreshing(false));
                } else {
                  Toast.showWithGravity(strings.noConnection, 2, Toast.BOTTOM);
                }
              }}
            />
          }
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
          ListEmptyComponent={
            userSessionStore.isInitialized && !netInfo.isInternetReachable ? (
              <ListInfo info={strings.noConnection} />
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
