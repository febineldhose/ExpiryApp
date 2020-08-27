import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {Validation, Messages} from './Subcomponets/Validation';
export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: '',
      Number: '',
      Password: '',
      Confirm: '',
      error: false,
      ConfirmErorr: '',
      numberError: '',
      loading: false,
      User: '',
    };
  }
  componentDidMount() {
    this.OnRetrieveData();
  }
  onvalidation = () => {
    if (
      this.state.Name == '' ||
      this.state.Number == '' ||
      this.state.Confirm == '' ||
      this.state.Password == '' ||
      this.state.Number == this.state.User
    ) {
      return false;
    } else this.setState({ConfirmErorr: '', numberError: ''});
    if (this.state.Confirm !== this.state.Password) {
      this.setState({
        ConfirmErorr: Messages.confirmError,
      });
      return false;
    }
    if (this.state.Number.length < 10) {
      this.setState({numberError: Messages.numberValid});
      return false;
    }
    return true;
  };
  onSaveUserDetail = async () => {
    let UserDetails = {
      Name: this.state.Name,
      Number: this.state.Number,
      Password: this.state.Password,
      Confirm: this.state.Confirm,
    };
    this.setState({error: true});
    if (this.onvalidation()) {
      try {
        await AsyncStorage.setItem('UserDetail', JSON.stringify(UserDetails));
        this.props.navigation.navigate('Login');
        ToastAndroid.show('Successfully Registered', 300);
      } catch {
        alert('Some Error Occurs');
      }
    }
  };
  OnRetrieveData = async () => {
    const value = await AsyncStorage.getItem('UserDetail');
    if (value !== null) {
      let ParsedValue = JSON.parse(value);
      this.setState({User: ParsedValue.Number});
    }
  };
  render() {
    const {
      error,
      Confirm,
      Name,
      Password,
      ConfirmErorr,
      numberError,
      User,
    } = this.state;
    let checkFor = '';
    return (
      <KeyboardAvoidingView
        style={Styles.MainView}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={{height: '100%', width: '100%'}}
        scrollEnabled={true}>
        <View style={Styles.EditMainView}>
          <Text style={Styles.RegistrationTextStyle}>REGISTRATION</Text>
          <TextInput
            style={Styles.TextInput}
            placeholder="Full Name"
            value={this.state.Name}
            onChangeText={(value) => {
              this.setState({Name: value});
            }}
          />
          {Validation(Name, checkFor, error, Messages.Name)}
          <TextInput
            style={Styles.TextInput}
            placeholder="Phone Number"
            value={this.state.Number}
            maxLength={10}
            keyboardType="number-pad"
            onChangeText={(value) => {
              this.setState({Number: value, numberError: ''});
            }}
          />
          {Validation(this.state.Number, checkFor, error, Messages.number)}
          {Validation(
            numberError,
            Messages.numberValid,
            error,
            Messages.numberValid,
          )}
          {Validation(
            this.state.Number,
            User,
            this.state.Number.length > 0,
            Messages.NumberExists,
          )}
          <TextInput
            style={Styles.TextInput}
            placeholder="Password"
            value={this.state.Password}
            secureTextEntry={true}
            onChangeText={(value) => {
              this.setState({Password: value});
            }}
          />
          {Validation(Password, checkFor, error, Messages.Password)}
          <TextInput
            style={Styles.TextInput}
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={this.state.Confirm}
            onChangeText={(value) => {
              this.setState({Confirm: value, ConfirmErorr: ''});
            }}
          />
          {Validation(Confirm, checkFor, error, Messages.ConfirmPassword)}
          {Validation(
            ConfirmErorr,
            Messages.confirmError,
            error,
            Messages.confirmError,
          )}
          <TouchableOpacity
            onPress={() => {
              this.onSaveUserDetail();
            }}>
            <View style={Styles.SignUpView}>
              <Text
                style={{
                  color: 'white',
                }}>
                SIGN UP
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const Styles = StyleSheet.create({
  TextInput: {
    borderBottomColor: 'blue',
    borderBottomWidth: 1,
    width: '80%',
  },
  MainView: {
    backgroundColor: '#1bcdb4',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  EditMainView: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderRadius: 20,
  },
  RegistrationTextStyle: {
    fontWeight: 'bold',
    fontSize: 21,
    marginBottom: 20,
    marginTop: 20,
  },
  LogoView: {
    height: 60,
    width: 150,
    borderRadius: 40,
    backgroundColor: '#BC4365',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    marginBottom: '10%',
  },
  SignUpView: {
    height: 30,
    width: 150,
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DC4492',
    borderRadius: 20,
    padding: 12,
  },
});
