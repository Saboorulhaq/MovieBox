const BASE_URL = "https://api.themoviedb.org/3";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN}`,
  },
};

export const getTrendingMovies = async () => {
  const response = await fetch(`${BASE_URL}/trending/movie/day`, options);

  const data = await response.json();
  return data.results;
};

export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/popular`, options);

  const data = await response.json();
  return data.results;
};

export const getTopRatedMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/top_rated`, options);

  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/movie/${id}`, options);

  const data = await response.json();

  return data;
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(
      query,
    )}&include_adult=false&language=en-US&page=1`,
    options,
  );

  if (!response.ok) {
    throw new Error("Failed to search movies");
  }

  const data = await response.json();

  return data.results;
};

export const getMovieTrailer = async (id) => {
  const response = await fetch(`${BASE_URL}/movie/${id}/videos`, options);

  if (!response.ok) {
    throw new Error("Failed to load trailer");
  }

  const data = await response.json();

  // Find the official YouTube trailer
  const trailer = data.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );

  return trailer;
};
