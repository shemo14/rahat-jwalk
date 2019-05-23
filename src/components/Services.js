import React, { Component } from 'react';
import { Text, Image, View } from 'react-native';
import { Right, Left, ListItem, CheckBox, Icon, List } from 'native-base';


class Services extends Component{
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
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                    <Icon type={'Entypo'} name={'tools'} style={{ color: '#82b37d', marginRight: 5, top: 3 }}/>
                    <Text style={{ color: '#82b37d', textAlign: 'center' }}>الخدمات التي ترغب في تقديمها</Text>
                </View>

                <List>
                    <ListItem onPress={() => this.setInstallation()} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                        <Left style={{ flex: 1 }}>
                            <Icon type={'Ionicons'} name={'ios-settings'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
                            <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>صيانة</Text>
                        </Left>
                        <Right style={{ flex: 1 }}>
                            <CheckBox style={{ borderRadius: 3, paddingRight: 2 }} checked={this.state.checked} onPress={() => this.setInstallation()} color="#437c1a"/>
                        </Right>
                    </ListItem>

                    <ListItem onPress={() => this.setInstallation()} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                        <Left style={{ flex: 1 }}>
                            <Icon type={'Entypo'} name={'mobile'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
                            <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>بيع جولات</Text>
                        </Left>
                        <Right style={{ flex: 1 }}>
                            <CheckBox style={{ borderRadius: 3, paddingRight: 2 }} checked={this.state.checked} onPress={() => this.setInstallation()} color="#437c1a"/>
                        </Right>
                    </ListItem>

                    <ListItem onPress={() => this.setInstallation()} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                        <Left style={{ flex: 1 }}>
                            <Icon type={'MaterialCommunityIcons'} name={'cellphone-screenshot'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
                            <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>بيع اكسسوارات</Text>
                        </Left>
                        <Right style={{ flex: 1 }}>
                            <CheckBox style={{ borderRadius: 3, paddingRight: 2 }} checked={this.state.checked} onPress={() => this.setInstallation()} color="#437c1a"/>
                        </Right>
                    </ListItem>

                    <ListItem onPress={() => this.setInstallation()} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                        <Left style={{ flex: 1 }}>
                            <Icon type={'MaterialIcons'} name={'sim-card'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
                            <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>شرائح بيانات</Text>
                        </Left>
                        <Right style={{ flex: 1 }}>
                            <CheckBox style={{ borderRadius: 3, paddingRight: 2 }} checked={this.state.checked} onPress={() => this.setInstallation()} color="#437c1a"/>
                        </Right>
                    </ListItem>
                </List>
            </View>
        )
    }
}


export default Services;