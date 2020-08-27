import React, {Component} from 'react';
import {View, Text, TextInput, Dimensions, Platform, Image} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import Styles from '../Components/Constants/Styles';
import {Icon} from 'react-native-elements';
import Icons from 'react-native-vector-icons/Feather';
let dateNow = moment().format('YYYY-MM-DD');
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asyncData: [],
      index: '',
      Alert: false,
      value: '',
      SearchData: '',
    };
  }
  componentDidMount = async () => {
    var value = await AsyncStorage.getItem('data');
    if (value !== null) {
      this.setState({asyncData: JSON.parse(value)});
    }
  };
  otherDetails = (itemName) => {
    let value = this.state.asyncData.filter((item) => {
      return item.itemName.toLowerCase() == itemName;
    });
    return value[0];
  };
  onCheck = (textInputvalue) => {
    if (textInputvalue !== '') {
      this.setState({value: textInputvalue});
      let name = this.state.asyncData
        .map((item) => item.itemName.toLowerCase())
        .filter((name) => name.includes(textInputvalue.toLowerCase()));
      this.setState({SearchData: name});
    } else this.setState({SearchData: ''});
  };
  SearchOn = (data) => {
    let details = this.state.asyncData.filter(
      (item) => item.itemName.toLowerCase() == data,
    );
    let index = this.state.asyncData.findIndex(
      (item) => item.itemName == details[0].itemName,
    );
    this.props.navigation.goBack();
    this.props.navigation.navigate('Details', {
      EditData: details[0],
      data: this.props.route.params.data(index, details[0]),
    });
  };
  expiryDateValidation = (expirtDate) => {
    let expired = moment(expirtDate).diff(dateNow, 'days');
    if (expirtDate > dateNow) {
      if (expired == 1) {
        return expired + '-' + 'Day Left';
      }
      if (expired == 3 || expired == 2) {
        return expired + '-' + 'Days Left';
      }
      return expirtDate;
    } else return 'Expired';
  };
  render() {
    const Expiry = this.props.route.params.Expiry;

    return (
      <View>
        <Image
          source={require('./images/DefaultIMG.jpg')}
          style={{opacity: 0.1}}
          height={'100%'}
        />
        <View style={{position: 'absolute', width: '100%'}}>
          <View style={Styles.SearchHeaderStyle}>
            <Icons
              name="arrow-left"
              size={30}
              onPress={() => this.props.navigation.goBack()}
            />
            <TextInput
              style={Styles.TextInputHeaderStyle}
              autoFocus={true}
              clearButtonMode="always"
              ref={(ref) => (this.textInputRef = ref)}
              placeholder="search items"
              onChangeText={(value) => {
                return this.onCheck(value);
              }}
            />
            <Icon
              name="clear"
              onPress={() => {
                this.textInputRef.clear();
                this.setState({SearchData: ''});
              }}
            />
          </View>
          <FlatList
            data={this.state.SearchData}
            keyExtractor={(item) => item}
            style={{height: '100%'}}
            contentContainerStyle={{
              paddingTop: 5,
              paddingBottom: 10,
            }}
            renderItem={({item}) => {
              const Expired = this.otherDetails(item).ExpiryDate <= dateNow;
              const NotExpired = this.otherDetails(item).ExpiryDate > dateNow;
              if (Expiry ? Expired : NotExpired)
                return (
                  <TouchableOpacity
                    onPress={() => {
                      this.SearchOn(item, Expiry);
                    }}>
                    <View style={Styles.renderMainView}>
                      {this.otherDetails(item).image !== '' ? (
                        <Image
                          source={{uri: this.otherDetails(item).image}}
                          style={Styles.imageView}
                        />
                      ) : (
                        <Image
                          source={require('../Components/images/Deafault.png')}
                          style={Styles.imageView}
                        />
                      )}
                      <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>
                        {item}
                      </Text>
                      <View style={{alignSelf: 'center'}}>
                        <Text
                          style={
                            Expiry ? Styles.ExpiredDateStyle : Styles.DateStyle
                          }>
                          {this.expiryDateValidation(
                            this.otherDetails(item).ExpiryDate,
                          )}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
            }}
          />
        </View>
      </View>
    );
  }
}
