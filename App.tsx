import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';

const App = () => {

  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken();
    }
  }

  async function getFcmToken() {
    let fcmToken = await AsyncStorage.getItem("FCMToken");
    console.log('----Old FCM Token----', fcmToken);
    if (!fcmToken) {
      let fcmToken = await messaging().getToken();
      console.log('----New FCM Token----', fcmToken);
      await AsyncStorage.setItem("FCMToken", fcmToken);
    }
  }

  function notificationListener() {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    //Forgound Notification
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
      <Text style={{ fontSize: 16, color: 'black' }}>
        Push Notification App
      </Text>
      <Button
        title="Pre Define Log"
        onPress={async () =>
          await analytics().logLogin({
            method: 'facebook'
          })
        }
      />
      <View style={{marginVertical:20}} />
      <Button
        title="Add To Basket"
        onPress={async () =>{
            await analytics().setAnalyticsCollectionEnabled(true);
            let a = await analytics().logEvent('TestObj1A', {id: 1, name: 'abc', class: 'zxc'});
            console.log(a);
          }
        }
      />
    </View>
  );


}

export default App;