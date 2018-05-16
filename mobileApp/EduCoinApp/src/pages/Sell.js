import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Actions,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

export default class Login extends React.Component {
  onButtonPress = () => {
    Alert.alert("You put all your coin up for sale!");
    this.props.navigation.navigate("marketplace");
  };

  render() {
    return (
        <View style={styles.container}>
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Coin Amount"
            placeholderTextColor="#FFFFFF"
            keyboardType = 'numeric'
          />
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Selling Price"
            placeholderTextColor="#FFFFFF"
            keyboardType = 'numeric'
          />
          <TouchableOpacity onPress={this.onButtonPress} style={styles.button}>
            <Text style={styles.buttonText}>Sell</Text>
          </TouchableOpacity>
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
    marginTop: 100
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
    color: "#FFFFFF",
  }
});