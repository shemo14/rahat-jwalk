import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Image, TouchableOpacity, ImageBackground, BackHandler } from 'react-native';
import { Container, Button, Content, Form, Item, Input, Icon, Toast } from 'native-base';
import { Spinner } from '../common'
import axios from 'axios';
import CONST from '../consts'


class ConfirmCode extends Component{
    constructor(props){
        super(props);
        this.state= {
            code: '',
            codeError: '',
            showToast: false,
            user: this.props.navigation.state.params.user,
            msg:  this.props.navigation.state.params.msg,
        };
    }

    validate = () => {
        let isError = false;
        const errors = {
            codeError: "",
        };

        if (this.state.code.length <= 0) {
            isError = true;
            errors.codeError = 'الرجاء ادخال كود التفعيل';
        }

        this.setState({
            ...this.state,
            ...errors
        });

        console.log(isError);
        return isError;
    };

    componentWillMount() {
        console.log(this.state.user.code, this.state.user);
        Toast.show({
            text: this.state.msg,
            type: "success",
            duration: 3000
        });
    }

    confirmCode(){
        const err = this.validate();
        if (!err){
            if (this.state.user.code == this.state.code) {
                this.props.navigation.navigate('renewPassword', { user: this.state.user, code: this.state.code })
            }else{
                Toast.show({
                    text: 'كود التفعيل غير صحيح , الرجاء المحاولة مرة اخري',
                    type: "danger",
                    duration: 3000
                });
            }

        }
    }


    renderLoading(){
        if (this.state.loader){
            return(<Spinner />);
        }

        return (
            <Button block style={{ position: 'absolute', backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} onPress={() => { this.confirmCode()  }} primary>
                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
            </Button>
        );
    }

    render(){
        return(
            <Container style={{ backgroundColor: '#fff' }}>
                <Content contentContainerStyle={{flexGrow: 1}}>
                    <KeyboardAvoidingView behavior="position">
                        <View style={{justifyContent: 'center', alignItems: 'center', height: 220, paddingTop: 70}}>
                            <Image resizeMode={'stretch'} style={{width: 100, height: 100}}
                                   source={require('../../assets/images/logo.png')}/>
                        </View>
                        <Form>
                            <View style={{flex: 2, padding: 30}}>
                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: this.state.codeError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start'
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 25}} name={'check-circle'} type={'FontAwesome'}/>
                                    <Input keyboardType='phone-pad' autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(code) => this.setState({code})} style={{ alignSelf: 'flex-end', textAlign: 'right', color: '#277c19' }} placeholder='كود التفعيل' value={this.state.code}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.codeError}</Text>
                            </View>
                        </Form>
                    </KeyboardAvoidingView>
                    <ImageBackground resizeMode={'center'} style={{ width: '100%', height: 140, bottom: -6, position: 'absolute' }} source={require('../../assets/images/Vector_Smart_Object.png')}>
                        <View style={{ top: -50, padding: 30 }}>
                            {this.renderLoading()}
                        </View>
                    </ImageBackground>
                </Content>
            </Container>
        )
    }
}



export default ConfirmCode;