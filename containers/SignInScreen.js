import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Constants from "expo-constants";
import logo from "../assets/logo.png";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


export default function SignInScreen({ setToken }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const response = await axios.post(
      "https://express-airbnb-api.herokuapp.com/user/log_in",
      {
        email,
        password,
      }
    );
    const userToken = "secret-token";
    setToken(userToken);
    alert("connexion reussi")
  };

  return (
    <KeyboardAwareScrollView>
      <View
        style={{ marginTop: Constants.statusBarHeight, paddingHorizontal: 40 }}
      >
        <View style={styles.mainContent}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.mainTitle}> Sign in</Text>
        </View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="email"
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="password"
            secureTextEntry={true}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.signInButton}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text style={styles.textUnderButton}>No account ? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    height: 350,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    height: 120,
    width: 110,
    marginBottom: 20,
  },

  mainTitle: {
    fontSize: 25,
    color: "#747474",
    fontWeight: "700",
  },

  input: {
    borderBottomColor: "#EB5A62",
    borderBottomWidth: 1,
    height: 60,
    fontSize: 16,
  },

  signInButton: {
    marginTop: 100,
    alignSelf: "center",
    borderColor: "#EB5A62",
    borderWidth: 3,
    height: 60,
    width: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: "#747474",
    fontWeight: "600",
  },

  textUnderButton: {
    alignSelf: "center",
    textAlign: "center",
    marginTop: 20,
    color: "#888888",
    fontSize: 15,
    fontWeight: "500",
  },
});
