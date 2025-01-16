import { Stack } from "expo-router";

export default function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false, // Removes the header for all screens
			}}
		/>
	);
}
