import React, {Component} from 'react';
import {
  Text,
  View,
  Switch,
  Image,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import NotificationService from '../Notification/NotificationService';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from './Subcomponets/Imagepicker';
import {Icon} from 'react-native-elements';
import Alert from '../Components/Subcomponets/Alert';
import Activityindicator from './Subcomponets/ActivityIndicator';
import moment from 'moment';
import {ConfirmDialog} from 'react-native-simple-dialogs';
export default class Settings extends Component {
  constructor(props) {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <View style={styles.headerView}>
            <Icon
              name="delete"
              color="white"
              onPress={() => this.setState({Alert2: true})}
              size={25}
            />
            <Icon
              name="account-circle"
              color="white"
              onPress={() => this.setState({Alert: true})}
              size={35}
            />
          </View>
        );
      },
    });

    super(props);
    this.state = {
      message: '',
      time: 10,
      Switchvalue: '',
      Alert: false,
      Image: '',
      loading: false,
      Text: '',
      value: '',
      NotificationVal: '',
      id: 0,
      NotificationList: [],
      account: false,
      Alert2: false,
    };
    this.notif = new NotificationService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }
  AsyncTextRetrive = async () => {
    const value = await AsyncStorage.getItem('UserDetail');
    if (value !== null) {
      let values = JSON.parse(value);
      this.setState({Text: values.Name});
    }
  };
  setAsyncValues = async () => {
    const allValue = {
      time: this.state.time,
      switchStatus: this.state.Switchvalue,
      image: this.state.Image,
    };
    await AsyncStorage.setItem('Usersettings', JSON.stringify(allValue));
  };
  AsyncAllDataRetrieve = async () => {
    try {
      this.AsyncTextRetrive();
      const value = await AsyncStorage.getItem('Usersettings');
      if (value !== null) {
        this.setState({loading: true});
        let values = JSON.parse(value);
        this.setState({
          Switchvalue: values.switchStatus,
          time: values.time,
          Image: values.image,
          loading: false,
        });
        if (!values.switchStatus) {
          ToastAndroid.show(
            'Turn On Notifications to get notified always ',
            300,
          );
        }
      }
    } catch {
      alert('some Error occured');
    }
  };
  AsyncStorageconfig = async () => {
    try {
      if (this.state.Switchvalue) {
        let value = await AsyncStorage.getItem('NotificationList');
        if (value !== null) {
          this.setState({NotificationList: JSON.parse(value)});
          setTimeout(() => {
            const id = this.state.NotificationList.map((itemid) => itemid.id);
            const ids = id.sort(function (a, b) {
              return b - a;
            });
            this.setState({id: ids[0]});
          }, 20);
        }
      }
    } catch {
      alert('some error occured');
    }
  };
  NotificationListRetrieve = async () => {
    try {
      let value = await AsyncStorage.getItem('NotificationList');
      if (value !== null) {
        this.setState({NotificationList: JSON.parse(value)});
        setTimeout(() => {
          for (
            let index = 0;
            index < this.state.NotificationList.length;
            index++
          ) {
            const date = this.state.NotificationList[index].date;
            const Dates = moment(date);
            const formatedDate = moment(Dates).format('YYYY-MM-DD');
            const changedTimeDate = moment(formatedDate)
              .add(this.state.time, 'hours')
              .toDate();
            const DateNow = new Date(Date.now());
            const Difference = moment(changedTimeDate).diff(DateNow, 'seconds');
            const id = this.state.NotificationList[index].id;
            if (Difference > 1) {
              const message = this.state.NotificationList[index].message;
              this.notif.scheduleNotif(message, changedTimeDate, id);
            } else {
              this.notif.cancelNotif({id: id});
              this.AsyncStorageconfig();
            }
          }
          const id = this.state.NotificationList.map((itemid) => itemid.id);
          const ids = id.sort(function (a, b) {
            return b - a;
          });
          this.setState({id: ids[0]});
        }, 30);
      }
    } catch {
      alert('some error occured');
    }
  };
  componentDidMount = async () => {
    await AsyncStorage.setItem;
    this.AsyncAllDataRetrieve();
    this.AsyncStorageconfig();
  };
  setTimeOutFunctn = () => {
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({loading: false});
    }, 1);
  };
  onLogout = async (value) => {
    try {
      if (value == 'YES') {
        await AsyncStorage.removeItem('UserStatus');
        this.notif.cancelAll();
        this.setState({Alert: false});
        this.props.navigation.reset({
          routes: [{name: 'Login'}],
        });
      } else this.setState({Alert: false});
    } catch {
      alert('some error occured');
    }
  };
  SetSwitchValue = async (value) => {
    try {
      this.setState({Switchvalue: value}, async () => this.setAsyncValues());
      if (value) {
        ToastAndroid.show('You will get notifications', 300);
        this.NotificationListRetrieve();
      } else {
        this.notif.cancelAll();
        alert('you will not get any notifications further');
      }
    } catch {
      alert('an error  occured');
    }
  };
  CallBackforImageUri = async (uri) => {
    this.setState({Image: uri}, async () => this.setAsyncValues());
  };
  OnDataDelete = async (value) => {
    this.notif.cancelAll();
    await AsyncStorage.clear();
    this.props.navigation.reset({
      routes: [{name: 'Login'}],
    });
    ToastAndroid.show('Account deleted succesfully', 300);
  };

  render() {
    return (
      <View style={{height: '100%'}}>
        <Image
          source={require('./images/DefaultIMG.jpg')}
          style={{opacity: 0.1}}
          height={'100%'}
        />
        <View style={styles.MainView}>
          <View style={styles.lineView}>
            {!this.state.loading && (
              <ImagePicker
                CallBackforImageUri={this.CallBackforImageUri}
                image={this.state.Image}
              />
            )}
            <Text style={styles.TextView}>{this.state.Text.toUpperCase()}</Text>
          </View>
          <View style={styles.notificationView}>
            <Text style={{fontSize: 16}}>Notification</Text>
            <Switch
              thumbColor={this.state.Switchvalue ? 'green' : 'black'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => this.SetSwitchValue(value)}
              value={this.state.Switchvalue}
            />
          </View>
          <View style={styles.sceduleView}>
            <Text style={{fontSize: 16}}>Scheduled Time</Text>
            <DropDownPicker
              items={[
                {
                  label: '10 AM',
                  value: 10,
                },
                {
                  label: '12 AM',
                  value: 0,
                },
                {
                  label: '4 PM',
                  value: 16,
                },
                {
                  label: '5 PM',
                  value: 17,
                },
              ]}
              defaultValue={this.state.time}
              containerStyle={{
                height: 28,
                width: '28%',
              }}
              style={{backgroundColor: '#E1E6E5', borderWidth: 0}}
              itemStyle={{
                justifyContent: 'flex-start',
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              onChangeItem={(item) =>
                this.setState(
                  {
                    time: item.value,
                    Switchvalue: false,
                  },
                  async () => this.setAsyncValues(),
                )
              }
            />
          </View>
          <ConfirmDialog
            message={'Do you want to remove your account'}
            visible={this.state.Alert2}
            onTouchOutside={() => this.setState({Alert2: false})}
            positiveButton={{
              title: 'YES',
              onPress: () => {
                this.OnDataDelete();
                this.setState({Alert2: false});
              },
            }}
            negativeButton={{
              title: 'NO',
              onPress: () => {
                this.setState({Alert2: false});
              },
            }}
          />
          <Alert
            press={this.state.Alert}
            onClick={this.onLogout}
            message={false}
          />
        </View>
        {this.state.loading && <Activityindicator />}
      </View>
    );
  }

  onRegister(token) {
    this.setState({registerToken: token.token, fcmRegistered: true});
  }
  onNotif(notif) {}
  handlePerm(perms) {}
}
const styles = StyleSheet.create({
  headerView: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
  },
  MainView: {position: 'absolute', width: '100%', padding: 10},
  lineView: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.4,
  },
  TextView: {marginHorizontal: 20, fontSize: 18, fontWeight: 'bold'},
  notificationView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.3,
    paddingVertical: 15,
  },
  sceduleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
});
