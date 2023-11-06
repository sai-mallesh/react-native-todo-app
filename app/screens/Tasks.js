import { View, Text, TextInput, StyleSheet, ToastAndroid, Pressable, SafeAreaView } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { FIRESTORE_DB } from "../../firebaseConfig";
import { addDoc, collection, doc,updateDoc } from "firebase/firestore";

import { TaskContext } from "../../ContextAPI/TaskProvider";

export default function Tasks({ navigation }) {
  const { task, setTask, editTask, setEditTask } = useContext(TaskContext);

  const [edit, setEdit] = useState(false);

  const addTask = async () => {
    const dataToUpdate = {
      name: taskDetails.name,
      desc: taskDetails.desc,
      status: editTask ? taskDetails.status : "pending",
    };
    if (edit) {
        const docRef = doc(collection(FIRESTORE_DB, 'tasks'), taskDetails.id);
        await updateDoc(docRef, dataToUpdate)
        navigation.navigate("Home Screen");
        ToastAndroid.showWithGravity("Task Updated Successfully",ToastAndroid.SHORT,ToastAndroid.CENTER)
      return;
    }
    await addDoc(collection(FIRESTORE_DB, "tasks"), dataToUpdate);
    navigation.navigate("Home Screen");
    ToastAndroid.showWithGravity("Task Added Successfully",ToastAndroid.SHORT,ToastAndroid.CENTER)
  };

  const [taskDetails, setTaskDetails] = useState({
    id: "",
    name: "",
    desc: "",
    status: "",
  });
  useEffect(() => {
    if (editTask) {
      setTaskDetails(task);
      setTask("");
      setEditTask(false);
      setEdit(true);
    }
  }, []);

  return (
    <SafeAreaView style={{margin:10}}>
      <TextInput
        style={styles.input}
        placeholder="Enter Task Name"
        onChangeText={(text) => setTaskDetails({ ...taskDetails, name: text })}
        value={taskDetails.name}
      />
      <TextInput
        multiline={true}
        numberOfLines={4}
        style={[styles.input, styles.multiLineTextInput]}
        placeholder="Enter Task Description"
        onChangeText={(text) => setTaskDetails({ ...taskDetails, desc: text })}
        value={taskDetails.desc}
      />
      <View style={{flexDirection: "row", justifyContent:"space-between"}}>
      <Pressable onPress={() => addTask()} style={[styles.button,styles.buttonAddTask]}><Text style={{ textAlign: "center" }}>Save</Text></Pressable>
      <Pressable onPress={() => navigation.navigate("Home Screen")} style={[styles.button,styles.buttonCancel]}><Text style={{ textAlign: "center" }}>Cancel</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom:10,
    borderRadius:15
  },
  multiLineTextInput: {
    minHeight: 85,
    borderRadius:22
  },
  button: {
    borderRadius: 15,
    width:150,
    height:50,
    padding: 15,
    elevation: 2,
    margin: 10,
    marginTop: 20
  },

  buttonAddTask: {
    backgroundColor: "#419197",
  },
  buttonCancel: {
    backgroundColor: "#9BA4B5",
  },
});
