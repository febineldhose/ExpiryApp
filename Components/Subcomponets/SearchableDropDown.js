import React, {Component, Fragment} from 'react';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-community/async-storage';

export default class SearchableDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: '',
      text: '',
      items: [
        {
          kb: 1,
          jb: 'JavaScript',
        },
        {
          kb: 2,
          jb: 'Java',
        },
      ],
    };
  }
  render() {
    return (
      <Fragment>
        <SearchableDropdown
          onItemSelect={(item) => {
            const items = this.state.selectedItems;
            this.props.navigation.goBack();
            items.push(item);
            this.setState({selectedItems: items});
          }}
          containerStyle={{padding: 5}}
          onRemoveItem={(item, index) => {
            const items = this.state.items.filter(
              (sitem) => sitem.kb == item.kb,
            );
            this.setState({items: items});
          }}
          itemStyle={{
            padding: 10,
            marginTop: 2,
            backgroundColor: '#ddd',
            borderColor: '#bbb',
            borderWidth: 1,
            borderRadius: 5,
          }}
          itemTextStyle={{color: '#222'}}
          itemsContainerStyle={{
            maxHeight: this.state.text.length == 0 ? 0 : 100,
          }}
          items={this.state.items}
          //   defaultIndex={2}
          resetValue={false}
          textInputProps={{
            placeholder: 'search here',
            underlineColorAndroid: 'transparent',
            style: {
              padding: 12,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
            },
            onTextChange: (text) => this.setState({text: text}),
          }}
          listProps={{
            nestedScrollEnabled: true,
          }}
        />
      </Fragment>
    );
  }
}
