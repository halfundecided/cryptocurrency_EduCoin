import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Actions,
  TextInput,
} from 'react-native';

import Logo from '../components/Logo';

export default class Login extends React.Component {
  toSignup = () => {
    this.props.navigation.navigate('signup');
  };

  onButtonPress = () => {
    this.props.navigation.navigate('Tabs');
  };

  render() {
    return (
      <View style={styles.container}>

        <Logo />

        <View style={styles.container}>
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Username"
            placeholderTextColor="#FFFFFF"
          />
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#FFFFFF"
          />
          <TouchableOpacity onPress={this.onButtonPress} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Do not have an account yet? </Text>
          <TouchableOpacity onPress={this.toSignup}><Text style={styles.signupButton}>Sign up</Text></TouchableOpacity>
        </View>

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
  },
  signupTextCont : {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  signupText : {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    alignItems: 'center'
  },
  signupButton : {
    color:'#FFFFFF',
    fontSize: 16,
    fontWeight: '500'
  },
  inputBox : {
    width:300,
    height: 50,
    backgroundColor:'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginVertical: 10
  },
  button : {
    width: 100,
    height: 40,
    backgroundColor:'#0D82CB',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  buttonText : {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: "#FFFFFF",
    alignItems: 'center'
  }
});
