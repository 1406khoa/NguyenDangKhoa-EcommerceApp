import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../Navigation/RootNavigator";

type Props = StackScreenProps<RootStackParams, "Signup">;

const SignupScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://10.0.2.2:5000/api/auth/signup", { username, email, password });
      if (response.status === 201) {
        Alert.alert("Đăng ký thành công", "Vui lòng đăng nhập");
        navigation.navigate("Login");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Đăng ký thất bại", error.response?.data?.message || "Đã có lỗi xảy ra");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 10 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 5, width: "100%", alignItems: "center", marginVertical: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  linkText: { color: "#007AFF", marginTop: 10, fontSize: 16 },
});

export default SignupScreen;
