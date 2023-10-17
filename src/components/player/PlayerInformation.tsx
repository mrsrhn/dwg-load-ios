import React from 'react';
import {observer} from 'mobx-react-lite';
import {StyleSheet, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Appearance} from '../../appearance';
import {strings} from '../../strings';
import {useStores} from '../../hooks/useStores';

export const PlayerInformation = observer(() => {
  const {userSessionStore} = useStores();
  if (!userSessionStore.selectedSermon) return null;
  const {Genres, date, Passages, year} = userSessionStore.selectedSermon;

  // Date string transformation
  let dateString: string | undefined;

  // dateString
  if (date !== null) {
    const dateObject = new Date(date.substr(0, 10));
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    dateString = dateObject.toLocaleDateString('de-DE', options);
  } else {
    if (year && year !== '0') {
      dateString = year;
    }
  }

  const infoItems = [
    {
      key: 'books',
      icon: 'md-book',
      text: Passages?.map(
        (passage, index) =>
          `${
            Passages.length > 1
              ? passage.PassageBook.short
              : passage.PassageBook.long
          } ${passage.chapter}${index === Passages?.length - 1 ? '' : ', '}`,
      ),
    },
    {
      key: 'genres',
      icon: 'ios-information-circle-outline',
      text: Genres && Genres.length ? Genres[0].name : undefined,
    },
  ];

  return (
    <React.Fragment>
      <View style={styles.container}>
        {dateString && (
          <Text style={styles.date}>{`${strings.holdAt}${dateString}`}</Text>
        )}
        <View style={styles.infoItemsContainer}>
          {infoItems.map(item => (
            <InfoItem
              key={`infoItem_${item.key}`}
              text={item.text}
              icon={item.icon}
            />
          ))}
        </View>
      </View>
    </React.Fragment>
  );
});

interface InfoItemProps {
  text: string | string[] | undefined;
  icon: string;
}
const InfoItem: React.FC<InfoItemProps> = props => {
  return props.text !== undefined &&
    props.text !== '' &&
    !(props.text.length === 0) ? (
    <View style={styles.infoItem}>
      <Ionicons name={props.icon} color={Appearance.greyColor} />
      <Text style={styles.text}>{props.text}</Text>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  infoItem: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },
  infoItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  container: {
    display: 'flex',
    marginBottom: 10,
  },
  left: {
    flexDirection: 'column',
  },
  right: {
    flexDirection: 'column',
  },
  date: {
    textAlign: 'center',
    color: Appearance.greyColor,
    fontSize: 11,
    marginBottom: 10,
  },
  text: {
    textAlign: 'left',
    color: Appearance.greyColor,
    fontSize: 11,
    marginLeft: 5,
  },
  genreText: {
    textAlign: 'center',
    color: Appearance.greyColor,
    fontSize: 14,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  albumInfo: {
    textAlign: 'center',
    color: Appearance.baseColor,
    fontSize: 14,
    marginBottom: 10,
  },
});
