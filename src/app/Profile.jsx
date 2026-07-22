import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "../lib/supabaseClient";

const Profile = () => {
  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email);

    setName(
      user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User",
    );
  };

  const performLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    router.replace("/");
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (!confirmed) return;
      performLogout();
    } else {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: performLogout,
        },
      ]);
    }
  };

  return (
    <View style={styles.screen}>
      <View>
        <View style={styles.container}>
          <Link href="/MainPage" asChild>
            <Pressable>
              <Ionicons name="chevron-back" size={28} color="white" />
            </Pressable>
          </Link>
        </View>

        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://placehold.co/100",
            }}
            style={styles.profileImage}
          />

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Pressable style={styles.menuItem}>
            <View style={styles.leftSection}>
              <Feather name="heart" size={22} color="white" />
              <Text style={styles.menuText}>My List</Text>
            </View>

            <Link href="/Favourite" asChild>
              <Pressable>
                <Ionicons name="chevron-forward" size={22} color="#8B8B8B" />
              </Pressable>
            </Link>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.leftSection}>
              <MaterialIcons name="info-outline" size={22} color="white" />
              <Text style={styles.menuText}>About Us</Text>
            </View>

            <Link href="/AboutUs" asChild>
              <Pressable>
                <Ionicons name="chevron-forward" size={22} color="#8B8B8B" />
              </Pressable>
            </Link>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.leftSection}>
              <MaterialIcons name="logout" size={22} color="#E74C3C" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#8B8B8B" />
          </Pressable>
        </View>
      </View>

      <View style={styles.BottNav}>
        <View style={styles.NavigationIcons}>
          <Link href="/MainPage" asChild>
            <Pressable>
              <Feather name="home" size={24} color="black" />
            </Pressable>
          </Link>
        </View>

        <View style={styles.NavigationIcons}>
          <Link href="/searchbar" asChild>
            <Pressable>
              <Feather name="search" size={24} color="black" />
            </Pressable>
          </Link>
        </View>

        <View style={styles.NavigationIcons}>
          <Link href="/Favourite" asChild>
            <Pressable>
              <Feather name="heart" size={24} color="black" />
            </Pressable>
          </Link>
        </View>

        <View style={styles.NavigationIcons}>
          <Link href="/Profile" asChild>
            <Pressable>
              <Ionicons name="person-outline" size={24} color="black" />
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101215",
    justifyContent: "space-between",
  },

  container: {
    height: "21%",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#181A1F",
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 16,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#D84C4C",
  },

  infoContainer: {
    marginLeft: 18,
  },

  name: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  email: {
    color: "#9A9A9A",
    fontSize: 16,
    marginTop: 5,
  },

  menuContainer: {
    marginTop: 35,
    marginHorizontal: 20,
  },

  menuItem: {
    backgroundColor: "#181A1F",
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    color: "white",
    fontSize: 18,
    marginLeft: 15,
    fontWeight: "500",
  },

  logoutText: {
    color: "#E74C3C",
    fontSize: 18,
    marginLeft: 15,
    fontWeight: "500",
  },

  NavigationIcons: {
    width: 50,
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  BottNav: {
    flexDirection: "row",
    paddingTop: 1,
    height: "7%",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#4B4B4B",
    borderTopWidth: 1,
    borderTopColor: "#5C5C5C",
  },
});
