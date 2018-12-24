import React, { Component } from 'react';
import {View, Text, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, List, ListItem, CheckBox, Input, Form, Toast } from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';
import {connect} from "react-redux";
import Services from "./Services";
import {Spinner} from "../common";
import { ImagePicker } from 'expo';
import Modal from "react-native-modal"
import { MapView, Location } from 'expo'
import { updateProfile } from '../actions/ProfileAction'



const height = Dimensions.get('window').height;
class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: this.props.profile.name,
            city: this.props.profile.city,
            email: this.props.profile.email,
            phone: this.props.profile.phone,
            password: null,
            confirmPassword: null,
            loader: false,
			userImage: null,
			mapModal: null,
			query: '',
			searchResult: null,
			selectedLocation: null,
			userLocation: [],
			initMap: true,
			showToast: false,
            base64: null,
			mob_maintenance: this.props.profile.mob_maintenance,
			mob_seller: this.props.profile.mob_seller,
			accessories_seller: this.props.profile.accessories_seller,
			sim_card: this.props.profile.sim_card,
			lat: this.props.profile.lat,
			lng: this.props.profile.lng,
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null
    });

    renderProviderServices(){
        if (this.props.profile.provider == 1){
            return (
				<View>
					<View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
						<Icon type={'Entypo'} name={'tools'} style={{ color: '#82b37d', marginRight: 5, top: 3 }}/>
						<Text style={{ color: '#82b37d', textAlign: 'center' }}>الخدمات التي ترغب في تقديمها</Text>
					</View>

					<List>
						<ListItem onPress={() => this.state.mob_maintenance ? this.setState({ mob_maintenance: false }) : this.setState({ mob_maintenance: true })} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
							<Left style={{ flex: 1 }}>
								<Icon type={'Ionicons'} name={'ios-settings'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
								<Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>صيانة</Text>
							</Left>
							<Right style={{ flex: 1 }}>
								<CheckBox style={{ borderRadius: 3, paddingRight: 2 }} checked={this.state.mob_maintenance} onPress={() => this.state.mob_maintenance ? this.setState({ mob_maintenance: false }) : this.setState({ mob_maintenance: true })} color="#437c1a"/>
							</Right>
						</ListItem>

						<ListItem onPress={() => this.state.mob_seller ? this.setState({ mob_seller: false }) : this.setState({ mob_seller: true })} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
							<Left style={{ flex: 1 }}>
								<Icon type={'Entypo'} name={'mobile'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
								<Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>بيع جولات</Text>
							</Left>
							<Right style={{ flex: 1 }}>
								<CheckBox style={{ borderRadius: 3, paddingRight: 2 }} checked={this.state.mob_seller } onPress={() => this.state.mob_seller ? this.setState({ mob_seller: false }) : this.setState({ mob_seller: true })} color="#437c1a"/>
							</Right>
						</ListItem>

						<ListItem onPress={() => this.state.accessories_seller ? this.setState({ accessories_seller: false }) : this.setState({ accessories_seller: true })} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
							<Left style={{ flex: 1 }}>
								<Icon type={'MaterialCommunityIcons'} name={'cellphone-screenshot'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
								<Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>بيع اكسسوارات</Text>
							</Left>
							<Right style={{ flex: 1 }}>
								<CheckBox style={{ borderRadius: 3, paddingRight: 2 }} checked={this.state.accessories_seller} onPress={() => this.state.accessories_seller ? this.setState({ accessories_seller: false }) : this.setState({ accessories_seller: true })} color="#437c1a"/>
							</Right>
						</ListItem>

						<ListItem onPress={() => this.state.sim_card ? this.setState({ sim_card: false }) : this.setState({ sim_card: true }) } noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
							<Left style={{ flex: 1 }}>
								<Icon type={'MaterialIcons'} name={'sim-card'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
								<Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>شرائح بيانات</Text>
							</Left>
							<Right style={{ flex: 1 }}>
								<CheckBox style={{ borderRadius: 3, paddingRight: 2 }} checked={this.state.sim_card} onPress={() => this.state.sim_card ? this.setState({ sim_card: false}) : this.setState({ sim_card: true }) } color="#437c1a"/>
							</Right>
						</ListItem>
					</List>
				</View>
			);
        }
    }

	_pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [4, 3],
			base64: true,
		});

		if (!result.cancelled) {
			this.setState({ userImage: result.uri, base64: result.base64 });
		}
	};

	renderLoading(){
		if (this.state.loader){
			return(<Spinner />);
		}

		if (this.state.name === '' || this.state.phone === '' || this.state.city === '' ){
			return (
				<Button block disabled style={{marginTop: 20, marginBottom: 20, width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} light>
					<Text style={{color: '#999', fontSize: 17, textAlign: 'center' }}>تعديل</Text>
				</Button>
			);
		}

		return (
			<Button block style={{marginTop: 20, marginBottom: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} onPress={() => { this.signUp()  }}>
				<Text style={{color: '#fff', fontSize: 17, textAlign: 'center' }}>تعديل</Text>
			</Button>
		);
	}

	async componentDidMount(){
		const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
		const userLocation = { latitude, longitude };
		this.setState({  initMap: false, userLocation });

		console.log(this.state.userLocation.latitude, this.state.userLocation.longitude);
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
			name: item.name,
			address: item.formatted_address,
			latitude: location.lat,
			longitude: location.lng
		};

		this.setState({ searchResult: null, selectedLocation: formattedItem, btnDisabled: false, city: formattedItem.name, lat: formattedItem.latitude, lng: formattedItem.longitude  });

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
		if (this.state.password !== null && this.state.password.length < 6) {
			msg = 'كلمة المرور اقل من ٦ احرف';
		}else if ( this.state.email !== '' && this.state.email !== null && this.state.email.indexOf("@") === -1){
			msg = 'البريد الالكتروني غير صحيح' ;
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

		const data = {
			id: this.props.profile.id,
			name: this.state.name,
			phone: this.state.phone === this.props.profile.phone ? null : this.state.phone,
			password: this.state.password,
			city: this.state.city,
			lat: this.state.lat,
			lng: this.state.lng,
			image: this.state.base64,
			email: this.state.email === this.props.profile.email ? null : this.state.email,
			device_id: null,
			mob_maintenance: this.state.mob_maintenance,
			mob_seller: this.state.mob_seller,
			accessories_seller: this.state.accessories_seller,
			sim_card: this.state.sim_card
		};

		this.setState({ loader: true });
		this.props.updateProfile(data);

	}

	componentWillReceiveProps(newProps){
		this.setState({ loader: false });
	}

    render(){
        const data = this.props.profile;
		let { userImage } = this.state;

		console.log(data);

        return(
            <Container>
                <Header style={{ height: 70, backgroundColor: '#437c1a', paddingTop: 15 }}>
                    <Right style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' style={{ color: '#fff', fontSize: 30, marginTop: 8, left: -10 }} />
                        </Button>
                    </Right>
                    <Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>الملف الشخصي</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content style={{ padding: 10 }}>
                    <View>
						<TouchableOpacity onPress={this._pickImage} style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 55, padding: 3, width: 100, height: 100, alignSelf: 'center', marginBottom: 20 }}>
							{userImage != null ? <Image source={{ uri: userImage }} style={{ width: 100, height: 100, marginTop: 20, borderRadius: 80, borderWidth: 1, borderColor: '#f4f4f4', marginBottom: 20 }} /> : <Image onPress={this._pickImage} source={{ uri: data.image }} style={{ height: 100, width: 100, alignSelf: 'center' ,marginTop: 20, borderRadius: 80, borderWidth: 1, borderColor: '#f4f4f4', marginBottom: 20 }}/> }
						</TouchableOpacity>

                        <View>
                            <Form>
                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                    <Text style={{ flex: 2 }}>الاسم :</Text>
                                    <Input onChangeText={(name) => this.setState({name})} value={this.state.name} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                </View>

                                <View style={{ flexDirection: 'row', marginBottom: 10 }} >
                                    <Text style={{ flex: 2 }}>المدينة :</Text>
									<TouchableOpacity style={{ flex: 4 }} onPress={() => this.setState({ mapModal: 1 })}>
										<Input disabled onChangeText={(city) => this.setState({city})} value={this.state.city} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, width: '100%' }}/>
									</TouchableOpacity>
                                </View>

								<View style={{ flexDirection: 'row', marginBottom: 10 }}>
									<Text style={{ flex: 2 }}>الهاتف :</Text>
									<Input onChangeText={(phone) => this.setState({phone})} value={this.state.phone} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
								</View>

                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                    <Text style={{ flex: 2 }}>الايميل :</Text>
                                    <Input onChangeText={(email) => this.setState({email})} value={this.state.email} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                </View>

                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                    <Text style={{ flex: 2 }}>كلمة المرور :</Text>
                                    <Input secureTextEntry onChangeText={(password) => this.setState({password})} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                </View>

                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                    <Text style={{ flex: 2 }}>تأكيد كلمة المرور :</Text>
                                    <Input secureTextEntry onChangeText={(confirmPassword) => this.setState({confirmPassword})} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                </View>
                            </Form>

                            { this.renderProviderServices() }

                            { this.renderLoading() }
                        </View>

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
												<Input onChangeText={(query) => this.setState({ query })} onSubmitEditing={() => this.search()} style={{ width: '100%', paddingBottom: 20 }} placeholderStyle={{ color: '#d4d4d4' }} placeholder='حدد موقعك'/>
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
                    </View>
                </Content>
            </Container>
        )
    }
}


const mapStateToProps = ({ profile }) => {
    return {
		profile: profile.user
    };
};

export default connect(mapStateToProps, { updateProfile })(Profile);