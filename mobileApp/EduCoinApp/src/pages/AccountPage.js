import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

var flatListData = [
    {
        "key": "598a678278fee204ee51cd2c",
        "action": "Sent",
        "amount": -800.00,                       
        "date": "April 29, 2018"
    },
    {
        "key": "asdfadfgggggggggasdf",
        "action": "Received",
        "amount": 800.0000,                       
        "date": "April 29, 2018"
    },
     {
        "key": "598a678278ff1cd2c",
        "action": "Sent",
        "amount": -0.5,                       
        "date": "April 29, 2018"
    },
    {
        "key": "asdfdggggggasdf",
        "action": "Received",
        "amount": 80.560,                       
        "date": "April 29, 2018"
    },
     {
        "key": "598a6782se51cd2c",
        "action": "Sent",
        "amount": -832,                       
        "date": "April 29, 2018"
    },
    {
        "key": "asdfaddggggggasdf",
        "action": "Received",
        "amount": 830,                       
        "date": "April 29, 2018"
    },
    {
        "key": "asdfaddgggdggasdf",
        "action": "Received",
        "amount": 56,                       
        "date": "April 29, 2018"
    },
    {
        "key": "asdfaddggsgggasdf",
        "action": "Sent",
        "amount": -86.32,                       
        "date": "April 29, 2018"
    },
    {
        "key": "asdddggbgasdf",
        "action": "Sent",
        "amount": -320,                       
        "date": "April 29, 2018"
    },
    {
        "key": "asdfagbgasdf",
        "action": "Sent",
        "amount": -320,                       
        "date": "April 29, 2018"
    },
    {
        "key": "asdfaddgsdf",
        "action": "Received",
        "amount": 36.23,                       
        "date": "April 29, 2018"
    },
];
class FlatListItem extends Component {
    render() {          
        return (        
            <View style={{
                flex: 1,
                flexDirection:'column',
                borderTopWidth: 10,
                borderTopColor: '#4295cb'                                
            }}>            
                <View style={{
                        flex: 1,
                        flexDirection:'row',
                        // backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen': 'tomato'                
                        backgroundColor: '#4295cb'
                }}>            
                    <Ionicons
                    name={this.props.item.action === "Sent" ? 'md-arrow-round-up' : 'md-arrow-round-down'}
                    size={60}
                    style={{ 
                            borderLeftWidth: 15,
                            borderRightWidth: 15,
                            marginBottom: Platform.OS === 'ios' ? -3 : 0 }}
                    color={this.props.item.action === "Sent" ? 'lightgray' : 'green'}/>
                    
                    <View style={{
                            flex: 1,
                            flexDirection:'column',   
                            height: 60                 
                        }}>            
                            <Text style={{fontSize: 20, borderTopWidth: 15, color: 'white'}}>{this.props.item.action}</Text>
                    </View>


                    <View style={{
                            flex: 1,
                            flexDirection:'column',   
                            height: 60                 
                        }}>            
                            <Text style={{color: 'white',
                                         fontSize: 28,
                                         textAlign: 'right',
                                         borderRightWidth: 16
                                        }}>{this.props.item.amount}</Text>
                            <Text style={{color: 'white',
                                         fontSize: 16,
                                         textAlign: 'right',
                                         borderRightWidth: 16
                                        }}>{this.props.item.date}</Text>
                    </View>              
                </View>
                
                <View style={{
                    height: 1,
                    backgroundColor:'white'                            
                }}>
            
                </View>
          </View>
        );
    }
}
class BalanceComponent extends Component {
    render(){
        return(
            <View style={{
                        flexDirection:'column',         
                        backgroundColor: '#4295cb',
                        height: 120,
            }}>
                <Text style ={{
                    color: 'white',
                    padding: 0,
                    fontSize: 16,
                    borderLeftWidth: 10,
                    borderTopWidth: 10,  
                }}> 
                    Available Balance:
                </Text>
                <Text style ={{
                    color: 'white',
                    padding: 0,
                    fontSize: 36,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderTopWidth: 5
                }}>
                87.00 EDC
                </Text>
                <Text style ={{
                    color: 'white',
                    padding: 0,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center' 
                }}>
                29000 USD
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    flatListItem: {
        color: 'white',
        padding: 0,
        fontSize: 16,  
    }
});

export default class AccountPage extends Component {
    render() {
      return (
        <View style={{flex: 1}}>
            <BalanceComponent/>
            <FlatList 
                data={flatListData}
                renderItem={({item, index})=>{
                    //console.log(`Item = ${JSON.stringify(item)}, index = ${index}`);
                    return (
                    <FlatListItem item={item} index={index}/>);
                }}
                >

            </FlatList>
        </View>
      );
    }
}