import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

type Props = TabsStackScreenProps<"Profile">;

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

type MyImagePickerResult =
  | {
      canceled: true;
    }
  | {
      canceled: false;
      assets: {
        uri: string;
        width?: number;
        height?: number;
      }[];
    };

const ProfileScreen = ({ navigation }: Props) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [avatar, setAvatar] = useState(""); // Ảnh hiện đang lưu trên server
  const [localImageUri, setLocalImageUri] = useState<string | null>(null); // Ảnh user mới chọn

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [userInfo, setUserInfo] = useState<{ username: string; email: string } | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  // Hàm mở Image Picker (đã loại bỏ gọi handleSaveProfile sau khi chọn ảnh)
  const pickImage = async () => {
    try {
      console.log("🎯 Hàm pickImage đã được gọi!");
      // Yêu cầu quyền truy cập thư viện
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
        return;
      }

      // Mở thư viện
      const rawResult = (await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })) as unknown as MyImagePickerResult;

      console.log("👉 rawResult:", rawResult);
      if (!rawResult.canceled && rawResult.assets && rawResult.assets.length > 0) {
        // Lưu URI ảnh đã chọn vào state localImageUri
        setLocalImageUri(rawResult.assets[0].uri);
      }
    } catch (error) {
      console.error("🚨 Lỗi trong pickImage:", error);
      alert("Lỗi khi mở thư viện ảnh! Xem console để biết chi tiết.");
    }
  };

  // Upload ảnh avatar mới lên server, trả về đường dẫn trên server
  const uploadAvatar = async (localUri: string) => {
    const filename = localUri.split("/").pop() || "avatar.jpg";
    const formData = new FormData();
    formData.append("image", {
      uri: localUri,
      name: filename,
      type: "image/jpeg",
    } as any);

    const response = await axios.post("http://10.0.2.2:5000/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.imageUrl; // Ví dụ: "/images/xxxx.jpg"
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");
      if (!token || !userStr) {
        Alert.alert("Vui lòng đăng nhập");
        navigation.navigate("Login");
        return;
      }
      const user = JSON.parse(userStr);
      setUserInfo(user);
      setUserId(user._id);
      await fetchProfile(token);
    } catch (error) {
      console.error("Lỗi khi lấy user từ AsyncStorage:", error);
      navigation.navigate("Login");
    }
  };

  // Lấy hồ sơ user từ API
  const fetchProfile = async (token: string) => {
    try {
      const response = await axios.get("http://10.0.2.2:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setPhone(response.data.phone || "");
      setAddressQuery(response.data.address || "");
      setAvatar(response.data.avatar || "");
      if (response.data.location) {
        setLocation(response.data.location);
      }
      setLoading(false);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setProfile(null);
        setLoading(false);
      } else {
        console.error("Lỗi khi lấy hồ sơ:", error);
        Alert.alert("Lỗi", error.response?.data?.message || "Lỗi khi lấy hồ sơ");
        setLoading(false);
      }
    }
  };

  // Khi component mount, gọi fetchUserData
  useEffect(() => {
    fetchUserData();
  }, []);

  // Debounce gợi ý địa chỉ từ Nominatim (OSM)
  useEffect(() => {
    if (addressQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addressQuery
        )}`;
        const res = await axios.get(url, {
          headers: { "User-Agent": "EcommerceApp/1.0 (contact@yourdomain.com)" },
        });
        setSuggestions(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy gợi ý địa chỉ:", error);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [addressQuery]);

  const handleSelectSuggestion = (s: Suggestion) => {
    setAddressQuery(s.display_name);
    setSuggestions([]);
    setLocation({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
  };

  const handleUploadAvatar = async () => {
    try {
      let finalAvatarUrl = avatar;
      if (localImageUri) {
        finalAvatarUrl = await uploadAvatar(localImageUri);
      }
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        "http://10.0.2.2:5000/api/profile",
        {
          avatar: finalAvatarUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cập nhật lại avatar (để hiển thị)
      setAvatar(finalAvatarUrl);
      alert("Cập nhật Avatar thành công!");
      fetchUserData();
    } catch (error) {
      console.error("Lỗi khi lưu avatar:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  // Khi ấn "Lưu" trong Modal
  const handleSaveProfile = async () => {
    try {
      // Nếu user đã chọn ảnh mới => upload lên server
      let finalAvatarUrl = avatar;
      if (localImageUri) {
        finalAvatarUrl = await uploadAvatar(localImageUri);
      }

      const token = await AsyncStorage.getItem("token");
      await axios.put(
        "http://10.0.2.2:5000/api/profile",
        {
          phone,
          address: addressQuery,
          avatar: finalAvatarUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cập nhật lại avatar (để hiển thị)
      setAvatar(finalAvatarUrl);
      // Sau khi lưu thành công, đóng Modal
      setEditModalVisible(false);
      alert("Cập nhật hồ sơ thành công!");
      fetchUserData();
    } catch (error) {
      console.error("Lỗi khi lưu hồ sơ:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  // Đăng xuất
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    navigation.navigate("Login");
  };

  // Nếu đang loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải hồ sơ...</Text>
      </View>
    );
  }

  // Nếu chưa có hồ sơ
  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có hồ sơ của bạn</Text>
          <TouchableOpacity
            style={styles.createProfileButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.createProfileButtonText}>Tạo hồ sơ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        {/* Modal tạo hồ sơ (đã thêm chức năng chọn ảnh) */}
        <Modal
          visible={editModalVisible}
          animationType="slide"
          presentationStyle="overFullScreen"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Tạo hồ sơ</Text>
              {/* Phần chọn ảnh trong modal */}
              <View style={styles.modalAvatarContainer}>
                <Image
                  style={styles.modalAvatar}
                  source={
                    localImageUri
                      ? { uri: localImageUri }
                      : avatar
                      ? { uri: `http://10.0.2.2:5000${avatar}` }
                      : require("../../assets/user.png")
                  }
                />
                <TouchableOpacity onPress={pickImage}>
                  <Text style={styles.selectImageText}>Chọn ảnh</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                value={addressQuery}
                onChangeText={setAddressQuery}
              />
              {suggestions.length > 0 && (
                <FlatList
                  data={suggestions}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => handleSelectSuggestion(item)}
                    >
                      <Text style={styles.suggestionText}>{item.display_name}</Text>
                    </TouchableOpacity>
                  )}
                  style={styles.suggestionsList}
                />
              )}
              {location && (
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: location.lat,
                      longitude: location.lng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <UrlTile
                      urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      maximumZ={19}
                    />
                    <Marker coordinate={{ latitude: location.lat, longitude: location.lng }} />
                  </MapView>
                </View>
              )}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // Nếu đã có hồ sơ
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header: hiển thị avatar (đã xóa icon camera) */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={
                localImageUri
                  ? { uri: localImageUri }
                  : avatar
                  ? { uri: `http://10.0.2.2:5000${avatar}` }
                  : require("../../assets/user.png")
              }
            />
          </View>

          <Text style={styles.name}>
            {profile?.username || userInfo?.username || "User"}
          </Text>
          <Text style={styles.email}>
            {profile?.email || userInfo?.email || ""}
          </Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </View>

        {/* Thông tin liên hệ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
          <Text style={styles.infoText}>Số điện thoại: {profile.phone || "Chưa cập nhật"}</Text>
          <Text style={styles.infoText}>Địa chỉ: {profile.address || "Chưa cập nhật"}</Text>
        </View>

        {/* Bản đồ vị trí nếu có */}
        {location ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <UrlTile urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
              <Marker coordinate={{ latitude: location.lat, longitude: location.lng }} />
            </MapView>
          </View>
        ) : (
          <Text style={styles.noLocationText}>Chưa có vị trí địa chỉ</Text>
        )}

        {/* Nút đăng xuất */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal chỉnh sửa hồ sơ (đã thêm chức năng chọn ảnh) */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa hồ sơ</Text>
            {/* Phần chọn ảnh trong modal */}
            <View style={styles.modalAvatarContainer}>
              <Image
                style={styles.modalAvatar}
                source={
                  localImageUri
                    ? { uri: localImageUri }
                    : avatar
                    ? { uri: `http://10.0.2.2:5000${avatar}` }
                    : require("../../assets/user.png")
                }
              />
              <TouchableOpacity onPress={pickImage}>
                <Text style={styles.selectImageText}>Chọn ảnh</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={addressQuery}
              onChangeText={setAddressQuery}
            />
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item)}
                  >
                    <Text style={styles.suggestionText}>{item.display_name}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
              />
            )}
            {location && (
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: location.lat,
                    longitude: location.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <UrlTile urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
                  <Marker coordinate={{ latitude: location.lat, longitude: location.lng }} />
                </MapView>
              </View>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666", marginBottom: 20 },
  createProfileButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 5,
  },
  createProfileButtonText: { color: "#fff", fontSize: 16 },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    margin: 20,
  },
  logoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatarContainer: {
    // Giữ nguyên hiển thị avatar nhưng đã xóa icon camera
    position: "relative",
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 22, fontWeight: "bold", color: "#333", marginTop: 10 },
  email: { fontSize: 16, color: "#666", marginBottom: 10 },
  editButton: {
    backgroundColor: "#009688",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: { color: "#fff", fontSize: 16 },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#333" },
  infoText: { fontSize: 16, color: "#333", marginBottom: 5 },
  mapContainer: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: { width: "100%", height: "100%" },
  noLocationText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  modalContent: {
    width: "90%",
    marginTop: 50,
    flex: 1,
    alignSelf: "center",
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalAvatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  selectImageText: {
    color: "#009688",
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderRadius: 5,
  },
  suggestionsList: {
    maxHeight: 120,
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  suggestionText: { fontSize: 14, color: "#333" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#009688",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
