import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import Logo from '../components/Logo';

export default class Signup extends React.Component {

  onButtonPress = () => {
    this.props.navigation.navigate('Tabs');
  }

   onBackToLogin = () => {
    this.props.navigation.navigate('login');
  }

  render() {
    return (
      <View style={styles.container}>

        <Logo/>

        <View>
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="First Name"
            placeholderTextColor="#FFFFFF"
          />
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Last Name"
            placeholderTextColor="#FFFFFF"
          />
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Email"
            placeholderTextColor="#FFFFFF"
          />
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
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Confirm Password"
            secureTextEntry={true}
            placeholderTextColor="#FFFFFF"
          />
          <TouchableOpacity style={styles.button} onPress={this.onButtonPress}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Already have an account? <Text onPress={this.onBackToLogin} style={styles.signupButton}>Sign in</Text></Text>
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
     marginTop: 0,
  },
  signupTextCont : {
    // flexGrow: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText : {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16
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
    paddingVertical: 12
  },
  buttonText : {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: "#FFFFFF"
  }
});
