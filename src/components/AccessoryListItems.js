import React, { Component } from 'react';
import { Text, Image } from 'react-native';
import { Right, Left, ListItem, CheckBox } from 'native-base';


class AccessoryListItems extends Component{
    constructor(props){
        super(props);
        this.state = {
            checked: false
        }
    }

    setAccessory(){
        if(this.state.checked){
            this.setState({ checked: false });
        }else{
            this.setState({ checked: true });
        }

        this.props.addAccessory(this.props.data.id, !this.state.checked)
    }

    render(){
        return(
            <ListItem onPress={() => this.setAccessory()} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                <Left style={{ flex: 1 }}>
                    <Image source={{ uri: this.props.data.image }} style={{ width: 30, height: 30, marginRight: 15, marginLeft: 10 }} resizeMode={'center'}/>
                    <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>{ this.props.data.title } </Text>
                </Left>
                <Right style={{ flex: 1 }}>
                    <CheckBox style={{ borderRadius: 3, paddingRight: 2 }} checked={this.state.checked} onPress={() => this.setAccessory()} color="#437c1a"/>
                </Right>
            </ListItem>
        )
    }
}


export default AccessoryListItems;