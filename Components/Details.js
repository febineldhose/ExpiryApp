import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import ImagePicker from './Subcomponets/Imagepicker';
import moment from 'moment';
import NotificationService from '../Notification/NotificationService';
import AsyncStorage from '@react-native-community/async-storage';
import DatePick from '../Components/Subcomponets/DatePick';
import Styles from '../Components/Constants/Styles';
import {Validation, Messages} from './Subcomponets/Validation';
import Activityindicator from './Subcomponets/ActivityIndicator';
let dateNow = moment().format('YYYY-MM-DD');
export default class Details extends Component {
  constructor() {
    super();
    this.state = {
      itemName: '',
      startDate: '',
      ExpiryDate: '',
      image: '',
      Note: '',
      quantity: '',
      error: false,
      AlreadyExist: '',
      loading: false,
      id: 0,
      NotificationList: [],
      time: '',
      Switchvalue: false,
    };
    this.notif = new NotificationService();
  }
  componentDidMount = () => {
    this.AsyncStorageconfig();
    this.AsyncAllDataRetrieve();
    let date = this.props.route.params.EditData;
    this.setState({
      itemName: date.itemName,
      startDate: date.startDate,
      ExpiryDate: date.ExpiryDate,
      image: date.image,
      Note: date.Note,
      quantity: date.Quantity,
    });
  };
  CallBackforImageUri = (uri) => {
    this.setState({image: uri});
  };
  getStartDate = (val) => {
    if (moment(val).diff(dateNow) <= 1) {
      this.setState({startDate: val});
    } else {
      alert('Enter Valid start Date');
      this.setState({startDate: ''});
    }
  };
  getExpiryDate = (val) => {
    if (moment(val).diff(dateNow) > 1) {
      this.setState({ExpiryDate: val});
    } else {
      alert('Enter Valid Expiry Date');
      this.setState({ExpiryDate: ''});
    }
  };
  validation = () => {
    if (
      this.state.itemName == '' ||
      this.state.startDate == '' ||
      this.state.ExpiryDate == '' ||
      this.state.quantity == '' ||
      this.state.AlreadyExist !== ''
    ) {
      return false;
    }
    if (!this.state.Switchvalue) {
      alert('please turn on notification');
      return false;
    }
    return true;
  };
  UpdateOn = (All) => {
    this.setState({error: true});
    try {
      this.setTimeOutFunctn(150);
      if (this.validation()) {
        this.NotificationConfig();
        this.setTimeOutFunctn(300);
        this.props.route.params.data(All);
        this.props.navigation.goBack();
        ToastAndroid.show('Updated Successfully', 300);
      } else ToastAndroid.show('Updation failed', 300);
    } catch {
      alert('some error occurs');
    }
  };
  NameAndExistValidation = (value, params, EditData) => {
    this.setState({itemName: value});
    let lowerCase = value.toLowerCase();
    if (params.length !== 0) {
      const alreadyExist = params.map((item) => item.itemName.toLowerCase());
      if (alreadyExist.includes(lowerCase) && EditData.itemName !== lowerCase) {
        this.setState({AlreadyExist: Messages.AlreadyExist});
      } else this.setState({AlreadyExist: ''});
    }
  };
  setTimeOutFunctn = (time) => {
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({loading: false});
    }, time);
  };
  NotificationConfig = async () => {
    if (this.state.Switchvalue && this.state.ExpiryDate > dateNow) {
      const date = await moment(this.state.ExpiryDate)
        .add(this.state.time, 'hours')
        .toDate();
      this.notif.scheduleNotif(
        this.state.itemName + '  ' + 'Getting Expired',
        date,
        this.state.id,
      );
      setTimeout(async () => {
        this.notif.getScheduledLocalNotifications(async (notifs) => {
          await AsyncStorage.setItem(
            'NotificationList',
            JSON.stringify(notifs),
          );
        });
      }, 30);
    }
  };
  AsyncStorageconfig = async () => {
    try {
      let value = await AsyncStorage.getItem('NotificationList');
      let parsedValue = JSON.parse(value);
      if (value !== null && parsedValue.length > 0) {
        this.setState({NotificationList: parsedValue});
        setTimeout(() => {
          if (this.state.ExpiryDate <= dateNow) {
            const id = this.state.NotificationList.map((itemid) => itemid.id);
            const ids = id.sort(function (a, b) {
              return b - a;
            });
            this.setState({id: ids[0]});
          } else {
            const name = this.state.NotificationList.filter(
              (itemname) =>
                itemname.message ==
                this.state.itemName + '  ' + 'Getting Expired',
            );
            this.setState({id: name[0].id});
          }
        }, 20);
      }
    } catch {
      alert('some error occured');
    }
  };
  AsyncAllDataRetrieve = async () => {
    try {
      const value = await AsyncStorage.getItem('Usersettings');
      if (value !== null) {
        let values = JSON.parse(value);
        this.setState({
          Switchvalue: values.switchStatus,
          time: values.time,
        });
      }
    } catch {
      alert('some Error occured');
    }
  };
  render() {
    let {EditData, AllData} = this.props.route.params;
    const All = {
      startDate: this.state.startDate,
      ExpiryDate: this.state.ExpiryDate,
      itemName: this.state.itemName,
      image: this.state.image,
      Note: this.state.Note,
      Quantity: this.state.quantity,
    };
    const {error, itemName, quantity, AlreadyExist} = this.state;
    let checkFor = '';
    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        <View style={Styles.MainView}>
          <Text allowFontScaling={false} style={Styles.CreateText}>
            Edit
          </Text>
          <View style={{flexDirection: 'row'}}>
            <ImagePicker
              CallBackforImageUri={this.CallBackforImageUri}
              image={EditData.image}
            />
            <TextInput
              placeholder="Item Name"
              multiline={true}
              style={Styles.ItemNameInput}
              value={this.state.itemName}
              onChangeText={(value) =>
                this.NameAndExistValidation(value, AllData, EditData)
              }
              multiline={true}
            />
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {Validation(itemName, checkFor, error, Messages.ItemName)}
            {Validation(
              AlreadyExist,
              Messages.AlreadyExist,
              true,
              Messages.AlreadyExist,
            )}
          </View>
          <View style={Styles.DateMainView}>
            <View style={Styles.StartDateView}>
              <DatePick date={EditData.startDate} getDate={this.getStartDate} />
            </View>
            <View style={Styles.ExpiryDateView}>
              <DatePick
                date={EditData.ExpiryDate}
                getDate={this.getExpiryDate}
              />
            </View>
          </View>
          <TextInput
            placeholder="Note"
            multiline={true}
            style={Styles.NoteTextInput}
            value={this.state.Note}
            onChangeText={(value) => this.setState({Note: value})}
          />
          <TextInput
            placeholder="Quantity"
            style={Styles.QuantityTextInput}
            value={this.state.quantity}
            keyboardType="number-pad"
            onChangeText={(value) => {
              this.setState({quantity: value});
            }}
          />
          {Validation(quantity, checkFor, error, Messages.QuantityError)}
          <TouchableOpacity
            onPress={() => {
              this.UpdateOn(All);
            }}>
            <View style={Styles.AddButtonView}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Update</Text>
            </View>
          </TouchableOpacity>
          {this.state.loading && <Activityindicator />}
        </View>
      </ScrollView>
    );
  }
}
