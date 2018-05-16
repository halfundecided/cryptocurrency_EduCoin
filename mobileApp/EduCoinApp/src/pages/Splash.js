import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar
} from 'react-native';

import Logo from '../components/Logo';


export default class Splash extends React.Component {


  render() {
    componentWillMount() {
      setTimeout(()=> {
        this.props.navigation.navigate('login');
      }, 4000)
    }
    return (
      <View style={styles.container}>
        <Logo />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor: 'rgb(61, 148, 202)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0
  }
});
