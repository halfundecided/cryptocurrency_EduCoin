import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar
} from 'react-native';
console.disableYellowBox = true;
import Colors from './src/constants/Colors';

import { Tabs, Main } from './src/navigation/RootNavigation';

export default class App extends React.Component {
  render() {
    return (
      <Main />
    )
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    alignItems: 'center'
  },
});
