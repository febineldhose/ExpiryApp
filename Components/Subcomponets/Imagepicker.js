import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  ToastAndroid,
} from 'react-native';
import ImagePicker from 'react-native-new-image-picker';
import {Icon} from 'react-native-elements';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import Activityindicator from './ActivityIndicator';
export default class Imagepicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resourcePath: {},
      visible: false,
      avatarSource: '',
      Pick: false,
      loading: false,
    };
  }
  componentDidMount = () => {
    this.setTimeOutFunctn();
    this.setState({avatarSource: this.props.image});
  };
  setTimeOutFunctn = () => {
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({loading: false});
    }, 6);
  };
  onPickerShow = () => {
    this.setState({Pick: true});
  };
  selectFile = (GalleryOrCamera) => {
    try {
      this.setState({Pick: false});
      if (GalleryOrCamera == 'openPicker') {
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
        }).then((image) => {
          this.setTimeOutFunctn();
          this.props.CallBackforImageUri(image.original_path);
          this.setState({avatarSource: image.original_path});
          ToastAndroid.show('Photo Updated Succesfull', 300);
        });
      } else {
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          writeTempFile: true,
        }).then((image) => {
          ImagePicker.openCropper({
            path: image.path,
            width: 300,
            height: 400,
          }).then((image) => {
            console.warn(image.path);

            // this.setTimeOutFunctn();
            // this.props.CallBackforImageUri(image.path);
            // this.setState({avatarSource: image.path});
            ToastAndroid.show('Photo Updated Successfully', 300);
          });
        });
      }
    } catch {
      alert('some error occured');
    }
  };
  OnRemoveImage = () => {
    this.setState({avatarSource: '', Pick: false}, () => {
      this.props.CallBackforImageUri('');
      ToastAndroid.show('Photo Deleted Successfully', 300);
    });
  };
  PickerText = () => {
    const Message = ['Choose An Image', 'Gallery', 'Camera', 'Remove'];
    const RemoveCondtion = this.state.avatarSource !== '';
    const Dialog = () => {
      return (
        <View>
          <Text style={{fontSize: 19, fontWeight: 'bold'}}>{Message[0]}</Text>
          <View
            style={[
              styles.MainView,
              RemoveCondtion
                ? styles.ConditionalWidth
                : styles.ConditionalDefaultWidth,
            ]}>
            <View style={styles.MainContainer}>
              <TouchableOpacity onPress={() => this.selectFile('openPicker')}>
                <Image
                  source={require('../images/Gallery.png')}
                  style={styles.GalleryImage}
                />
              </TouchableOpacity>
              <Text style={{marginVertical: 8}}>{Message[1]}</Text>
            </View>
            {RemoveCondtion && (
              <View style={styles.MainContainer}>
                <TouchableOpacity onPress={() => this.OnRemoveImage()}>
                  <Icon name="delete" color="white" style={styles.deleteIcon} />
                </TouchableOpacity>
                <Text style={{marginVertical: 8}}>{Message[3]}</Text>
              </View>
            )}
          </View>
        </View>
      );
    };
    return (
      <ConfirmDialog
        message={Dialog()}
        visible={this.state.Pick}
        onTouchOutside={() => this.setState({Pick: false})}
        dialogStyle={styles.ConfirmDialog}
      />
    );
  };
  // Launch Camera
  render() {
    if (this.state.avatarSource == '') {
      return (
        <View style={styles._defaultContainer}>
          <TouchableOpacity onPress={this.onPickerShow}>
            <Image
              source={require('../images/camera.png')}
              style={{height: 60, width: 60, borderRadius: 40}}
            />
          </TouchableOpacity>
          <this.PickerText />
        </View>
      );
    } else {
      return (
        <View style={styles._imageContainer}>
          {this.state.loading && <Activityindicator />}
          <TouchableOpacity onPress={this.onPickerShow}>
            {!this.state.loading && (
              <Image
                source={{uri: this.state.avatarSource}}
                style={styles._image}
              />
            )}
          </TouchableOpacity>
          <this.PickerText />
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  MainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
    marginLeft: 15,
    justifyContent: 'space-between',
    borderRadius: 40,
  },
  ConditionalWidth: {width: 135},
  ConditionalDefaultWidth: {width: 30},
  MainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  GalleryImage: {
    height: 50,
    width: 50,
    borderRadius: 20,
  },
  cameraView: {
    height: 50,
    width: 50,
    borderRadius: 30,
    borderColor: '#A63B75',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CameraImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  _defaultContainer: {
    height: 80,
    width: 80,
    borderRadius: 50,
    backgroundColor: '#7E82A9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0D0301',
  },
  _imageContainer: {
    height: 80,
    width: 80,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  _image: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  ConfirmDialog: {
    height: 200,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  deleteIcon: {
    backgroundColor: '#F2580D',
    borderRadius: 30,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
