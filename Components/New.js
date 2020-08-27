import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from './Subcomponets/Imagepicker';
import DatePick from '../Components/Subcomponets/DatePick';
import NotificationService from '../Notification/NotificationService';
import Styles from '../Components/Constants/Styles';
import {Validation, Messages} from './Subcomponets/Validation';
import Activityindicator from '../Components/Subcomponets/ActivityIndicator';
let dateNow = moment().format('YYYY-MM-DD');
export default class Details extends Component {
  constructor() {
    super();
    this.state = {
      Name: '',
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
      NotifList: '',
    };
    this.notif = new NotificationService();
  }
  componentDidMount = () => {
    this.AsyncStorageconfig();
    this.AsyncAllDataRetrieve();
  };
  CallBackforImageUri = (uri) => {
    this.setState({image: uri});
  };
  getStartDate = (val) => {
    if (moment(val).diff(dateNow, 'seconds') <= 1) {
      this.setState({startDate: val});
    } else {
      alert('Enter Valid start Date');
      this.setState({startDate: ''});
    }
  };
  getExpiryDate = (val) => {
    if (moment(val).diff(dateNow, 'seconds') > 1) {
      this.setState({ExpiryDate: val});
    } else {
      alert('Enter Valid Expiry Date');
      this.setState({ExpiryDate: ''});
    }
  };
  NameAndExistValidation = (value, params) => {
    this.setState({Name: value});
    let lowerCase = value.toLowerCase();
    if (params.Data.length !== 0) {
      const alreadyExist = params.Data.map((item) =>
        item.itemName.toLowerCase(),
      );
      if (alreadyExist.includes(lowerCase))
        this.setState({nameError: 'Name Alredy Exist'});
      else this.setState({nameError: ''});
    }
  };
  validation = () => {
    if (
      this.state.Name == '' ||
      this.state.ExpiryDate == '' ||
      this.state.startDate == '' ||
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
  Addon = async (All) => {
    this.setState({error: true});
    if (this.validation()) {
      this.setTimeOutFunctn(200);
      try {
        if (this.state.Switchvalue) {
          const date = moment(this.state.ExpiryDate)
            .add(this.state.time, 'hours')
            .toDate();
          this.state.id++;
          await this.notif.scheduleNotif(
            this.state.Name + '  Getting Expired',
            date,
            this.state.id,
          );
          this.notif.getScheduledLocalNotifications(async (notifs) => {
            await AsyncStorage.setItem('data', JSON.stringify(All));
            await AsyncStorage.setItem(
              'NotificationList',
              JSON.stringify(notifs),
            );
            this.props.route.params.CallBack(All, notifs);
            this.props.navigation.goBack();
            ToastAndroid.show('Added Successfully', 300);
          });
        }
      } catch {
        alert('some erorr Occurs anney');
      }
    } else ToastAndroid.show('Updation failed', 300);
  };
  NameAndExistValidation = (value, params) => {
    this.setState({Name: value});
    let lowerCase = value.toLowerCase();
    if (params.length !== 0) {
      const alreadyExist = params.map((item) => item.itemName.toLowerCase());
      if (alreadyExist.includes(lowerCase)) {
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
  AsyncStorageconfig = async () => {
    try {
      let value = await AsyncStorage.getItem('NotificationList');
      let parsedValue = JSON.parse(value);
      if (value !== null) {
        if (parsedValue.length !== 0) {
          this.setState({NotificationList: parsedValue});
          const id = this.state.NotificationList.map((itemid) => itemid.id);
          const ids = id.sort(function (a, b) {
            return b - a;
          });
          this.setState({id: ids[0]});
        }
      } else {
        this.setState({id: 0});
      }
    } catch {
      alert('some error occured ');
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
    const {Data} = this.props.route.params;
    const All = [
      ...Data,
      {
        startDate: this.state.startDate,
        ExpiryDate: this.state.ExpiryDate,
        itemName: this.state.Name,
        image: this.state.image,
        Note: this.state.Note,
        Quantity: this.state.quantity,
      },
    ];
    const {
      error,
      Name,
      quantity,
      AlreadyExist,
      ExpiryDate,
      startDate,
    } = this.state;
    let checkFor = '';
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{backgroundColor: 'white'}}>
          <View style={Styles.MainView}>
            <Text allowFontScaling={false} style={Styles.CreateText}>
              Create
            </Text>
            <View style={{flexDirection: 'row'}}>
              <ImagePicker
                CallBackforImageUri={this.CallBackforImageUri}
                image={''}
              />
              <TextInput
                multiline={this.state.Name.length > 22 ? false : true}
                placeholder="Item Name"
                style={Styles.ItemNameInput}
                value={this.state.Name}
                onChangeText={(value) =>
                  this.NameAndExistValidation(value, Data)
                }
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {Validation(Name, checkFor, error, Messages.ItemName)}
              {Validation(
                AlreadyExist,
                Messages.AlreadyExist,
                true,
                Messages.AlreadyExist,
              )}
            </View>
            <View style={Styles.DateMainView}>
              <View style={Styles.StartDateView}>
                <DatePick date={'start Date'} getDate={this.getStartDate} />
              </View>
              <View style={Styles.ExpiryDateView}>
                <DatePick date={'Expiry Date'} getDate={this.getExpiryDate} />
              </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              {Validation(startDate, checkFor, error, Messages.DateErorr) ||
                Validation(ExpiryDate, checkFor, error, Messages.DateErorr)}
            </View>
            <TextInput
              multiline={true}
              placeholder="Note"
              value={this.state.Note}
              onChangeText={(val) => this.setState({Note: val})}
              style={Styles.NoteTextInput}
            />
            <TextInput
              keyboardType="number-pad"
              placeholder="Quantity"
              value={this.state.quantity}
              onChangeText={(val) => this.setState({quantity: val})}
              style={Styles.QuantityTextInput}
            />
            {Validation(quantity, checkFor, error, Messages.QuantityError)}
            <TouchableOpacity
              onPress={() => {
                this.Addon(All, Data);
              }}>
              <View style={Styles.AddButtonView}>
                <Text style={{color: 'white', fontSize: 20}}>Add</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {this.state.loading && <Activityindicator />}
      </View>
    );
  }
}
