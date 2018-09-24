import * as React from "react";
import { NavigationScreenProps } from "react-navigation";

// @ts-ignore
import * as packageJson from "../../package.json";

import ListView from "../ListView";
import { Item, StoryItem } from "../../backend/src/typings/api";
import { Share } from "react-native";
import { ListViewQuery_items } from "../_generated/ListViewQuery";

export default class HomeScreen extends React.Component<NavigationScreenProps> {
  static navigationOptions = {
    title: `${packageJson.name} v${packageJson.version}`,
  };

  navigateToItem = (item: ListViewQuery_items) => {
    this.props.navigation.navigate("Reader", { item });
  };

  openShareSheet = (item: ListViewQuery_items) => {
    Share.share({
      url: item.url!,
    });
  };

  navigateToComments = (item: ListViewQuery_items) => {
    this.props.navigation.navigate("Comments", { storyId: item.id });
  };

  render() {
    return (
      <ListView
        onPress={this.navigateToItem}
        onLongPress={this.openShareSheet}
        onPressComment={this.navigateToComments}
      />
    );
  }
}
