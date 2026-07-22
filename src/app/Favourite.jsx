import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "../lib/supabaseClient";
import { getMovieDetails } from "../services/tmdb";

const Favourite = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFavourites = async () => {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMessage("Please log in to see your favourites.");
        setLoading(false);
        return;
      }

      // 1. Get this user's favourite movie ids only
      const { data: favourites, error } = await supabase
        .from("favourites")
        .select("movie_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
        setErrorMessage("Unable to load favourites. Please try again.");
        setLoading(false);
        return;
      }

      if (!favourites || favourites.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      // 2. Fetch full movie details for each favourite id from TMDB
      try {
        const results = await Promise.all(
          favourites.map((fav) => getMovieDetails(fav.movie_id)),
        );
        // Filter out any that failed to load / came back empty
        setMovies(results.filter((movie) => movie?.id));
      } catch (fetchError) {
        console.log(fetchError);
        setErrorMessage("Unable to load movie details. Please try again.");
      }

      setLoading(false);
    };

    fetchFavourites();
  }, []);

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

          <Text style={styles.heading}>My Favourites</Text>
        </View>
      </View>

      {/* Favourite List */}
      {loading ? (
        <View style={styles.centered}>
          <Text style={styles.statusText}>Loading...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.centered}>
          <Text style={styles.statusText}>{errorMessage}</Text>
        </View>
      ) : movies.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.statusText}>
            You haven't added any favourites yet.
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={movies}
          horizontal
          keyExtractor={(movie) => String(movie.id)}
          contentContainerStyle={styles.cardContainer}
          renderItem={({ item: movie }) => (
            <Link
              href={{ pathname: "/Details", params: { id: movie.id } }}
              asChild
            >
              <Pressable>
                <View style={styles.card}>
                  <Image
                    source={{
                      uri: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/300x180",
                    }}
                    style={styles.image}
                  />

                  <View style={styles.cardBody}>
                    <Text style={styles.title}>{movie.title}</Text>
                  </View>
                </View>
              </Pressable>
            </Link>
          )}
        />
      )}

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

export default Favourite;

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
    marginLeft: "31.5%",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  statusText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },

  cardContainer: {
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
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
    padding: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#b4b2b2",
    marginBottom: 8,
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
