import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Image, TouchableOpacity } from 'react-native';
import { Container, Button, Content, Form, Item, Input, Icon } from 'native-base';
import { Spinner } from '../common'


class ConfirmOrder extends Component{
    constructor(props){
        super(props);
        this.state= {
            email: '',
            password: ''
        };
    }

    render(){
        return(
            <Container style={{ backgroundColor: '#fff' }}>
                <Content contentContainerStyle={{flexGrow: 1}}>
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                        <Image resizeMode={'cover'} style={{ width: 150, height: 150, marginTop: 30 }} source={require('../../assets/images/Layer_1.png')}/>
                        <Text style={{ textAlign: 'center', fontSize: 20, color: '#747474', marginTop: 20 }}>تم ارسال طلبك بنجاح</Text>
                        <TouchableOpacity style={{ marginTop: 30 }} onPress={() => this.props.navigation.navigate('home')}>
                            <Text style={{ color: '#7aab73', fontSize: 20, textDecorationLine: "underline", textDecorationStyle: "solid", textDecorationColor: "#7aab73", }}>العودة الي الرئيسية</Text>
                        </TouchableOpacity>
                    </View>
                    <Image resizeMode={'cover'} style={{ width: '100%', height: 170, bottom: -1, position: 'absolute' }} source={require('../../assets/images/Vector_Smart_Object.png')}/>
                </Content>
            </Container>
        )
    }
}

export default ConfirmOrder;