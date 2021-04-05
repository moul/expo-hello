import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Icon, Button, Layout, Text, IconRegistry, Avatar } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as ImagePicker from 'expo-image-picker';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.Granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log(pickerResult);
    if (pickerResult.cancelled === true) {
      return ;
    }
    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  };

  let clearImage = async() => {
    setSelectedImage(null);
  };

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }
    await Sharing.shareAsync(selectedImage.localUri);
  };

  const IconWithName = (name, props) => (subProps) => (
    <Icon name={name} {...subProps} {...props} />
  );

  const HomeScreen = () => (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category='h1'>Welcome, Mec.</Text>

      
      {selectedImage !== null ? <>
        <Avatar size='giant' shape='rounded' source={{uri: selectedImage.localUri}} />
        <Button accessoryLeft={IconWithName('share-outline')} onPress={openShareDialogAsync}>Share</Button>
        <Button accessoryLeft={IconWithName('trash-2-outline')} onPress={clearImage}>Clear</Button>
      </> : <>
        <Button accessoryLeft={IconWithName('camera-outline')} onPress={openImagePickerAsync}>Upload a photo!</Button>
      </>}
    </Layout>
  );

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <HomeScreen />
      </ApplicationProvider>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
