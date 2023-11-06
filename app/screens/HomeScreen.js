import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  SafeAreaView
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { FIREBASE_APP, FIRESTORE_DB } from "../../firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { TaskContext } from "../../ContextAPI/TaskProvider";
import {
  FontAwesome,
  Entypo,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hideCompletedTask, setHideCompletedTask] = useState(false);
  const { setTask, setEditTask } = useContext(TaskContext);

  useEffect(() => {
    setLoading(true);
    const ref = collection(FIRESTORE_DB, "tasks");
    const _ = onSnapshot(ref, (querySnapshot) => {
      const tempTaskData = [];
      querySnapshot.forEach((doc) => {
        tempTaskData.push({ id: doc.id, ...doc.data() });
      });
      setTaskData(tempTaskData);
      setLoading(false);
    });
  }, []);

  const handleMarkAsDone = async (index) => {
    const docRef = doc(collection(FIRESTORE_DB, "tasks"), taskData[index].id);
    await updateDoc(docRef, {
      name: taskData[index].name,
      desc: taskData[index].desc,
      status: "completed",
    });
    ToastAndroid.showWithGravity(
      "Task marked as completed",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  const handleMarkAsUnDone = async (index) => {
    const docRef = doc(collection(FIRESTORE_DB, "tasks"), taskData[index].id);
    await updateDoc(docRef, {
      name: taskData[index].name,
      desc: taskData[index].desc,
      status: "pending",
    });
    ToastAndroid.showWithGravity(
      "Task marked as pending",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  const handleClearAll = async () => {
    taskData.map((temp) => {
      deleteDoc(doc(FIRESTORE_DB, "tasks", temp.id));
    });
    ToastAndroid.showWithGravity(
      "Cleared All Tasks...",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  const completedTask = taskData.filter((item) => item.status === "completed");

  const handleDeleteCompleteTask = async () => {
    completedTask.map((temp) => {
      deleteDoc(doc(FIRESTORE_DB, "tasks", temp.id));
    });
    ToastAndroid.showWithGravity(
      "Cleared All Tasks...",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  return (
    <SafeAreaView style={{margin:10}}>
      {loading && (
        <ActivityIndicator
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            marginVertical: "75%",
          }}
          size="large"
        />
      )}
      {!loading && (
        <ScrollView>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Pressable
              onPress={() => navigation.navigate("Task Details")}
              style={[styles.button, styles.buttonAddTask]}
            >
              <Text style={{ textAlign: "center" }}>Add Task</Text>
            </Pressable>
            {taskData.length > 0 && (
              <Pressable
                onPress={handleClearAll}
                style={[styles.button, styles.buttonClearAll]}
              >
                <Text style={{ textAlign: "center" }}>Clear All</Text>
              </Pressable>
            )}
          </View>
          {taskData &&
            taskData.map((taskRecord, index) => (
              <View key={index}>
                {(hideCompletedTask === false ||
                  (hideCompletedTask === true &&
                    !completedTask.includes(taskRecord))) && (
                  <TouchableOpacity
                    style={{
                      padding: 15,
                      borderRadius: 20,
                      margin: 10,
                      marginBottom: 0,
                      elevation: 2,
                      backgroundColor:
                        taskRecord.status === "pending" ? "#ECF9FF" : "grey",
                    }}
                    onPress={() => {
                      setTask(taskRecord);
                      setEditTask(true);
                      navigation.navigate("Task Details");
                    }}
                  >
                    <View style={styles.container}>
                      <View style={styles.text}>
                        <Text style={{ fontSize: 20 }}>{taskRecord.name.length > 20
                            ? taskRecord.name.substring(0, 20 - 3) + "..."
                            : taskRecord.name}</Text>
                        <Text>
                          {taskRecord.desc.length > 25
                            ? taskRecord.desc.substring(0, 25 - 3) + "..."
                            : taskRecord.desc}
                        </Text>
                      </View>
                      <View style={styles.buttonContainer}>
                        <Pressable
                          onPress={() => {
                            setTask(taskRecord);
                            setEditTask(true);
                            navigation.navigate("Task Details");
                          }}
                        >
                          <FontAwesome name="pencil" size={30} color="black" />
                        </Pressable>
                        <View style={styles.buttonSpacer} />
                        {taskRecord.status === "pending" && (
                          <Pressable onPress={() => handleMarkAsDone(index)}>
                            <Entypo name="check" size={30} color="green" />
                          </Pressable>
                        )}

                        {taskRecord.status === "completed" && (
                          <Pressable onPress={() => handleMarkAsUnDone(index)}>
                            <FontAwesome5 name="redo" size={25} color="black" />
                          </Pressable>
                        )}
                        <View style={styles.buttonSpacer} />
                        <Pressable
                          onPress={() => {
                            deleteDoc(
                              doc(FIRESTORE_DB, "tasks", taskRecord.id)
                            );
                            ToastAndroid.showWithGravity(
                              "Task Deleted",
                              ToastAndroid.SHORT,
                              ToastAndroid.CENTER
                            );
                          }}
                        >
                          <Ionicons
                            name="trash-bin-sharp"
                            size={30}
                            color="#D80032"
                          />
                        </Pressable>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            ))}

          <View>
            {completedTask.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Pressable
                  onPress={handleDeleteCompleteTask}
                  style={[styles.button, styles.buttonDeleteCompletedTask]}
                >
                  <Text style={{ textAlign: "center" }}>
                    Delete Completed Tasks
                  </Text>
                </Pressable>
                  {hideCompletedTask && (
                    <Pressable
                      onPress={() => setHideCompletedTask(false)}
                      style={[styles.button, styles.buttonHideCompletedTask]}
                    >
                      <Text style={{ textAlign: "center" }}>Show All</Text>
                    </Pressable>
                  )}
                  {!hideCompletedTask && (
                    <Pressable
                      onPress={() => setHideCompletedTask(true)}
                      style={[styles.button, styles.buttonHideCompletedTask]}
                    >
                      <Text style={{ textAlign: "center" }}>
                        Hide Completed Task
                      </Text>
                    </Pressable>
                  )}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    width:150,
    height:50,
    padding: 15,
    elevation: 2,
    margin: 10,
  },

  buttonAddTask: {
    backgroundColor: "#419197",
  },
  buttonClearAll: {
    backgroundColor: "#9BA4B5",
  },
  buttonDeleteCompletedTask: {
    backgroundColor: "#D80032",
  },
  buttonHideCompletedTask: {
    backgroundColor: "#FFE17B",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
  },
  text: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonSpacer: {
    width: 10,
  },
});
