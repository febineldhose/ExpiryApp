import React, {useState} from 'react';
import {CheckBox} from 'react-native';

function CheckBoxSelect(props) {
  const [indexs, changeIndex] = useState(false);
  const {CheckValue, ItemName} = props;
  return (
    <CheckBox
      value={indexs}
      onValueChange={(value) => {
        changeIndex(value);
        CheckValue(ItemName, indexs);
      }}
    />
  );
}
export default CheckBoxSelect;
