/* eslint-disable quotes */
import * as React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  ScrollView,
  Button,
  PermissionsAndroid,
  Platform,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";

/* toggle includeExtra */
const includeExtra = true;

export default function App() {
  const [response, setResponse] = React.useState();

  React.useEffect(() => {
    console.log("Response setted : ", response);
  }, [response]);

  const checkWriteExternalStoragePermission = async () => {
    console.log("Check write external storage permission");
    const permissionResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Cool Photo App Write External Storage Permission",
        message:
          "Cool Photo App needs write to your external storage " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    console.log("Permission result : ", permissionResult);

    return new Promise((resolve, reject) => {
      if (
        Platform.OS === "ios" ||
        permissionResult === PermissionsAndroid.RESULTS.GRANTED
      ) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  };

  const checkCameraPermission = async () => {
    console.log("Check camera permission");
    const permissionResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    console.log("Permission result : ", permissionResult);

    return new Promise((resolve, reject) => {
      if (
        Platform.OS === "ios" ||
        permissionResult === PermissionsAndroid.RESULTS.GRANTED
      ) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  };

  const onButtonPress = React.useCallback(async (type, options) => {
    if (type === "capture") {
      // ImagePicker.launchCamera(options, setResponse);
      checkCameraPermission()
        .then(() => {
          console.log("Check camera permission than");
          checkWriteExternalStoragePermission()
            .then(() => {
              console.log("Check write external storage permission than");
              ImagePicker.launchCamera(options, setResponse);
            })
            .catch(() => {
              console.log("Check write external storage permission catch");
            });
        })
        .catch(() => {
          console.log("Check camera permission catch");
        });
    } else {
      ImagePicker.launchImageLibrary(options, setResponse);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>🌄 React Native Image Picker</Text>
      <ScrollView>
        <View style={styles.buttonContainer}>
          {Action.map(({ title, type, options }) => {
            return (
              <Button
                key={title}
                title={title}
                onPress={() => onButtonPress(type, options)}></Button>
            );
          })}
        </View>

        {response?.assets &&
          response?.assets.map(({ uri }) => (
            <View key={uri} style={styles.image}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={{ width: 200, height: 200 }}
                source={{ uri: uri }}
              />
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "aliceblue",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },

  image: {
    marginVertical: 24,
    alignItems: "center",
  },
});

const Action = [
  {
    title: "Take Image",
    type: "capture",
    options: {
      saveToPhotos: true,
      mediaType: "photo",
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: "Select Image",
    type: "library",
    options: {
      maxHeight: 200,
      maxWidth: 200,
      selectionLimit: 0,
      mediaType: "photo",
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: "Take Video",
    type: "capture",
    options: {
      saveToPhotos: true,
      mediaType: "video",
      includeExtra,
    },
  },
  {
    title: "Select Video",
    type: "library",
    options: {
      selectionLimit: 0,
      mediaType: "video",
      includeExtra,
    },
  },
  {
    title: `Select Image or Video\n(mixed)`,
    type: "library",
    options: {
      selectionLimit: 0,
      mediaType: "mixed",
      includeExtra,
    },
  },
];
