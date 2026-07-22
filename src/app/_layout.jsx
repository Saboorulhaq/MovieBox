import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" options={{ headerShown: false }} />
      <Stack.Screen name="MainPage" options={{ headerShown: false }} />
      <Stack.Screen name="searchbar" options={{ headerShown: false }} />
      <Stack.Screen name="Profile" options={{ headerShown: false }} />
      <Stack.Screen name="AboutUs" options={{ headerShown: false }} />
      <Stack.Screen name="Favourite" options={{ headerShown: false }} />
      <Stack.Screen name="Details" options={{ headerShown: false }} />
    </Stack>
  );
}
