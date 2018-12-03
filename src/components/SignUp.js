import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Container, Button, Content, Form, Item, Input, Icon, Header, Body, List, ListItem } from 'native-base';
import { Spinner } from '../common'
import { Font } from 'expo'
import Modal from "react-native-modal"
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader'
import { MapView, Location } from 'expo'

const height = Dimensions.get('window').height;
class SignUp extends Component{
    constructor(props){
        super(props);
        this.loadFontAsync();
        this.state= {
            name: '',
            phone: '',
            email: '',
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
        };
    }

    componentWillMount(){
        axios.post(CONST.url + 'condition').then(response => {
            this.setState({ roles: response.data.data })
        })
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
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

        return (
            <Button block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} onPress={() => { this.onLoginPressed()  }} primary>
                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center', fontFamily: 'JFlat' }}>التسجل</Text>
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
        axios.post(CONST.url + {
            name: this.state,
            phone: this.state,
            password: this.state,
            city: this.state.selectedLocation.name,
            lat: this.state.selectedLocation.latitude,
            lng: this.state.selectedLocation.longitude,
            email: this.state.email,
            device_id: Expo.Constants.deviceId
        })
    }

    render(){
        if (!this.state.fontLoaded){
            return ( <View/> );
        }

        return(
            <Container style={{ backgroundColor: '#fff' }}>
                <Content contentContainerStyle={{flexGrow: 1}}>
                        <View style={{justifyContent: 'center', alignItems: 'center' }}>
                            <Image resizeMode={'center'} style={{width: 100, height: 100, marginTop: 60}}
                                   source={require('../../assets/images/logo.png')}/>
                        </View>
                        <Form>
                            <View style={{flex: 2, padding: 20}}>
                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
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
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} name={'phone'} type={'FontAwesome'}/>
                                    <Input autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(phone) => this.setState({phone})} style={{ alignSelf: 'flex-end' }} placeholder='رقم الهاتف' value={this.state.phone}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.emailError}</Text>


                                <Item onPress={() => this.setState({ mapModal: 1 })} style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} name={'location'} type={'Entypo'}/>
                                    <Input disabled autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(city) => this.setState({city})} style={{ alignSelf: 'flex-end', color: '#277c19', height: 35 }} placeholder='المدينة' value={ this.state.selectedLocation !== null && this.state.selectedLocation !== [] ? this.state.selectedLocation.name : ''}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.emailError}</Text>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
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
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
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
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
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
                                {this.renderLoading()}
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

                    <Image resizeMode={'cover'} style={{ width: '100%', height: 140, bottom: -10, position: 'absolute' }} source={require('../../assets/images/Vector_Smart_Object.png')}/>
                </Content>
            </Container>
        )
    }
}

export default SignUp;