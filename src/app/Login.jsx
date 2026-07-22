import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabaseClient";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setStatusMessage("Signing in...");
    let timeoutId;

    try {
      const loginRequest = supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(
          () =>
            reject(
              new Error(
                "Login timed out. Check your internet connection and try again.",
              ),
            ),
          15000,
        );
      });
      const result = await Promise.race([loginRequest, timeout]);
      const { data, error } = result;

      if (error) {
        setStatusMessage("");
        setErrorMessage(error.message);
        Alert.alert("Login Failed", error.message);
        return;
      }

      if (!data.session) {
        setStatusMessage("");
        setErrorMessage(
          "No active session was created. Verify your email, then try again.",
        );
        Alert.alert(
          "Login Failed",
          "No active session was created. Verify your email, then try again.",
        );
        return;
      }

      setStatusMessage("Login successful. Opening Main Page...");
      router.replace("/MainPage");
    } catch (error) {
      setStatusMessage("");
      const message =
        error instanceof Error
          ? error.message
          : "Unable to log in. Please try again.";
      setErrorMessage(message);
      Alert.alert("Login Failed", message);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/MovieBox 1.png")}
        style={styles.image}
      />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Pressable onPress={handleLogin} disabled={loading}>
        {({ pressed }) => (
          <View
            style={[
              styles.button,
              {
                backgroundColor: loading
                  ? "#666"
                  : pressed
                    ? "#ffffff"
                    : "#931b1b",
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: pressed ? "#931b1b" : "#ffffff",
                },
              ]}
            >
              {loading ? "Logging In..." : "Login"}
            </Text>
          </View>
        )}
      </Pressable>

      {statusMessage ? (
        <Text style={styles.statusText}>{statusMessage}</Text>
      ) : null}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <Link href="/" asChild>
        <Pressable>
          {({ pressed }) => (
            <View
              style={[
                styles.button,
                {
                  backgroundColor: pressed ? "#ffffff" : "#931b1b",
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: pressed ? "#931b1b" : "#ffffff",
                  },
                ]}
              >
                Go Back
              </Text>
            </View>
          )}
        </Pressable>
      </Link>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101215",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 35,
  },

  form: {
    marginBottom: 35,
  },

  input: {
    width: 250,
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
  },

  button: {
    width: 250,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  statusText: {
    color: "#ffffff",
    marginBottom: 15,
  },

  errorText: {
    color: "#ff8a8a",
    textAlign: "center",
    marginBottom: 15,
  },
});
