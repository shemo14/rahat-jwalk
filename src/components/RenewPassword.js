import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Image, TouchableOpacity, ImageBackground, BackHandler } from 'react-native';
import { Container, Button, Content, Form, Item, Input, Icon, Toast } from 'native-base';
import { Spinner } from '../common'
import axios from 'axios';
import CONST from '../consts'
import { userLogin, profile } from '../actions'
import {Notifications} from "expo";
import {connect} from "react-redux";



class RenewPassword extends Component{
    constructor(props){
        super(props);
        this.state= {
            password: '',
            passwordError: '',
            confirmPassword: '',
            confirmPasswordError: '',
            showToast: false,
            token: '',
            userId: null,
            user: this.props.navigation.state.params.user,
            code:  this.props.navigation.state.params.code,
        };
    }

    validate = () => {
        let isError = false;
        const errors = {
            codeError: "",
        };

        if (this.state.code.length <= 0) {
            isError = true;
            errors.phoneError = 'الرجاء ادخال كود التفعيل';
        }

        this.setState({
            ...this.state,
            ...errors
        });

        console.log(isError);
        return isError;
    };

    async componentWillMount() {
        console.log(this.state.user);

        let token = await Notifications.getExpoPushTokenAsync();
        this.setState({ token, userId: null });
    }

    renewPassword(){
        let msg = '';
        if (this.state.password.length < 6) {
            msg = 'كلمة المرور اقل من ٦ احرف';
        }else if (this.state.password !== this.state.confirmPassword){
            msg = 'كلمة المرور و تأكيد كلمة المرور غير متطابق' ;
        }

        if (msg !== ''){
            Toast.show({
                text: msg,
                type: "danger",
                duration: 3000
            });

            return <View/>
        }

        axios.post(CONST.url + 'check_code_repassword', { code: this.state.code, user_id: this.state.user.id, password: this.state.password }).then(response => {
            if (response.data.key == 1){
                const { password, token} = this.state;
                const phone = this.state.user.phone;
                this.props.userLogin({ phone, password, token });
            }
        })
    }

    componentWillReceiveProps(newProps){
        if (newProps.auth !== null && newProps.auth.key === "1"){


            if (this.state.userId === null){
                this.setState({ userId: newProps.auth.data.id });
                this.props.profile(newProps.auth.data.id);
            }

            this.props.navigation.navigate('drawerNavigation');
        }

        if (this.props.profile !== null) {
            Toast.show({
                text: newProps.auth.massage,
                type: newProps.auth.key === "1" ? "success" : "danger",
                duration: 3000
            });
        }

        this.setState({ loader: false });
    }


    renderLoading(){
        if (this.state.loader){
            return(<Spinner />);
        }

        return (
            <Button block style={{ position: 'absolute', backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} onPress={() => { this.renewPassword()  }} primary>
                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تغير كلمة المرور</Text>
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
                            <View style={{flex: 1}}>
                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: this.state.passwordError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start'
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 25}} name={'lock'} type={'FontAwesome'}/>
                                    <Input autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(password) => this.setState({password})} style={{ alignSelf: 'flex-end', textAlign: 'right', color: '#277c19' }} secureTextEntry placeholder='كلمة المرور' value={this.state.password}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.passwordError}</Text>
                            </View>

                            <View style={{flex: 1}}>
                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: this.state.confirmPasswordError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start'
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 25}} name={'lock'} type={'FontAwesome'}/>
                                    <Input autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(confirmPassword) => this.setState({confirmPassword})} style={{ alignSelf: 'flex-end', textAlign: 'right', color: '#277c19' }} secureTextEntry placeholder='تأكيد كلمة المرور' value={this.state.confirmPassword}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.confirmPasswordError}</Text>
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



const mapStateToProps = ({ auth, profile }) => {
    return {
        loading: auth.loading,
        auth: auth.user,
        user: profile.user
    };
};

export default connect(mapStateToProps, { userLogin, profile })(RenewPassword);