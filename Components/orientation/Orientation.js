import {Dimensions} from 'react-native';
const Font = (number) => {
  return (Dimensions.get('screen').fontScale = number);
};

export default Font;
