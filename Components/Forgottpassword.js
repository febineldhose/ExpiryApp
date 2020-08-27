import React, {Component} from 'react';
import {View, Text, ToastAndroid} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {Validation, Messages} from './Subcomponets/Validation';
export default class Forgottpassword extends Component {
  state = {
    Value: '',
    Value2: '',
    error: false,
    ConfirmErorr: '',
    AsyncData: '',
  };
  componentDidMount() {
    this.RetrieveData();
  }
  onvalidation = () => {
    if (this.state.Value == '' || this.state.Value2 == '') {
      return false;
    } else this.setState({ConfirmErorr: '', numberError: ''});
    if (this.state.Value !== this.state.Value2) {
      this.setState({
        ConfirmErorr: Messages.confirmError,
      });
      return false;
    }
    return true;
  };
  RetrieveData = async () => {
    let value = await AsyncStorage.getItem('UserDetail');
    this.setState({AsyncData: JSON.parse(value)});
  };
  OnSubmit = async () => {
    if (this.state.AsyncData !== null) {
      let {AsyncData, Value2} = this.state;
      let UserDetails = {
        Name: AsyncData.Name,
        Number: AsyncData.Number,
        Password: Value2,
        Confirm: AsyncData.Confirm,
      };
      this.setState({error: true});
      if (this.onvalidation()) {
        await AsyncStorage.setItem('UserDetail', JSON.stringify(UserDetails));
        this.props.navigation.goBack();
        ToastAndroid.show('Password reset successfully', 300);
      }
    } else {
      this.props.navigation.goBack();
      ToastAndroid.show('You must register first ', 300);
    }
  };
  render() {
    const {error} = this.state;
    let checkFor = '';
    return (
      <View style={{backgroundColor: 'white', flex: 1, alignItems: 'center'}}>
        <TextInput
          value={this.state.Value}
          secureTextEntry={true}
          onChangeText={(value) =>
            this.setState({Value: value, ConfirmErorr: ''})
          }
          placeholder="Enter your new password"
          style={{
            borderColor: 'blue',
            borderWidth: 1,
            borderRadius: 10,
            width: '80%',
            height: 40,
            padding: 10,
            marginVertical: 20,
          }}
        />
        {Validation(this.state.Value, checkFor, error, Messages.Password)}
        <TextInput
          value={this.state.Value2}
          secureTextEntry={true}
          onChangeText={(value) =>
            this.setState({Value2: value, ConfirmErorr: ''})
          }
          placeholder="re-enter your password"
          style={{
            borderColor: 'blue',
            borderWidth: 1,
            borderRadius: 10,
            width: '80%',
            height: 40,
            padding: 10,
            marginVertical: 5,
          }}
        />
        {Validation(
          this.state.Value2,
          checkFor,
          error,
          Messages.ConfirmPassword,
        )}
        {Validation(
          this.state.ConfirmErorr,
          Messages.confirmError,
          error,
          Messages.confirmError,
        )}
        <TouchableOpacity onPress={() => this.OnSubmit()}>
          <View
            style={{
              height: 40,
              width: 200,
              marginVertical: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#DC4492',
              borderRadius: 50,
              padding: 12,
            }}>
            <Text style={{color: 'white'}}>Submit</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
