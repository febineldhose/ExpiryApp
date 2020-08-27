import React from 'react';
import {ConfirmDialog} from 'react-native-simple-dialogs';
const Messages = {
  Delete: 'Do you want to Delete ?',
  Logout: 'Are you sure want to Logout ?',
};
export default function Alert(props) {
  return (
    <ConfirmDialog
      message={props.message ? Messages.Delete : Messages.Logout}
      visible={props.press}
      onTouchOutside={() => props.onClick('NO')}
      positiveButton={{
        title: 'YES',
        onPress: () => {
          props.onClick('YES');
        },
      }}
      negativeButton={{
        title: 'NO',
        onPress: () => {
          props.onClick('NO');
        },
      }}
    />
  );
}
