import React, { Component } from 'react';
import {View, Text, Image, Animated, TouchableOpacity, BackHandler} from 'react-native';
import { Button, Icon, Container, Header, Right, Body, ListItem, List, Left } from 'native-base';
import { MapView, Location, Permissions, Notifications } from 'expo'
import { DoubleBounce } from 'react-native-loader';
import CONST from "../consts";
import axios from "axios/index";
import {connect} from "react-redux";


class TestLocation extends Component{
    constructor(props){
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(-240),
            availabel: 0,
            userLocation: [],
            initMap: true,
            binsLocations: [],
            routeName: this.props.navigation.state.routeName
        }
    }

    static navigationOptions = () => ({
        drawerLabel: 'الرئيسية',
        drawerIcon: ( <Icon style={{ fontSize: 20, color: '#437c1a' }} type={'FontAwesome'} name={'home'}/> )
    });

    renderLoader(){
        console.log('init map ..', this.state.initMap, this.state.binsLocations, this.state.userLocation);
        if (this.state.initMap || this.state.binsLocations === []){
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 500 }}>
                    <DoubleBounce size={20} color="#437c1a" />
                </View>
            );
        }

        return (
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: this.state.userLocation.latitude,
                    longitude: this.state.userLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <MapView.Marker
                    image={require('../../assets/images/maps-and-flags.png')}
                    coordinate={{ latitude: this.state.userLocation.latitude, longitude: this.state.userLocation.longitude }}
                    title={'موقعك الحالي'}
                />
                {

                    this.state.binsLocations.map((location, i) => (<MapView.Marker key={i} coordinate={{ latitude: Number(location.lat), longitude: Number(location.lng) }}/>))
                }
            </MapView>
        );
    }

    setAnimate(){
        if (this.state.availabel === 0){
            Animated.timing(
                this.state.fadeAnim,
                {
                    toValue: 0,
                    duration: 1200,
                },
            ).start();
            this.setState({ availabel: 1 });
        }else {
            Animated.timing(
                this.state.fadeAnim,
                {
                    toValue: -240,
                    duration: 1200,
                },
            ).start();
            this.setState({ availabel: 0 });
        }
    }

    componentWillMount = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        }else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const userLocation = { latitude, longitude };
            this.setState({  initMap: false, userLocation });
        }

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
        this.setState({ token })

        axios.post(CONST.url + 'show/map/data', { user_id: this.props.auth.data.id, lat: this.state.userLocation.latitude, lng: this.state.userLocation.longitude }).then(response => {
            this.setState({ binsLocations: response.data.data.other_data });
        });


        console.log(this.props.user, this.props.auth)
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        Notifications.addListener(this.handleNotification);
    }

    handleNotification = (notification) => {
        console.log(notification);

        if (notification && notification.origin !== 'received') {
            const { data } = notification;
            const orderId = data.id;

            if (data.type && data.type === 'order') {
                this.props.navigation.navigate('newOrder', { orderId });
            }else if(data.type && data.type === 'offer'){
                console.log('this is order id', orderId);
                this.props.navigation.navigate('finishOrder', { orderId });
            }
        }
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
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


    render() {
        return(
            <Container>
                <Header style={{ height: 70, backgroundColor: '#437c1a', paddingTop: 15 }}>
                    <Right style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' type='Entypo' style={{ color: '#fff', fontSize: 30, marginTop: 5 }} />
                        </Button>
                    </Right>
                    <Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 25, fontSize: 18 }}>الرئيسية</Text>
                    </Body>
                    <Right style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate('notification')}>
                            <Icon name='ios-notifications' type='Ionicons' style={{ color: '#fff', fontSize: 30, marginTop: 5 }} />
                        </Button>
                    </Right>
                </Header>
                { this.renderLoader() }
                <Animated.View style={{ backgroundColor: '#fff', position: 'absolute', bottom: this.state.fadeAnim, width: '100%' }}>
                    <Button onPress={() => this.setAnimate()} block style={{ backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}}>
                        <Image style={{ width: 20, height: 20, bottom: 30, position: 'absolute' }} source={this.state.availabel === 0 ? require('../../assets/images/arrow.png') : require('../../assets/images/down_arrow.png')}/>
                        <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>{ this.state.availabel === 0 ? 'اطلب الان' : 'عرض الخدمات' }</Text>
                    </Button>
                    <List style={{ flex: 2, marginTop: 20, marginBottom: 20 }}>
                        <ListItem style={{height: 50}} onPress={() => this.props.navigation.navigate('brands', {navigation: this.props.navigation, type: 1})}>
                            <Left>
                                <View style={{ borderRadius: 30, backgroundColor: '#437c1a', height: 40, width: 40, paddingTop: 5 }}>
                                    <Icon type={'Ionicons'} name={'ios-settings'} style={{color: '#fff', fontSize: 30, width: 33 }}/>
                                </View>
                                <Text style={{ color: '#5b5b5b', marginTop: 8, fontSize: 18, marginLeft: 15, marginRight: 4, height: 22 }}>الصيانة</Text>
                            </Left>
                        </ListItem>
                        <ListItem style={{ height: 50 }} onPress={() => this.props.navigation.navigate('brands', {navigation: this.props.navigation, type: 2})}>
                            <Left>
                                <View style={{ borderRadius: 20, backgroundColor: '#437c1a', height: 40, width: 40, paddingTop: 5  }}>
                                    <Icon type={'Entypo'} name={'mobile'} style={{ color: '#fff', fontSize: 27, width: 33 }}/>
                                </View>
                                <Text style={{ color: '#5b5b5b', marginTop: 8, fontSize: 18, marginLeft: 15, marginRight: 4, height: 22 }}>شراء جوال</Text>
                            </Left>
                        </ListItem>
                        <ListItem style={{ height: 50 }} onPress={() => this.props.navigation.navigate('brands', {navigation: this.props.navigation, type: 3})}>
                            <Left>
                                <View style={{ borderRadius: 20, backgroundColor: '#437c1a', height: 40, width: 40, paddingTop: 5  }}>
                                    <Icon type={'MaterialCommunityIcons'} name={'cellphone-screenshot'} style={{ color: '#fff', fontSize: 27, width: 33 }}/>
                                </View>
                                <Text style={{ color: '#5b5b5b', marginTop: 8, fontSize: 18, marginLeft: 15, marginRight: 4, height: 22 }}>اكسسوارات للجوال</Text>
                            </Left>
                        </ListItem>
                        <ListItem style={{ height: 50 }} onPress={() => this.props.navigation.navigate('simCards', {navigation: this.props.navigation, type: 4})}>
                            <Left>
                                <View style={{ borderRadius: 20, backgroundColor: '#437c1a', height: 40, width: 40, paddingTop: 5  }}>
                                    <Icon type={'MaterialIcons'} name={'sim-card'} style={{ color: '#fff', fontSize: 27, width: 33 }}/>
                                </View>
                                <Text style={{ color: '#5b5b5b', marginTop: 8, fontSize: 18, marginLeft: 15, marginRight: 4, height: 22 }}>شرائح بيانات الانترنت</Text>
                            </Left>
                        </ListItem>
                    </List>
                </Animated.View>
            </Container>
        )
    }
}

const mapStateToProps = ({ auth, profile }) => {
    return {
        auth: auth.user,
        user: profile.user
    };
};


export default connect(mapStateToProps)(TestLocation);