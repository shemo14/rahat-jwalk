import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Image, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { Container, Button, Content, Form, Item, Input, Icon, Header, Body, List, ListItem, Toast } from 'native-base';
import { Spinner } from '../common'
import { Font } from 'expo'
import Modal from "react-native-modal"
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader'
import { MapView, Location, Permissions, Notifications } from 'expo'
import { userLogin, profile } from '../actions'
import { connect } from 'react-redux';

const height = Dimensions.get('window').height;
class SignUp extends Component{
    constructor(props){
        super(props);
        this.loadFontAsync();
        this.state= {
            name: '',
            phone: '',
            email: null,
            password: '',
            lat: '',
            lng: '',
            city: '',
            confirmPassword: '',
            fontLoaded: false,
            visibleModal: null,
            roles: '',
            mapModal: null,
            query: '',
            searchResult: null,
            selectedLocation: null,
            userLocation: [],
            initMap: true,
            loader: false,
			showToast: false,
            token: '',
			userId: null
        };
    }

    async locationPermission(){
		await Permissions.askAsync(Permissions.LOCATION);

		const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
		const userLocation = { latitude, longitude };
		this.setState({  initMap: false, userLocation });
        console.log(this.state.userLocation.longitude + ' - ' + this.state.userLocation.longitude);

		await this.setState({mapModal: 1});
    }

    componentWillMount = async () => {
        axios.post(CONST.url + 'condition').then(response => {
            this.setState({ roles: response.data.data })
        })

		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			alert('صلاحيات تحديد موقعك الحالي ملغاه');
		}else {
			const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
			const userLocation = { latitude, longitude };
			this.setState({  initMap: false, userLocation });

        }


		let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
		getCity += this.state.userLocation.latitude + ',' + this.state.userLocation.longitude;
		getCity += '&key=AIzaSyBPftOQyR7e_2mv9MRu-TeNoW2qaOEK0fw&language=ar&sensor=true';


		try {
			const { data } = await axios.get(getCity);
			this.setState({ city: data.results[0].formatted_address });

		} catch (e) {
			console.log(e);
		}

		const formattedItem = {
			name: this.state.city,
			address: this.state.city,
			latitude: this.state.userLocation.latitude,
			longitude: this.state.userLocation.longitude
		};

