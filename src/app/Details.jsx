import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabaseClient";
import { getMovieDetails, getMovieTrailer } from "../services/tmdb";

const Details = () => {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const [isFavourite, setIsFavourite] = useState(false);
  const [favouriteLoading, setFavouriteLoading] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setErrorMessage(
          "This movie could not be opened because its ID is missing.",
        );
        return;
      }

      try {
        const data = await getMovieDetails(id);
        const trailerData = await getMovieTrailer(id);

        if (!data.id) {
          setErrorMessage("Movie details could not be found.");
          return;
        }
        setMovie(data);
        setTrailer(trailerData);
      } catch (error) {
        setErrorMessage("Movie details could not be loaded. Please try again.");
        console.log(error);
      }
    };

    fetchMovie();
  }, [id]);

  // Check whether this movie is already in the logged-in user's favourites
  useEffect(() => {
    const checkFavourite = async () => {
      if (!movie?.id) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("favourites")
        .select("id")
        .eq("user_id", user.id)
        .eq("movie_id", movie.id)
        .maybeSingle();

      if (error) {
        console.log(error);
        return;
      }

      setIsFavourite(!!data);
    };

    checkFavourite();
  }, [movie?.id]);

  // Load comments for this specific movie only
  useEffect(() => {
    const fetchComments = async () => {
      if (!movie?.id) return;

      const { data, error } = await supabase
        .from("comments")
        .select("id, author_name, comment_text, created_at")
        .eq("movie_id", movie.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
        return;
      }

      setComments(data || []);
    };

    fetchComments();
  }, [movie?.id]);

  const addToFavourite = async () => {
    if (!movie?.id || favouriteLoading) return;

    setFavouriteLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setFavouriteLoading(false);
      alert("Please log in to save favourites.");
      return;
    }

    if (isFavourite) {
      // Already favourited -> remove it
      const { error } = await supabase
        .from("favourites")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movie.id);

      setFavouriteLoading(false);

      if (error) {
        console.log(error);
        return;
      }

      setIsFavourite(false);
      return;
    }

    // Not favourited yet -> add it
    const { error } = await supabase.from("favourites").insert({
      movie_id: movie.id,
      user_id: user.id,
    });

    setFavouriteLoading(false);

    if (error) {
      console.log(error);
      return;
    }

    setIsFavourite(true);
    alert("Added to Favourites");
  };

  const addComment = async () => {
    const trimmedText = commentText.trim();
    if (!trimmedText || !movie?.id || postingComment) return;

    setPostingComment(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPostingComment(false);
      alert("Please log in to comment.");
      return;
    }

    // Look up a display name from profiles, falling back to username
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, username")
      .eq("id", user.id)
      .maybeSingle();

    const authorName = profile?.full_name || profile?.username || "You";

    const { data: inserted, error } = await supabase
      .from("comments")
      .insert({
        movie_id: movie.id,
        user_id: user.id,
        author_name: authorName,
        comment_text: trimmedText,
      })
      .select("id, author_name, comment_text, created_at")
      .single();

    setPostingComment(false);

    if (error) {
      console.log(error);
      return;
    }

    setComments([inserted, ...comments]);
    setCommentText("");
  };

  if (!movie) {
    return (
      <View
        style={[
          styles.screen,
          {
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          {errorMessage || "Loading..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Link href="/MainPage" asChild>
            <Pressable>
              <Ionicons name="chevron-back" size={28} color="white" />
            </Pressable>
          </Link>
          <Pressable onPress={addToFavourite} disabled={favouriteLoading}>
            <Ionicons
              name={isFavourite ? "heart" : "heart-outline"}
              size={26}
              color={isFavourite ? "#ff0000" : "#FFFFFF"}
            />
          </Pressable>
        </View>

        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }}
          style={styles.poster}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{movie.title}</Text>

          <Text style={styles.meta}>
            {movie.release_date?.substring(0, 4)} • {movie.runtime} min
          </Text>

          <Text style={styles.rating}>
            ★ {movie.vote_average?.toFixed(1)}/10 • {movie.vote_count} votes
          </Text>

          <View style={styles.genreRow}>
            {movie.genres?.map((genre) => (
              <Text key={genre.id} style={styles.genreTag}>
                {genre.name}
              </Text>
            ))}
          </View>

          <Text
            style={{
              color: "#D3D3D3",
              fontSize: 15,
              lineHeight: 24,
              marginBottom: 25,
            }}
          >
            {movie.overview}
          </Text>
          {/* Trailer */}

          <Text style={styles.sectionTitle}>Trailer</Text>

          {trailer ? (
            <Pressable
              style={styles.trailerCard}
              onPress={() =>
                Linking.openURL(
                  `https://www.youtube.com/watch?v=${trailer.key}`,
                )
              }
            >
              <Image
                source={{
                  uri: `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`,
                }}
                style={styles.trailerImage}
              />

              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>

              <Text style={styles.trailerTitle}>{trailer.name}</Text>
            </Pressable>
          ) : (
            <Text style={{ color: "#888", marginBottom: 20 }}>
              No trailer available.
            </Text>
          )}

          <Text style={styles.sectionTitle}>Comments</Text>

          <View style={styles.addCommentRow}>
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
              placeholderTextColor="#8A8D91"
              value={commentText}
              onChangeText={setCommentText}
            />

            <Pressable
              style={styles.postButton}
              onPress={addComment}
              disabled={postingComment}
            >
              <Text style={styles.postButtonText}>
                {postingComment ? "Posting..." : "Post"}
              </Text>
            </Pressable>
          </View>

          {comments.length === 0 ? (
            <Text style={styles.commentText}>
              No comments yet. Be the first to comment.
            </Text>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <Text style={styles.commentName}>{comment.author_name}</Text>

                <Text style={styles.commentText}>{comment.comment_text}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {/* Bottom Navigation */}
      <View style={styles.BottNav}>
        <View style={styles.NavigationIcons}>
          <Link href="/MainPage" asChild>
            <Pressable>
              <Feather name="home" size={24} color="white" />
            </Pressable>
          </Link>
        </View>

        <View style={styles.NavigationIcons}>
          <Link href="/searchbar" asChild>
            <Pressable>
              <Feather name="search" size={24} color="white" />
            </Pressable>
          </Link>
        </View>

        <View style={styles.NavigationIcons}>
          <Link href="/Favourite" asChild>
            <Pressable>
              <Feather name="heart" size={24} color="white" />
            </Pressable>
          </Link>
        </View>

        <View style={styles.NavigationIcons}>
          <Link href="/Profile" asChild>
            <Pressable>
              <Ionicons name="person-outline" size={24} color="white" />
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101215",
    justifyContent: "space-between",
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },

  poster: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
  },

  infoContainer: {
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },

  meta: {
    color: "#B7B9BC",
    fontSize: 15,
    marginBottom: 6,
  },

  rating: {
    color: "#F5C518",
    fontSize: 15,
    marginBottom: 15,
    fontWeight: "600",
  },

  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  genreTag: {
    color: "white",
    backgroundColor: "#22252A",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
    fontSize: 13,
  },

  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },

  addCommentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: "#1A1D21",
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
  },

  postButton: {
    backgroundColor: "#E23744",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  postButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  comment: {
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2B2B2B",
  },

  commentName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 3,
  },

  commentText: {
    color: "#C7C9CC",
    fontSize: 14,
    lineHeight: 20,
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
  trailerCard: {
    marginBottom: 25,
    backgroundColor: "#181A1F",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2B2B2B",
  },

  trailerImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },

  playButton: {
    position: "absolute",
    top: "42%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },

  playIcon: {
    color: "white",
    fontSize: 28,
    marginLeft: 4,
  },

  trailerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    padding: 15,
  },
});
