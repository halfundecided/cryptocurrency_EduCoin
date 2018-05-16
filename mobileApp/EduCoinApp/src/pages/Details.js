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
} from 'react-native';

export default class Login extends React.Component {
  onButtonPress = () => {
    Alert.alert("You purchased coin from " + this.props.navigation.state.params.first + " " + this.props.navigation.state.params.last + "!");
    this.props.navigation.navigate("marketplace");
  };

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.container}>
          <Text style={styles.headerText}>{this.props.navigation.state.params.first} {this.props.navigation.state.params.last}</Text>
          <Text style={styles.regularText} >$$$ - EDU</Text>
          <TouchableOpacity onPress={this.onButtonPress} style={styles.button}>
            <Text style={styles.buttonText}>Buy</Text>
          </TouchableOpacity>
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
    marginVertical: 20,
    paddingVertical: 12
  },
  buttonText : {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: "#FFFFFF",
  },
  regularText : {
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    color: "#FFFFFF",
    padding: 20
  },
  headerText : {
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    color: "#FFFFFF",
    padding: 20,
    marginBottom: 10,
  }

});