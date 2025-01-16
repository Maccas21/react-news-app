import React, { useState } from "react";
import {
	View,
	TextInput,
	FlatList,
	Text,
	StyleSheet,
	ActivityIndicator,
	Image,
	TouchableOpacity,
	Linking,
	Keyboard,
	Modal,
	Pressable,
} from "react-native";

export default function Index() {
	const [searchQuery, setSearchQuery] = useState("");
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false); // Show the advanced search modal
	const [advancedSearch, setAdvancedSearch] = useState({
		title: "",
		description: "",
		content: "",
		from: "",
		to: "",
		language: "en",
		sortBy: "relevancy", // Default sortBy
	});

	const apiKey = "e73af2c3739d4ebf86bc46a6fe7c4363"; // Replace with your actual API key

	// Fetch data from NewsAPI
	const fetchNews = async (query, advancedFilters = {}) => {
		setLoading(true); // Show loading indicator
		try {
			const response = await fetch(
				`https://newsapi.org/v2/everything?q=${encodeURIComponent(
					query
				)}&title=${encodeURIComponent(
					advancedFilters.title
				)}&description=${encodeURIComponent(
					advancedFilters.description
				)}&content=${encodeURIComponent(
					advancedFilters.content
				)}&from=${encodeURIComponent(
					advancedFilters.from
				)}&to=${encodeURIComponent(advancedFilters.to)}&language=${
					advancedFilters.language
				}&sortBy=${advancedFilters.sortBy}&apiKey=${apiKey}`
			);
			const data = await response.json();

			if (data.status === "ok") {
				// Filter articles where source.id is not null
				const filteredArticles = data.articles.filter(
					(article) => article.source.id !== null
				);
				setArticles(filteredArticles);
			} else {
				console.error("Failed to fetch news:", data);
			}
		} catch (error) {
			console.error("Error fetching news:", error);
		} finally {
			setLoading(false); // Hide loading indicator
		}
	};

	const handlePress = (url) => {
		// Opens the article URL in the default browser
		Linking.openURL(url);
	};

	// Format date to a readable format
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString(); // Example format: 1/16/2025
	};

	// Change sorting method
	const handleSortChange = (sortBy) => {
		setAdvancedSearch({ ...advancedSearch, sortBy });
	};

	return (
		<View style={styles.container}>
			{/* Search Bar and Button Container */}
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchBar}
					placeholder="Search for news..."
					value={searchQuery}
					onChangeText={(text) => setSearchQuery(text)}
				/>
				<TouchableOpacity
					style={styles.searchButton}
					onPress={() => {
						Keyboard.dismiss(); // Close the keyboard
						setArticles([]); // Clear previous results before new search
						fetchNews(searchQuery, advancedSearch); // Fetch the results based on the filters
					}}
				>
					<Text style={styles.buttonText}>Search</Text>
				</TouchableOpacity>
			</View>

			{/* Advanced Search Button - moved to its own row */}
			<View style={styles.advancedSearchRow}>
				<TouchableOpacity
					style={styles.advancedSearchButton}
					onPress={() => setShowModal(true)}
				>
					<Text style={styles.buttonText}>Advanced Search</Text>
				</TouchableOpacity>
			</View>

			{/* Loading Indicator */}
			{loading && <ActivityIndicator size="large" color="#0000ff" />}

			{/* Display News Articles */}
			<FlatList
				data={articles}
				keyExtractor={(item, index) => index.toString()} // Unique key for each article
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.article}
						onPress={() => handlePress(item.url)} // Open the article URL on press
					>
						<View style={styles.articleContent}>
							{/* Image */}
							<Image
								source={{ uri: item.urlToImage }}
								style={styles.image}
								resizeMode="cover"
							/>
							{/* Text */}
							<View style={styles.textContent}>
								<Text style={styles.title}>{item.title}</Text>
								<Text style={styles.description}>{item.description}</Text>
								{/* Display Published Date */}
								<Text style={styles.date}>{formatDate(item.publishedAt)}</Text>
							</View>
						</View>
					</TouchableOpacity>
				)}
			/>

			{/* Advanced Search Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={showModal}
				onRequestClose={() => setShowModal(false)}
			>
				<View style={styles.modalView}>
					<Text style={styles.modalText}>Advanced Search Filters</Text>

					<TextInput
						placeholder="Title"
						style={styles.inputField}
						value={advancedSearch.title}
						onChangeText={(text) =>
							setAdvancedSearch({ ...advancedSearch, title: text })
						}
					/>
					<TextInput
						placeholder="Description"
						style={styles.inputField}
						value={advancedSearch.description}
						onChangeText={(text) =>
							setAdvancedSearch({ ...advancedSearch, description: text })
						}
					/>
					<TextInput
						placeholder="Content"
						style={styles.inputField}
						value={advancedSearch.content}
						onChangeText={(text) =>
							setAdvancedSearch({ ...advancedSearch, content: text })
						}
					/>
					<TextInput
						placeholder="From Date (YYYY-MM-DD)"
						style={styles.inputField}
						value={advancedSearch.from}
						onChangeText={(text) =>
							setAdvancedSearch({ ...advancedSearch, from: text })
						}
					/>
					<TextInput
						placeholder="To Date (YYYY-MM-DD)"
						style={styles.inputField}
						value={advancedSearch.to}
						onChangeText={(text) =>
							setAdvancedSearch({ ...advancedSearch, to: text })
						}
					/>

					{/* Sort By Options with TouchableOpacity instead of Picker */}
					<View style={styles.sortByContainer}>
						<TouchableOpacity
							style={[
								styles.sortByButton,
								advancedSearch.sortBy === "relevancy" && styles.selectedButton,
							]}
							onPress={() => handleSortChange("relevancy")}
						>
							<Text style={styles.buttonText}>Relevancy</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.sortByButton,
								advancedSearch.sortBy === "popularity" && styles.selectedButton,
							]}
							onPress={() => handleSortChange("popularity")}
						>
							<Text style={styles.buttonText}>Popularity</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.sortByButton,
								advancedSearch.sortBy === "publishedAt" &&
									styles.selectedButton,
							]}
							onPress={() => handleSortChange("publishedAt")}
						>
							<Text style={styles.buttonText}>Published At</Text>
						</TouchableOpacity>
					</View>

					{/* Close and Apply Filters Buttons */}
					<View style={styles.modalButtons}>
						<Pressable
							style={styles.modalButton}
							onPress={() => {
								fetchNews(searchQuery, advancedSearch); // Apply the advanced search filters
								setShowModal(false); // Close the modal
							}}
						>
							<Text style={styles.buttonText}>Apply Filters</Text>
						</Pressable>
						<Pressable
							style={[styles.modalButton, { marginTop: 10 }]} // Adjust gap here
							onPress={() => setShowModal(false)} // Close the modal
						>
							<Text style={styles.buttonText}>Cancel</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: "#f5f5f5",
	},
	searchContainer: {
		flexDirection: "row", // Align TextInput and Button in a row
		alignItems: "center", // Vertically center elements
		marginBottom: 20,
	},
	searchBar: {
		height: 50,
		flex: 1, // Take up available space
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		paddingHorizontal: 10,
		backgroundColor: "#fff",
	},
	searchButton: {
		height: 50,
		paddingHorizontal: 15,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 10,
		backgroundColor: "#4CAF50", // Button color
		borderRadius: 8,
	},
	advancedSearchRow: {
		flexDirection: "row",
		justifyContent: "center", // Center the button in the row
		marginBottom: 20,
	},
	advancedSearchButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: "#4CAF50", // Advanced Search button color
		borderRadius: 8,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	sortByContainer: {
		flexDirection: "row",
		justifyContent: "space-around", // Evenly space buttons
		width: "100%",
		marginBottom: 15,
	},
	sortByButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: "#eee",
		borderRadius: 8,
		marginBottom: 10,
	},
	selectedButton: {
		backgroundColor: "#4CAF50", // Highlighted button color
	},
	modalView: {
		marginTop: 100,
		margin: 20,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
	},
	modalText: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
	},
	inputField: {
		height: 40,
		width: "100%",
		borderWidth: 1,
		borderColor: "#ccc",
		marginBottom: 10,
		borderRadius: 8,
		paddingLeft: 10,
	},
	modalButtons: {
		flexDirection: "column", // Stack buttons vertically
		justifyContent: "center",
		marginTop: 15,
		width: "100%",
	},
	modalButton: {
		backgroundColor: "#4CAF50",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		marginBottom: 10, // Gap between buttons
	},
	article: {
		marginBottom: 20,
		backgroundColor: "#fff",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
	},
	articleContent: {
		flexDirection: "row", // Align image and text side by side
		padding: 10,
	},
	image: {
		width: 60, // Small square image
		height: 60,
		borderRadius: 8,
		marginRight: 10, // Space between image and text
	},
	textContent: {
		flex: 1, // Take remaining space next to image
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 5,
	},
	description: {
		fontSize: 14,
		color: "#555",
	},
	date: {
		fontSize: 12,
		color: "#777",
		marginTop: 5,
	},
});
