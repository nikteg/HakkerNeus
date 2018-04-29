import * as React from "react";
import { NavigationScreenProps } from "react-navigation";

// @ts-ignore
import * as packageJson from "../../package.json";

import ListView from "../ListView";
import { Item } from "../../backend/src/typings/api";

export default class HomeScreen extends React.Component<NavigationScreenProps> {
  static navigationOptions = {
    title: `${packageJson.name} v${packageJson.version}`,
  };

  navigateToItem = (item: Item) => {
    this.props.navigation.navigate("Reader", { item });
  };

  navigateToComments = (item: Item) => {
    this.props.navigation.navigate("Comments", { storyId: item.id });
  };

  render() {
    return <ListView onPress={this.navigateToItem} onPressComment={this.navigateToComments} />;
  }
}
