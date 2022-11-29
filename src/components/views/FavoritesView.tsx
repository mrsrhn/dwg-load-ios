import * as React from 'react';
import {StyleSheet, View, SafeAreaView, FlatList} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SingleSermonListEntry} from '../lists/singleSermonListEntry';
import {ListInfo} from '../ListInfo';
import {strings} from '../../strings';
import {useStores} from '../../hooks/useStores';

export const FavoritesView = observer(() => {
  const {storageStore} = useStores();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          ListEmptyComponent={<ListInfo info={strings.noFavorised} />}
          data={storageStore.sermonsFavorised.slice().reverse()}
          renderItem={({item}) => (
            <SingleSermonListEntry
              key={`favorite_${item.sermon.id}`}
              sermon={item.sermon}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
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