		this.setState({ selectedLocation: formattedItem });

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
		this.setState({ token, userId: null })
    }



    setModalVisible() {
        this.locationPermission();
    }


    loadFontAsync(){
        Font.loadAsync({ JFlat: require('../../assets/fonts/Quicksand-Regular.ttf') })
            .then(() => this.setState({ fontLoaded: true }))
            .catch((e) => console.log(e));
    }


    renderLoading(){
        if (this.state.loader){
            return(<Spinner />);
        }
        
        if (this.state.name === '' || this.state.phone === '' || this.state.selectedLocation === null || this.state.password === '' || this.state.confirmPassword === ''){
			return (
				<Button block disabled style={{position: 'absolute', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} light>
					<Text style={{color: '#999', fontSize: 17, textAlign: 'center', fontFamily: 'JFlat' }}>التسجيل</Text>
				</Button>
			);
        }

        return (
            <Button block style={{position: 'absolute', backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} onPress={() => { this.signUp()  }}>
                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center', fontFamily: 'JFlat' }}>التسجيل</Text>
            </Button>
        );
    }

    async componentDidMount(){
        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
        const userLocation = { latitude, longitude };
        this.setState({  initMap: false, userLocation });

    }

    search = async () => {

        let endPoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=';
        endPoint += this.state.query;
        endPoint += '&key=AIzaSyBPftOQyR7e_2mv9MRu-TeNoW2qaOEK0fw&language=ar';

        try {
            const { data } = await axios.get(endPoint);
            this.setState({ searchResult: data.results });
            console.log(this.state.searchResult)
        } catch (e) {
            console.log(e);
        }
    };

    toggleSearchResult() {
        if (!this.state.searchResult) return;

        return (
            <ScrollView style={{ backgroundColor: '#fff', maxHeight: 200, marginBottom: 20, position: 'absolute', width: '88%', top: 35, left: 40, zIndex: 99999999999 }}>
                <List containerStyle={{ marginHorizontal: 15 }}>
                    {
                        this.state.searchResult.map((item, i) => (
                            <ListItem
                                style={{ paddingHorizontal: 5 }}
                                key={i}
                                onPress={this.setSelectedLocation.bind(this, item)}
                            >
                                <Icon style={{ color: '#ddd', fontSize: 22, marginRight: 5, marginTop: 5 }} type={'Entypo'} name={'location-pin'}/>
                                <Body>
                                <Text>{item.name}</Text>
                                <Text style={{ color: '#999' }}>{item.formatted_address}</Text>
                                </Body>
                            </ListItem>
                        ))
                    }
                </List>
            </ScrollView>
        );
    }

    setSelectedLocation(item) {
        const { geometry: { location } } = item;

        const formattedItem = {
            name: item.formatted_address,
            address: item.formatted_address,
            latitude: location.lat,
            longitude: location.lng
        };

        this.setState({ searchResult: null, selectedLocation: formattedItem, btnDisabled: false });

        this.map.animateToRegion(
            {
                latitude: formattedItem.latitude,
                longitude: formattedItem.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            350
        );
    }

    showMapMarker() {
        if (!this.state.selectedLocation){
            const { latitude, longitude } = this.state.userLocation;
            return (
                <MapView.Marker
                    title={'موقعك الحالي'}
                    image={require('../../assets/images/maps-and-flags.png')}
                    coordinate={{ latitude, longitude }}
                />
            );
        }

        const { latitude, longitude, name } = this.state.selectedLocation;
        return (
            <MapView.Marker
                title={name}
                image={require('../../assets/images/maps-and-flags.png')}
                coordinate={{ latitude, longitude }}
            />
        );
    }


    renderLoader(){
        if (this.state.initMap){
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 500 }}>
                    <DoubleBounce size={20} color="#437c1a" />
                </View>
            );
        }

        return (
            <MapView
                ref={map => this.map = map}
                style={{ flex: 1 }}
                initialRegion={{
					latitude: this.state.userLocation.latitude,
					longitude: this.state.userLocation.longitude,
                    latitudeDelta: 0.422,
                    longitudeDelta: 0.121,
                }}
            >
                { this.showMapMarker() }
            </MapView>
        );
    }

    renderLocationSetter(){
        if (this.state.selectedLocation === [] || this.state.selectedLocation === null){
            return(
                <Button block style={{marginTop: 10, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 5}} onPress={() => this.setState({ mapModal: null }) }>
                    <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>اغلاق</Text>
                </Button>
            );
        }

        return (
            <Button block style={{marginTop: 10, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 5}} onPress={() => this.setState({ mapModal: null }) } primary>
                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
            </Button>
        );
    }

    signUp(){
		let msg = '';
    	if (this.state.password.length < 6) {
    		msg = 'كلمة المرور اقل من ٦ احرف';
		}else if ( this.state.email !== '' && this.state.email !== null && this.state.email.indexOf("@") === -1){
			msg = 'البريد الالكتروني غير صحيح' ;
		}else if ( this.state.phone.length <= 0 || this.state.phone.length !== 10){
			msg = 'الرجاء ادخال رقم الهاتف الصحيح' ;
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

    	// alert(this.state.token);

		this.setState({ loader: true });
        axios.post(CONST.url + 'register' ,{
            name: this.state.name,
            phone: this.state.phone,
            password: this.state.password,
            city: this.state.selectedLocation.name,
            lat: this.state.selectedLocation.latitude,
            lng: this.state.selectedLocation.longitude,
            email: this.state.email,
            device_id: Expo.Constants.deviceId
        }).then(response => {
			this.setState({ loader: false });

			if (response.data.key === '1'){
				const {phone, password, token} = this.state;
				this.props.userLogin({ phone, password, token });
			}

			Toast.show({
				text: response.data.massage,
				type: response.data.key === "1" ? "success" : "danger",
				duration: 3000
			});
		}).catch(e => {
			this.setState({ loader: false });
			Toast.show({
				text: 'يوجد خطأ ما الرجاء المحاولة مرة اخري',
				type: "danger",
				duration: 3000
			});
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

    render(){
        if (!this.state.fontLoaded){
            return ( <View/> );
        }

        return(
            <Container style={{ backgroundColor: '#fff' }}>
                <Content contentContainerStyle={{flexGrow: 1}}>
                        <View style={{justifyContent: 'center', alignItems: 'center' }}>
                            <Image resizeMode={'center'} style={{width: 100, height: 100, marginTop: 30}}
                                   source={require('../../assets/images/logo.png')}/>
                        </View>
                        <Form>
                            <View style={{flex: 2, padding: 20}}>
                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20}} name={'user'} type={'FontAwesome'}/>
                                    <Input autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(name) => this.setState({name})} style={{ alignSelf: 'flex-end' , color: '#277c19', height: 35 }} placeholder='اسم المستخدم' value={this.state.name}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.emailError}</Text>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} name={'phone'} type={'FontAwesome'}/>
                                    <Input keyboardType='phone-pad' placeholderStyle={{ textAlign: 'right' }} onChangeText={(phone) => this.setState({phone})} style={{ alignSelf: 'flex-end' }} placeholder='رقم الهاتف' value={this.state.phone}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.emailError}</Text>


                                <Item onPress={() => this.setModalVisible()} style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} name={'location'} type={'Entypo'}/>
                                    <Input disabled autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} style={{ alignSelf: 'flex-end', color: '#277c19', height: 35 }} placeholder='المدينة' value={ this.state.selectedLocation !== null && this.state.selectedLocation !== [] ? this.state.selectedLocation.name : ''}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.emailError}</Text>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} name={'email'} type={'MaterialCommunityIcons'}/>
                                    <Input autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(email) => this.setState({email})} style={{ alignSelf: 'flex-end', color: '#277c19', height: 35 }} placeholder='البريد الالكتروني (اختياري)' value={this.state.email}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.emailError}</Text>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    padding: 3,
                                    height: 35,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} name={'lock'} type={'FontAwesome'}/>
                                    <Input style={{ textAlign: 'right', color: '#277c19', height: 35 }} autoCapitalize='none' onChangeText={(password) => this.setState({password})} secureTextEntry placeholder='الرقم السري' value={this.state.password}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.passwordError}</Text>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    padding: 3,
                                    height: 35,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} name={'lock'} type={'FontAwesome'}/>
                                    <Input style={{ textAlign: 'right', color: '#277c19', height: 35 }} autoCapitalize='none' onChangeText={(confirmPassword) => this.setState({confirmPassword})} secureTextEntry placeholder='تأكيد الرقم السري' value={this.state.confirmPassword}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.passwordError}</Text>
                                <View style={{justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#8c8c8c', marginBottom: 10, fontFamily: 'JFlat' }}>بالضغط علي تسجيل انت توافق علي <Text onPress={() => this.setState({ visibleModal: 1 }) } style={{ color: '#8c8c8c', fontWeight: 'bold', fontSize: 18, textDecorationLine: "underline" }}>الشروط و الاحكام</Text></Text>
                                    <Text onPress={() => this.props.navigation.navigate('login') } style={{ color: '#8c8c8c', textDecorationLine: "underline" }}>هل تمتلك حساب ؟</Text>
                                </View>
                            </View>
                        </Form>

                    <Modal isVisible={this.state.visibleModal === 1} onBackdropPress={() => this.setState({ visibleModal: null })}>
                        <View style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: (70/100)*height , borderColor: 'rgba(0, 0, 0, 0.1)', }}>
                            <Header style={{ backgroundColor: '#437c1a', alignItems: 'center', width: '100%', height: 40, top: -8, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
                                <Body style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 20 }}>الشروط و الاحكام</Text>
                                </Body>
                            </Header>
                            <ScrollView style={{ flex: 1, padding: 10 }}>
                                <Text style={{ textAlign: 'center', fontSize: 15, lineHeight: 20, marginBottom: 20 }}>{ this.state.roles }</Text>
                            </ScrollView>

                            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '50%', bottom: 10, paddingTop: 10 }}>
                                <Button style={{ padding: 5, alignSelf: 'center', width: 60, justifyContent: 'center', height: 35, marginTop: 10, borderColor: '#437c1a' }} bordered onPress={() => this.setState({ visibleModal: null })}>
                                    <Text style={{ color: '#437c1a' }}>اوافق</Text>
                                </Button>
                                <Button style={{ padding: 5, alignSelf: 'center', width: 60, justifyContent: 'center', height: 35, marginTop: 10, borderColor: '#437c1a' }} bordered onPress={() => this.setState({ visibleModal: null })}>
                                    <Text style={{ color: '#437c1a' }}>لا اوافق</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>

                    <Modal isVisible={this.state.mapModal === 1} onBackdropPress={() => this.setState({ mapModal: null })}>
                        <View style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: (80/100)*height , borderColor: 'rgba(0, 0, 0, 0.1)', }}>
                            <Header style={{ backgroundColor: '#437c1a', alignItems: 'center', width: '100%', height: 40, top: -8, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
                                <Body style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 20 }}>تحديد الموقع</Text>
                                </Body>
                            </Header>

                            <Content style={{ padding: 10 }}>
                                <View style={{ flex: 1, marginTop: 20 }}>
                                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                                        <Text style={{ color: '#747474', marginTop: 5, fontSize: 17 }}>موقعك : </Text>
                                        <View style={{ flexDirection: 'row', backgroundColor: '#f4f4f4', borderWidth: 1, height: 35,borderColor: '#ededed', borderRadius: 5, width: '80%' }}>
                                            <Icon style={{ color: '#4a862f', fontSize: 22, marginRight: 5, marginTop: 5 }} type={'Entypo'} name={'location-pin'}/>
                                            <Input value={this.state.city} onChangeText={(query) => this.setState({ query })} onSubmitEditing={() => this.search()} style={{ width: '100%', paddingBottom: 20 }} placeholderStyle={{ color: '#d4d4d4' }} placeholder='حدد موقعك'/>
                                        </View>
                                        { this.toggleSearchResult() }

                                    </View>
                                    <View style={{ borderColor: '#71a768', borderWidth: 1, width: '100%', height: (54/100)*height }}>
                                        { this.renderLoader() }
                                    </View>
                                </View>
                            </Content>

                            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '50%', bottom: 10, paddingTop: 10 }}>
                                { this.renderLocationSetter() }
                            </View>
                        </View>
                    </Modal>

					<ImageBackground resizeMode={'cover'} style={{ width: '100%', height: 140, bottom: -10, position: 'absolute' }} source={require('../../assets/images/Vector_Smart_Object.png')}>
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
		message: auth.message,
		loading: auth.loading,
		auth: auth.user,
		user: profile.user
	};
};
export default connect(mapStateToProps, { userLogin, profile })(SignUp);