import React from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import { List, ListItem, SearchBar } from 'react-native-elements';

export default class Marketplace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false
    };
  }

  componenetDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = 'https://randomuser.me/api/?seed=${seed}&page=${page}&results=20';
    this.setState({ loading: true });
    fetch(url)
    .then((res) => res.json())
    .then(res => {
      this.setState({
        data: page === 1 ? res.results : [...this.state.data, ...res.results],
        error: res.error || null,
        loading: false,
        refreshing: false,
      })
    })
    .catch(error => {
      this.setState({ error, loading: false, refreshing: false });
    });
  };

  renderHeader = () => {
    return (
      <View style={{flex:1, flexDirection: 'column',}}>
        <SearchBar placeholder="Search the market..." lightTheme round style={{margin: 0}}/>
        <TouchableOpacity onPress={this.sellCoin} style={styles.button}>
          <Text>SELL</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View>
        <ActivityIndicator animating size="large"/>
      </View>
    );
  };

  sellCoin = () => {
    this.props.navigation.navigate('sell');
  }

  handleRefresh = () => {
    this.setState({
      page: 1,
      refreshing: true,
      seed: this.state.seed + 1,
    }, () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState({
      page: this.state.page + 1,
    }, () => {
      this.makeRemoteRequest();
    });
  };

  render() {
    return (
        <List containerStyle = {{backgroundColor: '#4295cb', marginTop: 0}}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <ListItem
              title={item.name.first + " " + item.name.last}
              rightTitle={"$$$/EDC"}
              onPress={() => this.props.navigation.navigate('details', { first: item.name.first, last: item.name.last })}
              />
            )}
            keyExtractor={item => item.login.md5}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            onEndReached={this.handleLoadMore}
            onEndThreshold={0}
          />
        </List>
    );
  }
}


const styles = StyleSheet.create({
  button : {
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: 'lightgrey',
      width: 80,
      borderRadius: 20,
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
  },
});
