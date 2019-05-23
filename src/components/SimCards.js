import React, { Component } from 'react';
import {View, Text, Image, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import {Button, Icon, Container, Header, Right, Body, Content, Left, List, ListItem, CheckBox} from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';
import AccessoryListItems from "./AccessoryListItems";

const width = Dimensions.get('window').width;
class SimCards extends Component{
    constructor(props){
        super(props);
        this.state = {
            services: [],
            availabel: 0,
            checked: false,
            key: '',
            selectedServices: null,
            params: this.props.navigation.state.params.params,
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    componentWillMount(){
        axios.post( CONST.url + 'show/card/company' ).then(response => this.setState({ services: response.data.data, key: response.data.key  }))
    }


    onPressConfirm(){
        this.props.navigation.navigate('notes', { params: this.state.params, serviceId: this.state.selectedServices });
    }

    renderLoader(){
        if (this.state.key === ''){
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 500 }}>
                    <DoubleBounce size={20} color="#437c1a" />
                </View>
            );
        }
    }

    renderButton(){
        if (this.state.selectedServices !== null){
            return(
                <Button block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 20}} onPress={() => this.onPressConfirm()}>
                    <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
                </Button>
            );
        }

        return (
            <Button block disabled style={{marginTop: 20, width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 20}} light>
                <Text style={{color: '#999', fontSize: 17, textAlign: 'center' }}>تأكيد</Text>
            </Button>
        );
    }

    render(){
        return(
            <Container>
                <Header style={{ height: 70, backgroundColor: '#437c1a', paddingTop: 15 }}>
                    <Right style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' type='Entypo' style={{ color: '#fff', fontSize: 30, marginTop: 8, left: -10 }} />
                        </Button>
                    </Right>
                    <Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>خدمات عامة</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate('colors')}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content style={{ padding: 10 }}>
                    <View style={{ flex: 1, width: '100%' }}>
                        <List style={{ flex: 1 }}>
                            {
                                this.state.services.map((service, i) => (
                                    <ListItem onPress={() => this.setState({ selectedServices: service.id })} key={i} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                                        <Left style={{ flex: 1 }}>
                                            <Image source={{ uri: service.image }} style={{ width: 30, height: 30, marginRight: 15, marginLeft: 10 }} resizeMode={'center'}/>
                                            <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4, height: 22 }}>{ service.title }</Text>
                                        </Left>
                                        <Right style={{ flex: 1 }}>
                                            <CheckBox style={{ borderRadius: 3, paddingRight: 2 }} checked={this.state.selectedServices === service.id ? true : false} onPress={() => this.setState({ selectedServices: service.id })} color="#437c1a"/>
                                        </Right>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </View>
                </Content>
                <View style={{ padding: 10 }}>
                    { this.renderButton() }
                </View>
            </Container>
        )
    }
}

const styles={
    fixCircleClipping: {
        position: 'absolute',
        top: -2,
        bottom: -2,
        right: -2,
        left: -2,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: '#437c1a'
    }
};

export default SimCards;