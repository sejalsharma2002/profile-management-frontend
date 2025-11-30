import { Platform } from "react-native";

let API_BASE = "http://127.0.0.1:8000"; // default for laptop
if (Platform.OS === "android") {
  API_BASE = "http://192.168.1.7:8000"; // replace with your LAN IP.
}
export { API_BASE };
