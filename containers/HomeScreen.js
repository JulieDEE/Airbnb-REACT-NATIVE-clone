import { useNavigation } from "@react-navigation/core";
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

export default function HomeScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const userToken = await AsyncStorage.getItem("userToken");

    if (userToken) {
      const response = await axios.get(
        "https://express-airbnb-api.herokuapp.com/rooms"
      );
      setData(response.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        {/* <ScrollView> */}
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 10,
            }}
          >
            <FlatList
              data={data}
              keyExtractor={(elem, index) => {
                return index.toString();
              }}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Room", { announceId: item._id })
                    }
                  >
                    <View
                      style={{
                        borderBottomColor: "#BBBBBB",
                        borderBottomWidth: 1,
                        marginBottom: 15,
                      }}
                    >
                      <View style={{ position: "relative" }}>
                        <Image
                          source={{ uri: item.photos[0].url }}
                          style={styles.mainImage}
                        />
                        <View style={styles.priceBackground}>
                          <Text style={styles.priceText}>{item.price} €</Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: "row", padding: 10 }}>
                        <View
                          style={{ width: "75%", justifyContent: "center" }}
                        >
                          <Text numberOfLines={1} style={styles.title}>
                            {item.title}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: 10,
                            }}
                          >
                            <View style={{ flexDirection: "row" }}>
                              {rating(item.ratingValue)}
                            </View>

                            <Text style={styles.review}>
                              {item.reviews} reviews
                            </Text>
                          </View>
                        </View>
                        <Image
                          source={{ uri: item.user.account.photo.url }}
                          style={styles.imageUser}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        {/* </ScrollView> */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    borderBottomColor: "#BBBBBB",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
  },

  logo: {
    height: 35,
    width: 32,
  },

  mainImage: {
    height: 180,
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
});
