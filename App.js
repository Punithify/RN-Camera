import React, {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
} from 'react-native';

import {RNCamera} from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
import Toast from 'react-native-simple-toast';

async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#03203C',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    }}>
    <Text style={{color: '#FFFFFF', fontSize: 20}}>Loading...</Text>
  </View>
);

const App = () => {
  const [image, setImage] = useState();
  const takePicture = async function (camera) {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);

    //  eslint-disable-next-line
    setImage(data.uri);
    CameraRoll.save(data.uri);
    Toast.show('Image saved to gallery');
  };

  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.preview}>
          <Image source={{uri: image, width: '100%', height: '100%'}} />
          <Button
            color="#841584"
            onPress={() => {
              setImage(null);
            }}
            style={{margin: 30}}
            title="click a image again"
          />
        </View>
      ) : (
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({camera, status}) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => takePicture(camera)}
                  style={styles.capture}>
                  <Text style={{fontSize: 14}}> SNAP </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  clickedImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
});

export default App;
