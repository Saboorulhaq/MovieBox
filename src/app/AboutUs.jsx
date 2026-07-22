import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const AboutUs = () => {
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.container}>
        <View style={styles.header}>
          <Link href="/MainPage" asChild>
            <Pressable>
              <Ionicons name="chevron-back" size={28} color="white" />
            </Pressable>
          </Link>

          <Text style={styles.heading}>About Us</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Who We Are */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Who We Are</Text>

          <Text style={styles.cardText}>
            MovieBox is your ultimate destination for discovering movies and TV
            shows. Browse trending content, search your favourite titles and
            keep track of everything you love in one place.
          </Text>
        </View>

        {/* What We Offer */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What We Offer</Text>

          <View style={styles.row}>
            <MaterialCommunityIcons
              name="movie-open"
              size={32}
              color="#ff4d4d"
            />
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Extensive Library</Text>
              <Text style={styles.itemText}>
                Explore thousands of movies and TV shows.
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="recommend" size={32} color="#ff4d4d" />
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Personalized Experience</Text>
              <Text style={styles.itemText}>
                Find content based on your interests.
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="devices" size={32} color="#ff4d4d" />
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Easy Navigation</Text>
              <Text style={styles.itemText}>
                Clean interface for a better viewing experience.
              </Text>
            </View>
          </View>
        </View>

        {/* Our Mission */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Mission</Text>

          <Text style={styles.cardText}>
            Our mission is to make discovering entertainment simple, enjoyable,
            and accessible by providing a fast and user-friendly movie browsing
            experience.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Us</Text>

          <View style={styles.contactRow}>
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color="#ff4d4d"
            />
            <Text style={styles.contactText}>support@moviebox.com</Text>
          </View>

          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="web" size={24} color="#ff4d4d" />
            <Text style={styles.contactText}>www.moviebox.com</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
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

export default AboutUs;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101215",
    justifyContent: "space-between",
  },

  container: {
    height: "13%",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  heading: {
    color: "white",
    fontSize: 30,
    marginLeft: "37%",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#181A1F",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  cardTitle: {
    color: "#FF4D4D",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  cardText: {
    color: "#D3D3D3",
    fontSize: 16,
    lineHeight: 25,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  textContainer: {
    marginLeft: 18,
    flex: 1,
  },

  itemTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  itemText: {
    color: "#B8B8B8",
    fontSize: 15,
    marginTop: 5,
    lineHeight: 22,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  contactText: {
    color: "#D3D3D3",
    fontSize: 17,
    marginLeft: 15,
  },

  NavigationIcons: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  BottNav: {
    flexDirection: "row",
    height: "7%",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#4B4B4B",
    borderTopWidth: 1,
    borderTopColor: "#5C5C5C",
  },
});
