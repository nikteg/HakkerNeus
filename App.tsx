import ListView from "./src/ListView";
import { StackNavigator } from "react-navigation";

import ReaderScreen from "./src/screens/ReaderScreen";
import HomeScreen from "./src/screens/HomeScreen";

export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Reader: {
    screen: ReaderScreen,
  },
});
