import {
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Constants from "expo-constants";
import logo from "../assets/logo.png";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/core";

export default function AroundMe() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const animation = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync();

          const response = await axios.get(
            `https://express-airbnb-api.herokuapp.com/rooms/around?latitude=${location.coords.latitude}longitude=${location.coords.longitude}`
          );

          setData(response.data);
          setIsLoading(false);
        } else {
          alert("Permission refusée");
        }
      } catch (error) {
        console.log(error);
      }
    };

    getPermission();
  }, []);

  return isLoading ? (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: "white",
        }}
        source={require("../assets/lottie.json")}
      />
      <Text>Chargement ...</Text>
    </View>
  ) : (
    <>
      <View style={styles.header}>
        <View>
          <Image source={logo} style={styles.logo} />
        </View>
      </View>

      <MapView
        showsUserLocation={true}
        initialRegion={{
          latitude: 48.856614,
          longitude: 2.3522219,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        style={styles.mapView}
        provider={Platform.OS === "Android" ? PROVIDER_GOOGLE : null}
      >
        {data.map((elem, index) => {
          return (
            <MapView.Marker
              key={index}
              coordinate={{
                latitude: elem.location[1],
                longitude: elem.location[0],
              }}
              onPress={() =>
                navigation.navigate("Room", { announceId: elem._id })
              }
            />
          );
        })}
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    borderBottomColor: "#BBBBBB",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Constants.statusBarHeight,
    paddingHorizontal: 15,
  },

  logo: {
    height: 35,
    width: 32,
  },

  mapView: {
    height: "100%",
    width: "100%",
  },

  animationContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
