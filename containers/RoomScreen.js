import { useNavigation } from "@react-navigation/core";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import {
  Text,
  View,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState, useEffect } from "react";
import Constants from "expo-constants";
import logo from "../assets/logo.png";
import { Entypo } from "@expo/vector-icons";
import ArrowBack from "../assets/components/ArrowBack";

export default function RoomScreen(props) {
  const { announceId } = props.route.params;

  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const fetchData = async () => {
    const userToken = await AsyncStorage.getItem("userToken");

    if (userToken) {
      const response = await axios.get(
        `https://express-airbnb-api.herokuapp.com/rooms/${announceId}`
      );
      setData(response.data);
      setIsLoading(false);
    }
  };

  const getPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      } else {
        alert("Permission refusée");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    getPermission();
  }, []);


  const rating = (number) => {
    const tab = [];

    for (let i = 0; i < 5; i++) {
      if (i < number) {
        tab.push(<Entypo key={i} name="star" size={24} color="#FFB000" />);
      } else {
        tab.push(<Entypo key={i} name="star" size={24} color="#BBBBBB" />);
      }
    }
    return tab;
  };

  if (isLoading) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  } else {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ width: "47%" }}
            onPress={() => navigation.navigate("Home")}
          >
            <ArrowBack />
          </TouchableOpacity>
          <View style={{ width: "53%" }}>
            <Image source={logo} style={styles.logo} />
          </View>
        </View>
        <View>
          <View
            style={{
              borderBottomColor: "#BBBBBB",
              borderBottomWidth: 1,
            }}
          >
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: data.photos[0].url }}
                style={styles.mainImage}
              />
              <View style={styles.priceBackground}>
                <Text style={styles.priceText}>{data.price} €</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", padding: 10 }}>
              <View style={{ width: "75%", justifyContent: "center" }}>
                <Text numberOfLines={1} style={styles.title}>
                  {data.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    {rating(data.ratingValue)}
                  </View>

                  <Text style={styles.review}>{data.reviews} reviews</Text>
                </View>
              </View>
              <Image
                source={{ uri: data.user.account.photo.url }}
                style={styles.imageUser}
              />
            </View>
            <Text
              numberOfLines={3}
              style={{ paddingHorizontal: 15, marginBottom: 15 }}
            >
              {data.description}
            </Text>
          </View>
        </View>
        <View>
          <MapView
            showsUserLocation={true}
            initialRegion={{
              latitude: 48.856614,
              longitude: 2.3522219,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            style={styles.mapview}
          >
            <MapView.Marker
              coordinate={{
                latitude: data.location[0],
                longitude: data.location[1],
              }}
            />
          </MapView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    borderBottomColor: "#BBBBBB",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
    paddingHorizontal: 15,
  },

  logo: {
    height: 35,
    width: 32,
  },
  mainImage: {
    height: 300,
    width: "100%",
  },

  priceBackground: {
    backgroundColor: "black",
    height: 40,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
  },

  priceText: {
    color: "white",
    fontSize: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "500",
  },

  imageUser: {
    height: 80,
    width: 80,
    borderRadius: 100,
    marginLeft: 10,
  },

  review: {
    color: "#BBBBBB",
    fontWeight: "500",
    fontSize: 16,
  },

  mapview: {
    height: 200,
    width: "100%",
  },
});
