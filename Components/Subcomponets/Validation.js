import React from 'react';
import {Text} from 'react-native';
const Messages = {
  Name: 'Please enter your name',
  Password: 'please enter password',
  Field: 'this field cannot be empty',
  confirmError: 'passwords are not matching',
  number: 'please enter your number',
  numberValid: 'must have 10 digits',
  ConfirmPassword: 're-enter your password',
  LoginError: 'Invalid Username or Password',
  QuantityError: 'please enter quantity',
  AlreadyExist: 'Name Alredy Exist',
  ItemName: 'please enter your item name',
  DateErorr: 'must have both start and expiry dates ',
  NumberExists: 'Number already exist',
};
function Validation(Component, checkFor, error, Messege) {
  if (Component == checkFor && error) {
    return <Text style={{color: 'red'}}>{Messege}</Text>;
  }
  return false;
}
module.exports = {Validation, Messages};
