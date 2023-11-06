import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Tasks from "./app/screens/Tasks";
import HomeScreen from "./app/screens/HomeScreen";
import TaskProvider from "./ContextAPI/TaskProvider";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TaskProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home Screen" component={HomeScreen} />
        <Stack.Screen name="Task Details" component={Tasks} />
      </Stack.Navigator>
    </NavigationContainer>
    </TaskProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
