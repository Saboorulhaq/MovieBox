import { Link, router } from "expo-router";
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

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters long.",
      );
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      Alert.alert("Sign Up Failed", error.message);
      return;
    }

    if (data.user) {
      Alert.alert(
        "Account Created",
        "Please check your email and verify your account before logging in.",
        [
          {
            text: "Go",
            onPress: () => router.replace("/"),
          },
        ],
      );
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
          placeholder="First Name"
          placeholderTextColor="#666"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#666"
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Pressable onPress={handleSignUp} disabled={loading}>
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
              {loading ? "Signing Up..." : "Sign Up"}
            </Text>
          </View>
        )}
      </Pressable>

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

export default SignUp;

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
    marginBottom: 30,
  },

  form: {
    marginBottom: 40,
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
});
