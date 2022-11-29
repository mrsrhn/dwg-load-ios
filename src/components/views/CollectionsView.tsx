import * as React from 'react';
import {StyleSheet, View, SafeAreaView, FlatList, Text} from 'react-native';
import {observer} from 'mobx-react-lite';
import {CollectionListEntry} from '../lists/collectionListEntry';
import {useNetInfo} from '@react-native-community/netinfo';
import {Appearance} from '../../appearance';
import {DWGModal} from '../DWGModal';
import {strings} from '../../strings';
import {ListInfo} from '../ListInfo';
import {useStores} from '../../hooks/useStores';

export const CollectionsView = observer(() => {
  const {userSessionStore} = useStores();
  const netInfo = useNetInfo();

  return (
    <SafeAreaView style={styles.container}>
      <DWGModal
        title={strings.collections}
        onClose={() => userSessionStore.setInfoCollectionModalVisible(false)}
        visible={userSessionStore.infoCollectionModalVisible}>
        <Text style={styles.listHeaderText}>
          {strings.collectionsDescription}
        </Text>
      </DWGModal>
      <View style={styles.container}>
        <FlatList
          data={userSessionStore.collections}
          renderItem={({item}) => (
            <CollectionListEntry
              key={`collection_${item.id}`}
              collection={item}
            />
          )}
          ListEmptyComponent={
            !netInfo.isInternetReachable ? (
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
  listHeader: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  listHeaderText: {
    fontSize: 16,
    color: Appearance.greyColor,
    textAlign: 'center',
  },
});
