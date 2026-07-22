import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/MovieBox 1.png")}
        style={styles.image}
      />

      <View>
        <Link href="/Login" asChild>
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
                  LOGIN
                </Text>
              </View>
            )}
          </Pressable>
        </Link>

        <Link href="/SignUp" asChild>
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
                  SIGN UP
                </Text>
              </View>
            )}
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101215",
    alignItems: "center",
  },
  image: {
    width: 500,
    height: 500,
  },
  button: {
    width: 220,
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
