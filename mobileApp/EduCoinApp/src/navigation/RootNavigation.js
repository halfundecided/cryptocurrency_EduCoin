import React from 'react';
import { Platform } from 'react-native';
import { Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import {
  Header,
  TabNavigator
} from 'react-navigation';
import { capitalize } from 'lodash';
import { StackNavigator } from 'react-navigation';


import Login from '../pages/Login';
import Signup from '../pages/Signup'
import Marketplace from '../pages/Marketplace';
import AccountPage from '../pages/AccountPage';
import Settings from '../pages/Settings';
import Details from '../pages/Details';
import Sell from '../pages/Sell';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export const Start = StackNavigator({
  login: {
    screen: Login,
  },
  signup: {
    screen: Signup,
  },
}, {
  headerMode: 'none',
});

export const market = StackNavigator({
  marketplace: {
    screen: Marketplace,
  },
  details: {
    screen: Details,
  },
  sell: {
    screen: Sell,
  },
}, {
  headerMode: 'none',
});


export const Tabs = TabNavigator(
  {
    account: {
      screen: AccountPage,
      navigationOptions: {
        title: "Account",
        headerLeft: null,
      }
    },
    market: {
      screen: market,
      navigationOptions: {
        title: "Market Place",
        headerLeft: null,
      }
    },
    settings: {
      screen: Settings,
      navigationOptions: {
        title: "Settings",
        headerLeft: null,
      }
    },
  },
    {
    navigationOptions: ({ navigation }) => {
      let { routeName } = navigation.state;
      let tabBarLabel = capitalize(routeName);
      if (tabBarLabel === 'market') {
        tabBarLabel = 'Market Place';
      }
      return {
        tabBarLabel,
        tabBarIcon: ({ focused }) => {
          const { routeName } = navigation.state;
          let iconName;
          switch (routeName) {
            case 'account':
              iconName = Platform.OS === 'ios' ? 'ios-person' : 'md-person';
              break;
            case 'market':
              iconName = Platform.OS === 'ios' ? 'ios-basket' : 'md-basket';
              break;
            case 'settings':
              iconName =
                Platform.OS === 'ios' ? 'ios-cog' : 'md-cog';
          }
          return (
            <Ionicons
              name={iconName}
              size={30}
              style={{ marginBottom: Platform.OS === 'ios' ? -3 : 0 }}
              color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}/>
          );
        },
      };
    },
    activeTintColor: Colors.tabIconSelected,
    inactiveTintColor: Colors.tabIconDefault,
    tabBarOptions: {
      activeTintColor: Colors.tabIconSelected,
      inactiveTintColor: Colors.tabIconDefault,
    },
  }
);


export const Main = StackNavigator({
  Signup: {
    screen: Start,
    navigationOptions: {
      header: null,
    },
  },

  Tabs: {
    screen: Tabs,
  },
},);