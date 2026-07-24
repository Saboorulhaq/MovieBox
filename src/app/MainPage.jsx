import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
} from "../services/tmdb";

const MainPage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trending, popular, topRated] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
        ]);

        setTrendingMovies(trending);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
      } catch (error) {
        setErrorMessage("Unable to load movies. Please try again.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.innercontainer}>
          <Text style={styles.text}>M</Text>
          <Text style={styles.text2}>B</Text>
        </View>
        <View style={styles.innerSecconaitner}>
          <Link href={"/searchbar"} asChild>
            <Pressable style={styles.inputContainer}>
              <EvilIcons name="search" size={24} color="black" />
              <Text style={styles.searchPlaceholder} numberOfLines={1}>
                Search Movies...
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
      {loading ? (
        <View
          style={[
            styles.screen,
            {
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Loading...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              padding: 10,
              color: "#FF4D4D",
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Trending Movies
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingMovies.map((movie) => (
              <Link
                href={{
                  pathname: "/Details",
                  params: { id: movie.id },
                }}
                key={movie.id}
                asChild
              >
                <Pressable>
                  <View style={styles.card}>
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                      }}
                      style={styles.image}
                    />

                    <View style={styles.cardBody}>
                      <Text style={styles.title}>{movie.title}</Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </ScrollView>

          <Text
            style={{
              padding: 10,
              color: "#FF4D4D",
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Popular Movies
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularMovies.map((movie) => (
              <Link
                key={movie.id}
                href={{
                  params: { id: movie.id },
                  pathname: "/Details",
                }}
                asChild
              >
                <Pressable>
                  <View style={styles.card}>
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                      }}
                      style={styles.image}
                    />

                    <View style={styles.cardBody}>
                      <Text style={styles.title}>{movie.title}</Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </ScrollView>

          <Text
            style={{
              padding: 10,
              color: "#FF4D4D",
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Top Rated
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topRatedMovies.map((movie) => (
              <Link
                key={movie.id}
                href={{
                  pathname: "/Details",
                  params: { id: movie.id },
                }}
                asChild
              >
                <Pressable>
                  <View style={styles.card}>
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                      }}
                      style={styles.image}
                    />

                    <View style={styles.cardBody}>
                      <Text style={styles.title}>{movie.title}</Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </ScrollView>
      )}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

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

export default MainPage;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101215",
  },

  container: {
    flexDirection: "row",
    paddingTop: 1,
    paddingHorizontal: 16,
    width: "100%",
    height: "13%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#101215",
  },

  innercontainer: {
    flexDirection: "row",
    backgroundColor: "#101215",
    padding: 2,
  },

  box: {
    height: "87%",
    backgroundColor: "#101215",
  },

  innerSecconaitner: {
    flex: 1,
    marginLeft: 12,
    height: "40%",
  },

  inputContainer: {
    height: 50,
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  searchPlaceholder: {
    color: "gray",
    fontSize: 16,
    marginLeft: 10,
    flexShrink: 1,
  },

  text: {
    fontFamily: "monospace",
    fontSize: 50,
    color: "#f11616",
    fontWeight: "600",
  },

  text2: {
    fontFamily: "monospace",
    fontSize: 50,
    color: "#f4e324",
    fontWeight: "600",
  },

  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#000000",
    outlineStyle: "none",
  },
  card: {
    width: 300,

    borderRadius: 10,
    overflow: "hidden",
    elevation: 5, // Android shadow
    shadowColor: "#646060", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    margin: 20,
  },

  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },

  cardBody: {
    padding: 10,
    height: 70,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#b4b2b2",
    marginBottom: 8,
  },
  errorText: {
    color: "#ff8a8a",
    textAlign: "center",
    padding: 10,
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
