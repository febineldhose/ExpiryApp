import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Alert from '../Components/Subcomponets/Alert';
import NotificationService from '../Notification/NotificationService';
import moment from 'moment';
import Styles from '../Components/Constants/Styles';
import Activityindicator from '../Components/Subcomponets/ActivityIndicator';
import CheckBoxSelect from './Subcomponets/Checkbox';
let dateNow = moment().format('YYYY-MM-DD');
export default class Expired extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      index: '',
      Alert: false,
      item: [],
      deleteData: '',
      loading: false,
      CheckBoxVisible: false,
      CheckBoxDelete: [],
      IsCheched: '',
      NotificationList: '',
    };
    this.notif = new NotificationService();
  }
  componentDidMount = () => {
    this.setTimeOutFunctn(5);
    this.OnRetrieveData();
    this.didFocus();
  };
  setTimeOutFunctn = (time) => {
    this.setState({loading: true});
    this.OnRetrieveData();
    setTimeout(() => {
      this.setState({loading: false});
    }, time);
  };
  onDeleteAllPress = (CheckName, IsCheched) => {
    if (this.state.CheckBoxDelete.length !== 0 && !IsCheched) {
      const filterValue = this.state.CheckBoxDelete.filter(
        (Deleteitem) => Deleteitem.itemName !== CheckName,
      );
      this.setState({
        CheckBoxDelete: filterValue,
        IsCheched: IsCheched,
      });
    }
  };
  OnRetrieveData = async () => {
    const value = await AsyncStorage.getItem('data');
    let Notificvalue = await AsyncStorage.getItem('NotificationList');
    if (value && Notificvalue !== null) {
      const values = JSON.parse(Notificvalue);
      let ParsedValue = JSON.parse(value);
      let FilteredValue = ParsedValue.filter(
        (item) => item.ExpiryDate <= dateNow,
      );
      this.setState({
        data: ParsedValue,
        deleteData: FilteredValue,
        NotificationList: values,
        CheckBoxDelete: ParsedValue,
      });
    }
  };
  OnSearchDataRecive = (index, searchData) => {
    this.setState({index: index});
    setTimeout(() => {
      this.props.navigation.navigate('Details', {
        EditData: searchData,
        data: this.OnEditDataRecieve,
      });
    }, 20);
  };
  OndeletePress = async (value) => {
    if (value == 'YES') {
      this.setState({data: this.state.CheckBoxDelete, Alert: false});
      await AsyncStorage.setItem(
        'data',
        JSON.stringify(this.state.CheckBoxDelete),
      );
      this.setTimeOutFunctn(300);
    } else this.setState({Alert: false});
  };
  OnEditDataRecieve = async (data) => {
    this.setState(
      (this.state.data[this.state.index] = {
        ...data,
      }),
    );
    await AsyncStorage.setItem('data', JSON.stringify(this.state.data));
  };
  didFocus() {
    this.props.navigation.addListener('focus', async () => {
      this.OnRetrieveData();
    });
  }
  render() {
    this.props.navigation.setOptions({
      headerRight: () => {
        return (
          <View style={Styles.HeaderExpiryStyle}>
            <Icon
              size={30}
              name="search"
              color="white"
              onPress={() => {
                this.props.navigation.navigate('Search', {
                  data: this.OnSearchDataRecive,
                  Expiry: true,
                });
              }}
            />

            {!this.state.CheckBoxVisible ? (
              <Icon
                size={25}
                name="delete"
                color="white"
                onPress={() => {
                  if (this.state.deleteData.length !== 0)
                    this.setState({CheckBoxVisible: true});
                }}
              />
            ) : (
              <Icon
                size={25}
                name="check"
                color="white"
                onPress={() => {
                  if (this.state.IsCheched !== '')
                    this.setState({CheckBoxVisible: false, Alert: true});
                  else this.setState({CheckBoxVisible: false});
                }}
              />
            )}
          </View>
        );
      },
    });
    if (this.state.loading && this.state.deleteData.length < 1)
      return <Activityindicator />;
    else
      return (
        <View style={{height: '100%', width: '100%'}}>
          <Image
            source={require('./images/DefaultIMG.jpg')}
            style={{opacity: 0.1}}
            height={'100%'}
          />
          {this.state.deleteData.length !== 0 && (
            <FlatList
              data={this.state.data}
              style={{position: 'absolute', height: '100%'}}
              contentContainerStyle={{
                paddingBottom: 4,
              }}
              keyExtractor={(item) => item.itemName}
              renderItem={({item, index}) => {
                if (item.ExpiryDate <= dateNow)
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({index: index, item: item});
                        this.props.navigation.navigate('Details', {
                          EditData: item,
                          data: this.OnEditDataRecieve,
                          AllData: this.state.data,
                        });
                      }}>
                      <View style={Styles.renderMainView}>
                        {item.image !== '' ? (
                          <Image
                            source={{uri: item.image}}
                            style={Styles.imageView}
                          />
                        ) : (
                          <Image
                            source={require('../Components/images/Deafault.png')}
                            style={Styles.imageView}
                          />
                        )}
                        <View
                          style={[
                            Styles.Textwraper,
                            {
                              flexWrap:
                                item.itemName.length > 22 ? 'wrap' : 'nowrap',
                            },
                          ]}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontWeight: 'bold',
                              fontSize: 17,
                            }}>
                            {item.itemName}
                          </Text>
                        </View>
                        <View style={Styles.checkBoxStyle}>
                          <Text style={Styles.ExpiredDateStyle}>Expired</Text>
                          {this.state.CheckBoxVisible && (
                            <CheckBoxSelect
                              CheckValue={this.onDeleteAllPress}
                              ItemName={item.itemName}
                            />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
              }}
            />
          )}
          {this.state.deleteData.length == 0 && (
            <View style={Styles.NoData}>
              <Text allowFontScaling={false} style={{fontWeight: 'bold'}}>
                You Have No Expired Items
              </Text>
            </View>
          )}
          <Alert
            press={this.state.Alert}
            onClick={this.OndeletePress}
            message={true}
          />
        </View>
      );
  }
}
