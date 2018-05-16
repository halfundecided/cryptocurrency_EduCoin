import React, {Component} from 'react';
import {
  AppRegistry,
  Button,
  StyleSheet,
  View,
  StatusBar,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,

} from 'react-native';

export default class Settings extends React.Component {
  onButtonPress = () => {
    Alert.alert("Your account settings have been saved.");
  }
  toLogout = () => {
    this.props.navigation.navigate('login');
  }

  constructor(props) {
    super(props);
    this.state = {
      UserName: '',
      UserEmail: '',
      UserPassword: ''}
    this.username = '';
    this.newpass = '';
    this.currpass = '';
    this.currpass2 = '';
  }

  render() {
    return (
      <View  style={styles.container}>
        <View style={styles.secondContainer}>
            <TextInput
              style={styles.inputBox}
              placeholder = 'Username'
              maxLength = {16}
              onChangeText = {(username) => this.setState ({username})}
              />
            <TextInput
              style={styles.inputBox}
              placeholder = 'New Password'
              secureTextEntry = {true}
              maxLength = {16}
              onChangeText = {(newpass) => this.setState ({newpass})}
              />
            <TextInput
              style={styles.inputBox}
              placeholder = 'Password'
              secureTextEntry = {true}
              maxLength = {16}
              onChangeText = {(currpass) => this.setState ({currpass})}
              />
            <TextInput
              style={styles.inputBox}
              placeholder = 'Confirm Password'
              secureTextEntry = {true}
              maxLength = {16}
              onChangeText = {(currpass2) => this.setState ({currpass2})}
              />
        </View>

        <View style={{flex:1}}>
            <TouchableOpacity onPress={this.onButtonPress} style={styles.button}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
         <View style={{marginTop:0}}>
            <TouchableOpacity onPress={this.toLogout} style={styles.button}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor: '#4295cb',
    flexGrow: 1,
    alignItems: 'center',
    flex:1
  },
  secondContainer: {
    marginTop: 25
  },
  inputBox : {
    marginTop: 10,
    width:200,
    height: 45,
    backgroundColor:'rgba(255, 255, 255, 0.6)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center'
  },
  button: {
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 10,
      width: 130,
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
    color: "#FFFFFF",
  }
});
