import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { searchMovies } from "../services/tmdb";

const Searchbar = () => {
  const [searchText, setSearchText] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Don't search on an empty box
    if (!searchText.trim()) {
      setMovies([]);
      setErrorMessage("");
      return;
    }

    // Debounce so we don't fire a request on every keystroke
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const results = await searchMovies(searchText);
        setMovies(results?.filter((movie) => movie?.id) ?? []);
      } catch (fetchError) {
        console.log(fetchError);
        setErrorMessage("Unable to load movie results. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.innercontainer}>
          <Link href="/MainPage">
            <Pressable>
              <Ionicons name="chevron-back" size={24} color="white" />
            </Pressable>
          </Link>
        </View>

        <View style={styles.inputContainer}>
          <EvilIcons name="search" size={24} color="black" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
            placeholder="Search Movies ..."
            placeholderTextColor="gray"
          />
        </View>
      </View>

      {loading && (
        <Text style={{ color: "white", padding: 10 }}>Loading...</Text>
      )}
      {errorMessage ? (
        <Text style={{ color: "tomato", padding: 10 }}>{errorMessage}</Text>
      ) : null}

      <FlatList
        showsVerticalScrollIndicator={false}
        horizontal
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Link
            href={{ pathname: "/Details", params: { id: item.id } }}
            asChild
          >
            <Pressable>
              <View style={styles.card}>
                <Image
                  source={{
                    uri: item.poster_path
                      ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                      : "https://via.placeholder.com/300x180",
                  }}
                  style={styles.image}
                />
                <View style={styles.cardBody}>
                  <Text style={styles.title}>{item.title}</Text>
                </View>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
};

export default Searchbar;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101215",
  },
  container: {
    flexDirection: "row",
    paddingTop: 1,
    height: "13%",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#101215",
  },
  innercontainer: {
    flexDirection: "row",
    backgroundColor: "#101215",
    width: "1%",
  },
  inputContainer: {
    width: 550,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#302929",
    outlineStyle: "none",
  },
  card: {
    width: 300,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#646060",
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
});
