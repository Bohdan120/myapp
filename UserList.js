import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, deleteUser, fetchUsers, updateUser } from "./redux/userSlice";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function UserList() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [btn, setBtn] = useState("Add");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id));
  };

  const handleAddUser = () => {
    if (name.trim() === "" || email.trim() === "") {
      Alert.alert("Помилка", "Будь ласка, введіть ім'я та email");
      return;
    }

    if (btn === "Edit") {
      dispatch(updateUser({ id, name, email }));
      setBtn("Add");
    } else {
      dispatch(addUser({ id: Date.now(), name, email }));
    }
    setName("");
    setEmail("");
    setId("");
  };

  const handleUpdateUser = (id) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      setId(user.id);
      setName(user.name);
      setEmail(user.email);
      setBtn("Edit");
    }
  };

  if (status === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (status === "failed") {
    Alert.alert("Error", `${error}`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>{btn === "Add" ? "Add New User" : "Edit User"}</Text>
        <TextInput
          style={styles.input}
          placeholder="Input Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Input Email"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity onPress={handleAddUser}>
          <Text style={styles.button}>{btn}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userItemText}>Ім'я: {item.name}</Text>
            <Text style={styles.userItemText}>Email: {item.email}</Text>
            <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
              <Text style={styles.button}>Видалити</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUpdateUser(item.id)}>
              <Text style={styles.button}>Оновити</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userList: {
    marginBottom: 20,
  },
  userItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  userItemText: {
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  button: {
    backgroundColor: "blue",
    color: "white",
    padding: 10,
    textAlign: "center",
    marginVertical: 5,
  },
  errorText: {
    color: "red",
  },
});
