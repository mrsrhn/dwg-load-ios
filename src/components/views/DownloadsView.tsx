import * as React from 'react';
import {StyleSheet, View, SafeAreaView, FlatList} from 'react-native';
import {observer} from 'mobx-react-lite';
import {DownloadsListEntry} from '../lists/downloadsListEntry';
import {strings} from '../../strings';
import {ListInfo} from '../ListInfo';
import {useStores} from '../../hooks/useStores';

export const DownloadsView = observer(() => {
  const {storageStore} = useStores();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          ListEmptyComponent={<ListInfo info={strings.noDownloads} />}
          data={storageStore.sermonsDownloaded.slice().reverse()}
          renderItem={({item}) => (
            <DownloadsListEntry key={`download_${item.id}`} sermon={item} />
          )}
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
