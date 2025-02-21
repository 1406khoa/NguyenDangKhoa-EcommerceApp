// ProfileScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = TabsStackScreenProps<"Profile">;

const dummyPosts = [
  { id: "1", image: require("../../assets/product1.jpg") },
  { id: "2", image: require("../../assets/product2.jpg") },
  { id: "3", image: require("../../assets/product3.jpg") },
];

const ProfileScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header với avatar, tên và bio */}
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={require("../../assets/user.png")}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.bio}>
          Passionate developer & photographer. Love to travel and explore new
          places.
        </Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Thống kê */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>150</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>1.2K</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>300</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Lưới bài viết */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Posts</Text>
        <FlatList
          data={dummyPosts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <View style={styles.postItem}>
              <Image style={styles.postImage} source={item.image} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  bio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#009688",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  postItem: {
    flex: 1,
    margin: 5,
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
});
