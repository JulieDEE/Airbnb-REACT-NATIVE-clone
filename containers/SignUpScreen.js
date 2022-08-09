import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import Constants from "expo-constants";
import logo from "../assets/logo.png";
import { useState } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen({ setToken }) {
  const navigation = useNavigation();

  // STATES :

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");

  // ON SUBMIT :

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://express-airbnb-api.herokuapp.com/user/sign_up",
        {
          email,
          username,
          description,
          password,
        }
      );

      const userToken = "secret-token";
      setToken(userToken);
      alert("Creation de compte reussie");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View
        style={{ marginTop: Constants.statusBarHeight, paddingHorizontal: 40 }}
      >
        <View style={styles.mainContent}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.mainTitle}> Sign up</Text>
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
            placeholder="username"
            onChangeText={(text) => {
              setUsername(text);
            }}
          />
          <TextInput
            multiline
            numberOfLines={5}
            placeholder="Describe yourself in a few words..."
            style={styles.textarea}
            onChangeText={(text) => {
              setDescription(text);
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
          <TextInput
            style={styles.input}
            placeholder="confirm password"
            secureTextEntry={true}
            onChangeText={(text) => {
              setConfirmPassword(text);
            }}
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.signUpButton}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <Text style={styles.textUnderButton}>
              Aldready have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    height: 190,
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

  textarea: {
    borderColor: "#EB5A62",
    borderWidth: 1,
    height: 100,
    marginTop: 35,
    padding: 10,
  },

  signUpButton: {
    marginTop: 50,
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
