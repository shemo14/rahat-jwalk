import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { Container, Button, Content, Form, Item, Input, Icon, Toast } from 'native-base';
import { Spinner } from '../common'
import { connect } from 'react-redux';
import { userLogin, profile } from '../actions'


class Login extends Component{
    constructor(props){
        super(props);
        this.state= {
          phone: '',
          password: '',
          passwordError: '',
          phoneError: '',
          showToast: false,
        };
    }

    onLoginPressed() {

        const err = this.validate();
        if (!err){
            this.setState({ loader: true });
            const {phone, password} = this.state;
            this.props.userLogin({ phone, password });
        }

    }

    componentWillReceiveProps(newProps){

        if (newProps.auth !== null && newProps.auth.key === "1"){
			this.props.profile(newProps.auth.data.id);
            this.props.navigation.navigate('drawerNavigation');
        }
        
        if (newProps.auth !== null) {
			Toast.show({
				text: newProps.auth.massage,
				type: newProps.auth.key === "1" ? "success" : "danger",
				duration: 3000
			});
        }

		this.setState({ loader: false });
    }

    validate = () => {
        let isError = false;
        const errors = {
            phoneError: "",
            passwordError: ""
        };

        if (this.state.password.length <= 0) {
            isError = true;
            errors.passwordError = 'كلمة المرور اقل من 6 احرف';
        }

        if (this.state.phone.length <= 0 || this.state.phone.length !== 10) {
            isError = true;
            errors.phoneError = 'الرجاء ادخال رقم الهاتف الصحيح';
        }

        this.setState({
            ...this.state,
            ...errors
        });

        console.log(isError);
        return isError;
    };


    renderLoading(){
        if (this.state.loader){
            return(<Spinner />);
        }

        return (
            <Button block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} onPress={() => { this.onLoginPressed()  }} primary>
                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>دخول</Text>
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
                                    borderBottomColor: this.state.phoneError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start'
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 25}} name={'phone'} type={'FontAwesome'}/>
                                    <Input keyboardType='phone-pad' autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(phone) => this.setState({phone})} style={{ alignSelf: 'flex-end', textAlign: 'right', color: '#277c19' }} placeholder='رقم الهاتف' value={this.state.phone}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.phoneError}</Text>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: this.state.passwordError === '' ? '#ddd' : '#ff0000',
                                    padding: 3
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 25}} name={'lock'} type={'FontAwesome'}/>
                                    <Input style={{ textAlign: 'right', color: '#277c19' }} autoCapitalize='none' onChangeText={(password) => this.setState({password})} secureTextEntry placeholder='الرقم السري' value={this.state.password}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.passwordError}</Text>
                                <View style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
                                    <Text style={{ color: '#8c8c8c', marginBottom: 10, textDecorationLine: "underline" }}>هل نسيت كلمة المرور ؟</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('signUp')}>
                                        <Text style={{ color: '#8c8c8c', textDecorationLine: "underline" }}> لا تمتلك حساب ؟</Text>
                                    </TouchableOpacity>
                                </View>
                                {this.renderLoading()}
                            </View>
                        </Form>
                    </KeyboardAvoidingView>
                    <Image resizeMode={'cover'} style={{ width: '100%', height: 140, bottom: -6, position: 'absolute' }} source={require('../../assets/images/Vector_Smart_Object.png')}/>
                </Content>
            </Container>
        )
    }
}



const mapStateToProps = ({ auth }) => {
    return {
        loading: auth.loading,
        auth: auth.user,
    };
};
export default connect(mapStateToProps, { userLogin, profile })(Login);