import React, { Component } from 'react';
import { Text, Image } from 'react-native';
import { Right, Left, ListItem, CheckBox } from 'native-base';


class ProblemListItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            checked: false
        }
    }

    setInstallation(){
        if(this.state.checked){
            this.setState({ checked: false });
        }else{
            this.setState({ checked: true });
        }

        this.props.addProblem(this.props.data.id, !this.state.checked)
    }

    render(){
        return(
            <ListItem onPress={() => this.setInstallation()} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                <Left style={{ flex: 1 }}>
                    <Image source={{ uri: this.props.data.image }} style={{ width: 30, height: 30, marginRight: 15, marginLeft: 10 }} resizeMode={'center'}/>
                    <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4, height: 22 }}>{ this.props.data.title } </Text>
                </Left>
                <Right style={{ flex: 1 }}>
                    <CheckBox style={{ borderRadius: 3, paddingRight: 3 }} checked={this.state.checked} onPress={() => this.setInstallation()} color="#437c1a"/>
                </Right>
            </ListItem>
        )
    }
}


export default ProblemListItem;