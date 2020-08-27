import {StyleSheet} from 'react-native';
const Styles = StyleSheet.create({
  MainView: {
    height: '100%',
    width: '100%',
    padding: 10,
  },
  CreateText: {
    alignSelf: 'center',
    fontSize: 24,
    marginVertical: 8,
    fontWeight: 'bold',
  },
  ItemNameInput: {
    borderColor: 'white',
    borderBottomColor: 'blue',
    borderWidth: 1,
    flex: 1,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 5,
  },
  nameErorr: {alignSelf: 'center', color: 'red', top: -12},
  DateMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  StartDateView: {
    borderBottomColor: 'blue',
    borderWidth: 1,
    width: '40%',
    borderColor: 'white',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ExpiryDateView: {
    borderBottomColor: 'blue',
    borderWidth: 1,
    width: '40%',
    borderColor: 'white',
    height: 50,
  },
  NoteTextInput: {
    borderBottomColor: 'blue',
    borderWidth: 1,
    width: '100%',
    borderColor: 'white',
    alignSelf: 'center',
    marginBottom: 12,
  },
  QuantityTextInput: {
    borderBottomColor: 'blue',
    borderWidth: 1,
    width: '100%',
    borderColor: 'white',
  },
  AddButtonView: {
    width: '40%',
    alignSelf: 'center',
    backgroundColor: '#DC4492',
    height: 40,
    marginVertical: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  HeaderHomeStyle: {
    width: 87,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  HeaderExpiryStyle: {
    width: 87,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  renderMainView: {
    marginVertical: 0.7,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    padding: 11,
  },
  Textwraper: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: '3%',
    flex: 1,
  },
  checkBoxStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageView: {
    height: 60,
    width: 60,
    borderRadius: 40,
  },
  addIcon: {
    position: 'absolute',
    height: 55,
    width: 55,
    backgroundColor: '#AD041E',
    borderRadius: 40,
    right: 15,
    bottom: 25,
    justifyContent: 'center',
  },
  headerStyle: {
    backgroundColor: '#1bcdb4',
    height: 80,
  },
  NoData: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    padding: 10,
  },
  DateStyle: {
    color: 'white',
    fontWeight: '700',
    marginTop: 6,
    backgroundColor: '#87D97F',
    padding: 6,
    borderRadius: 10,
  },
  ExpiredDateStyle: {
    color: 'white',
    fontWeight: '700',
    marginTop: 6,
    backgroundColor: '#F9747D',
    padding: 6,
    borderRadius: 10,
  },
  SearchHeaderStyle: {
    flexDirection: 'row',
    backgroundColor: '#1bcdb4',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    elevation: 3,
  },
  TextInputHeaderStyle: {
    flex: 1,
    alignItems: 'stretch',
    height: '60%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    marginLeft: 5,
    marginRight: 5,
  },
});
export default Styles;
