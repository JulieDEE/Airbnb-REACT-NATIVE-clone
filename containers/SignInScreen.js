import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform
} from "react-native";
import Constants from "expo-constants";
import logo from "../assets/logo.png";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";


export default function SignInScreen({ setToken }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("nono@airbnb-api.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async () => {
    try {
      if (email && password) {
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/log_in",
          {
            email,
            password,
          }
        );

        // ASYNCSTORAGE TOKEN :
        setToken(response.data.token);

      } else {
        alert("Tous les champs ne sont pas remplis");
      }
    } catch (error) {
      console.log(error.message);
      setError(true);
    }
  };

  const handleVisible = () => {
    setPasswordVisible(!passwordVisible);
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
            value={email}
            placeholderTextColor="#777777"
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
          <View>
            <TextInput
              style={styles.inputPassword}
              placeholder="password"
              placeholderTextColor="#777777"
              value={password}
              secureTextEntry={passwordVisible ? false : true}
              onChangeText={(text) => {
                setPassword(text);
              }}
            />
            <TouchableOpacity onPress={handleVisible} style={styles.eyeButton}>
              {passwordVisible ? (
                <Entypo name="eye" size={24} color="#797979" />
              ) : (
                <Entypo name="eye-with-line" size={24} color="#797979" />
              )}
            </TouchableOpacity>
          </View>

          {error && (
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <AntDesign name="exclamationcircle" size={20} color="red" />

              <Text style={{ color: "red", marginLeft: 10 }}>
                Incorrect password or email
              </Text>
            </View>
          )}

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

  inputPassword: {
    borderBottomColor: "#EB5A62",
    borderBottomWidth: 1,
    height: 60,
    fontSize: 16,
    position: "relative",
  },

  eye: {
    position: "absolute",
    top: 15,
    right: 0,
    zIndex: 1,
  },

  eyeButton: {
    position: "absolute",
    top: 15,
    right: 0,
    zIndex: 1,
    height: 40,
    width: 40,
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
