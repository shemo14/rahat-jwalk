import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Image, TouchableOpacity, ImageBackground, BackHandler } from 'react-native';
import { Container, Button, Content, Form, Item, Input, Icon, Toast } from 'native-base';
import { Spinner } from '../common'
import { connect } from 'react-redux';
import { userLogin, profile } from '../actions'
import { Permissions, Notifications } from 'expo';



class Login extends Component{
    constructor(props){
        super(props);
        this.state= {
          phone: '',
          password: '',
          passwordError: '',
          token: '',
          phoneError: '',
          showToast: false,
          userId: null
        };

    }


    onLoginPressed() {
		console.log(this.state.userId);

		// alert(this.state.token);

        const err = this.validate();
        if (!err){
            this.setState({ loader: true });
            const {phone, password } = this.state;
            const token = '111111';
            this.props.userLogin({ phone, password, token });
        }

    }


    componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress = () => {
		if (this.state.routeName === 'home'){
			BackHandler.exitApp();
			return true
		}else
			this.goBack();
	};

	goBack(){
		this.props.navigation.goBack();
	}


	async componentWillMount() {

		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);
		let finalStatus = existingStatus;

		if (existingStatus !== 'granted') {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}


		if (finalStatus !== 'granted') {
			return;
		}

		let token = await Notifications.getExpoPushTokenAsync();
		this.setState({ token, userId: null });

		// alert(token);

	}

	componentWillReceiveProps(newProps){
        if (newProps.auth !== null && newProps.auth.key === "1"){

            if (this.state.userId === null){
				this.setState({ userId: newProps.auth.data.id });
				this.props.profile(newProps.auth.data.id);
            }

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
            <Button block style={{ position: 'absolute', backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} onPress={() => { this.onLoginPressed()  }} primary>
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
                            <Image resizeMode={'contain'} style={{width: 150, height: 150}} source={require('../../assets/images/logo.png')}/>
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
                                <View style={{justifyContent: 'center', alignItems: 'center', margin: 5}}>
                                    <Text onPress={() => this.props.navigation.navigate('forgetPassword')} style={{ color: '#8c8c8c', marginBottom: 10, textDecorationLine: "underline" }}>هل نسيت كلمة المرور ؟</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('signUp')}>
                                        <Text style={{ color: '#8c8c8c', textDecorationLine: "underline", marginBottom: 10 }}> لا تمتلك حساب ؟</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('drawerNavigation')}>
                                        <Text style={{ color: '#8c8c8c', textDecorationLine: "underline" }}> الدخول كزائر</Text>
                                    </TouchableOpacity>
                                </View>

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
export default connect(mapStateToProps, { userLogin, profile })(Login);