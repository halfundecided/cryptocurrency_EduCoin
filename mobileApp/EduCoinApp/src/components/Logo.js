import React from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';


export default class Logo extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo}
        source={require('../../assets/images/logo.png')}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo : {
    width: 200,
    height: 39
  }
});
