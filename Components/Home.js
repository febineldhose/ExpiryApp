import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Alert from '../Components/Subcomponets/Alert';
import NotificationService from '../Notification/NotificationService';
import Styles from '../Components/Constants/Styles';
import Activityindicator from '../Components/Subcomponets/ActivityIndicator';
import moment from 'moment';
import CheckBoxSelect from './Subcomponets/Checkbox';
let dateNow = moment().format('YYYY-MM-DD');
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      index: '',
      Alert: false,
      item: '',
      time: '',
      loading: false,
      deleteData: '',
      NotificationList: '',
      count: 0,
      CheckBoxVisible: false,
      CheckBoxDelete: [],
      CheckboxNotifCancel: '',
    };
    this.notif = new NotificationService();
  }
  componentDidMount = () => {
    this.notif.getScheduledLocalNotifications((notif) => console.warn(notif));
    this.setTimeOutFunctn(6);
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
      const name = this.state.NotificationList.filter(
        (itemname) => itemname.message == CheckName + '  ' + 'Getting Expired',
      );
      this.setState({
        CheckBoxDelete: filterValue,
        CheckboxNotifCancel: [...this.state.CheckboxNotifCancel, name[0].id],
      });
    } else this.setState({CheckboxNotifCancel: ''});
  };
  OnRetrieveData = async () => {
    const value = await AsyncStorage.getItem('data');
    let Notificvalue = await AsyncStorage.getItem('NotificationList');
    if (value && Notificvalue !== null) {
      const values = JSON.parse(Notificvalue);
      let ParsedValue = JSON.parse(value);
      let FilteredValue = ParsedValue.filter(
        (item) => item.ExpiryDate > dateNow,
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
      for (
        let index = 0;
        index < this.state.CheckboxNotifCancel.length;
        index++
      ) {
        const id = this.state.CheckboxNotifCancel[index];
        this.notif.cancelNotif(id);
      }
      this.notif.getScheduledLocalNotifications(async (notif) => {
        await AsyncStorage.setItem('NotificationList', JSON.stringify(notif));
      });
      await AsyncStorage.setItem(
        'data',
        JSON.stringify(this.state.CheckBoxDelete),
      );
      this.setState({data: this.state.CheckBoxDelete, Alert: false});
      this.setTimeOutFunctn(300);
    } else this.setState({Alert: false});
  };
  OnNewDataRecive = async (data, notif) => {
    if (this.state.deleteData == '') {
      this.setState({data: data, deleteData: 1, NotificationList: notif});
    } else {
      this.setState({data: data, NotificationList: notif});
    }
  };
  OnEditDataRecieve = async (data) => {
    this.setState(
      (this.state.data[this.state.index] = {
        ...data,
      }),
    );
    await AsyncStorage.setItem('data', JSON.stringify(this.state.data));
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
    }
  };
  didFocus = () => {
    this.props.navigation.addListener('focus', (e) => {
      this.OnRetrieveData();
    });
  };

  render() {
    this.props.navigation.setOptions({
      headerRight: () => {
        return (
          <View style={Styles.HeaderHomeStyle}>
            <Icon
              size={30}
              name="search"
              color="white"
              onPress={() => {
                this.props.navigation.navigate('Search', {
                  data: this.OnSearchDataRecive,
                  Expiry: false,
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
                  if (this.state.CheckboxNotifCancel !== '')
                    this.setState({CheckBoxVisible: false, Alert: true});
                  else this.setState({CheckBoxVisible: false});
                }}
              />
            )}
          </View>
        );
      },
    });
    if (this.state.loading) return <Activityindicator />;
    else
      return (
        <View
          style={{
            height: '100%',
            width: '100%',
          }}>
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
              extraData={this.state}
              renderItem={({item, index}) => {
                if (item.ExpiryDate > dateNow)
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
                            source={require('./images/Deafault.png')}
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
                          <Text
                            style={Styles.DateStyle}
                            allowFontScaling={false}>
                            {this.expiryDateValidation(item.ExpiryDate)}
                          </Text>
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
                Add Your Items
              </Text>
            </View>
          )}
          <View style={Styles.addIcon}>
            <Icon
              name="add"
              size={35}
              color="white"
              onPress={() =>
                this.props.navigation.navigate('New', {
                  CallBack: this.OnNewDataRecive,
                  Data: this.state.data,
                })
              }
            />
          </View>
          <Alert
            press={this.state.Alert}
            onClick={this.OndeletePress}
            message={true}
          />
        </View>
      );
  }
}
