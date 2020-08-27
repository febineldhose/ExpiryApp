import React, {Component} from 'react';
import DatePicker from 'react-native-datepicker';
export default class DatePick extends Component {
  constructor(props) {
    super(props);
    this.state = {date: '', placeholder: ''};
  }
  componentDidMount = () => {
    if (this.props.date.includes('a')) {
      this.setState({placeholder: this.props.date});
    } else {
      this.setState({date: this.props.date});
    }
  };
  Datepass = (date, Moment) => {
    this.props.getDate(date, Moment);
  };
  render() {
    return (
      <DatePicker
        style={{width: '100%'}}
        date={this.state.date}
        mode="date"
        placeholder={this.state.placeholder}
        format="YYYY-MM-DD"
        minDate="1980-05-01"
        maxDate="3000-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0,
            padding: 15,
          },
          dateInput: {
            marginLeft: 36,
            borderColor: 'white',
            borderWidth: 1,
          },
        }}
        onDateChange={(date, Moment) => {
          this.setState({date: date});
          this.Datepass(date, Moment);
        }}
      />
    );
  }
}
