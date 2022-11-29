import * as React from 'react';
import {observer} from 'mobx-react-lite';
import {
  Text,
  View,
  Linking,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import {Appearance} from '../../appearance';
import {SafeAreaView} from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import {strings} from '../../strings';

export const InfoView = observer(() => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require('../../assets/logo.png')}
      />
      <ScrollView>
        <View style={styles.scrollView}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.text}>{strings.info1} </Text>
            <Text style={styles.text}>{strings.info2}</Text>
            <Text style={styles.text}>{strings.info3}</Text>
            <Text style={styles.title}>{strings.contact}</Text>
            <Text
              style={styles.url}
              onPress={() => Linking.openURL('mailto:info@dwgradio.net')}>
              {strings.contactUs}
            </Text>
            <Text
              style={styles.url}
              onPress={() => Linking.openURL('http://load.dwgradio.net')}>
              {strings.dwgLoadInternet}
            </Text>
            <Text
              style={styles.url}
              onPress={() => Linking.openURL('http://radio.dwgradio.net')}>
              {strings.dwgRadioInternet}
            </Text>
            <Text style={styles.title}>{strings.donation}</Text>
            <Text style={styles.text}>{strings.donationInfo1}</Text>
            <Text style={styles.text}>{strings.donationInfo2}</Text>
            <Text style={styles.subTitle}>{strings.bank}</Text>
            <Text
              style={[styles.text, styles.clickable]}
              onPress={() => {
                Clipboard.setString(strings.dwgRadio);
                Toast.showWithGravity(strings.copyClipboard, 2, Toast.BOTTOM);
              }}>
              {strings.dwgRadio}
            </Text>
            <Text
              style={[styles.text, styles.clickable]}
              onPress={() => {
                Clipboard.setString(strings.iban);
                Toast.showWithGravity(strings.copyClipboard, 2, Toast.BOTTOM);
              }}>
              {strings.ibanFormatted}
            </Text>
            <Text
              style={[styles.text, styles.clickable]}
              onPress={() => {
                Clipboard.setString(strings.bic);
                Toast.showWithGravity(strings.copyClipboard, 2, Toast.BOTTOM);
              }}>
              {strings.bicFormatted}
            </Text>
            <Text style={styles.subTitle}>{strings.or}</Text>
            <Pressable
              style={{
                width: '100%',
                alignItems: 'center',
              }}
              onPress={() =>
                Linking.openURL(
                  'https://www.paypal.com/donate/?hosted_button_id=SVB67LZ9JGAME',
                )
              }>
              <Image
                style={styles.paypalLogo}
                resizeMode="contain"
                source={require('../../assets/paypal.png')}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
  },
  scrollView: {padding: 20, paddingBottom: 100},
  logo: {width: '50%', height: 100},
  paypalLogo: {width: '30%'},
  title: {
    marginTop: 30,
    textAlign: 'center',
    color: Appearance.baseColor,
    fontWeight: 'bold',
    fontSize: 22,
  },
  subTitle: {
    marginTop: 20,
    textAlign: 'center',
    color: Appearance.baseColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
    color: Appearance.greyColor,
    fontSize: 18,
  },
  url: {
    marginTop: 10,
    textAlign: 'center',
    color: Appearance.darkColor,
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  clickable: {
    textDecorationLine: 'underline',
  },
});
