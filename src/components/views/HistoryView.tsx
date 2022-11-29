import * as React from 'react';
import {StyleSheet, View, SafeAreaView, SectionList, Text} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SingleSermonListEntry} from '../lists/singleSermonListEntry';
import {LocalDate, DateTimeFormatter} from '@js-joda/core';
import {HistorySermon} from '../../stores/storageStore';
import {strings} from '../../strings';
import {Appearance} from '../../appearance';
import {ListInfo} from '../ListInfo';
import {useStores} from '../../hooks/useStores';

interface SectionData {
  title: string;
  data: HistorySermon[];
}
export const HistoryView = observer(() => {
  const {storageStore} = useStores();

  const sectionData: SectionData[] = [];

  storageStore.sermonsHistory
    .filter(entry => entry.sermon !== undefined && entry.date !== undefined)
    .slice()
    .reverse()
    .forEach(sermon => {
      const dataEntry = sectionData.find(d => d.title === sermon.date);
      if (dataEntry) {
        dataEntry.data.push(sermon);
      } else {
        sectionData.push({
          title: sermon.date ?? LocalDate.parse('1900-01-01').toString(),
          data: [sermon],
        });
      }
    });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <SectionList
          ListEmptyComponent={<ListInfo info={strings.noHistory} />}
          sections={sectionData}
          renderItem={({item}) => (
            <SingleSermonListEntry
              key={`history_${item.sermon.id}`}
              sermon={item.sermon}
            />
          )}
          renderSectionHeader={({section: {title}}) => {
            return (
              <Text style={styles.sectionHeader}>
                {LocalDate.now().equals(LocalDate.parse(title))
                  ? strings.today
                  : LocalDate.now().minusDays(1).equals(LocalDate.parse(title))
                  ? strings.yesterday
                  : LocalDate.parse(title).format(
                      DateTimeFormatter.ofPattern('MM.dd.yyyy'),
                    )}
              </Text>
            );
          }}
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
  sectionHeader: {
    color: Appearance.greyColor,
    padding: 10,
    borderBottomColor: Appearance.greyColor,
    borderBottomWidth: 1,
    backgroundColor: 'white',
  },
});
