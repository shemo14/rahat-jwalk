import React, { Component } from 'react';
import { View, Text, Image, Animated, TouchableOpacity } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, ListItem, List, Left } from 'native-base';
import { MapView, Location } from 'expo';
import { DoubleBounce } from 'react-native-loader';
import CONST from "../consts";
import axios from "axios/index";
import {connect} from "react-redux";



class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(-240),
            availabel: 0,
            userLocation: [],
            initMap: true,
            binsLocations: []
        }
    }

    static navigationOptions = () => ({
        drawerLabel: 'الرئيسية',
        drawerIcon: ( <Icon style={{ fontSize: 20, color: '#437c1a' }} type={'FontAwesome'} name={'home'}/> )
    });

    renderLoader(){
        if (this.state.initMap || this.state.binsLocations === []){
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 500 }}>
                    <DoubleBounce size={20} color="#437c1a" />
                </View>
            );
        }

        console.log('locations ', this.state.binsLocations, this.state.userLocation);
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
                {/*{*/}
                    {/*this.state.binsLocations.map(location => (<MapView.Marker coordinate={{ latitude: location.lat, longitude: location.lng }}/>))*/}
                {/*}*/}
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



    async componentDidMount(){
        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
        const userLocation = { latitude, longitude };
        this.setState({  initMap: false, userLocation });

        axios.post(CONST.url + 'show/map/data', { user_id: this.props.auth.data.id, lat: this.state.userLocation.latitude, lng: this.state.userLocation.longitude }).then(response => {
            this.setState({ binsLocations: response.data.other_data });
            console.log(response.data);
        });

        console.log(this.state.userLocation.latitude, this.state.userLocation.longitude);
    }

    render(){
        return(
            <Container>
                <Header style={{ height: 70, backgroundColor: '#437c1a', paddingTop: 15 }}>
                    <Right style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' style={{ color: '#fff', fontSize: 30, marginTop: 5 }} />
                        </Button>
                    </Right>
                    <Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: '#fff', textAlign: 'center', marginRight: 25, fontSize: 18 }}>الرئيسية</Text>
                    </Body>
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
                                <View style={{ borderRadius: 30, padding: 5, backgroundColor: '#437c1a', paddingLeft: 9, paddingRight: 9 }}>
                                    <Icon type={'Ionicons'} name={'ios-settings'} style={{color: '#fff', fontSize: 30, width: 23}}/>
                                </View>
                                <Text style={{ color: '#5b5b5b', marginTop: 8, fontSize: 18, marginLeft: 15, marginRight: 4 }}>الصيانة</Text>
                            </Left>
                        </ListItem>
                        <ListItem style={{ height: 50 }} onPress={() => this.props.navigation.navigate('brands', {navigation: this.props.navigation, type: 2})}>
                            <Left>
                                <View style={{ borderRadius: 20, padding: 6, backgroundColor: '#437c1a', paddingLeft: 8, paddingRight: 7  }}>
                                    <Icon type={'Entypo'} name={'mobile'} style={{ color: '#fff', fontSize: 27, width: 25 }}/>
                                </View>
                                <Text style={{ color: '#5b5b5b', marginTop: 8, fontSize: 18, marginLeft: 15, marginRight: 4 }}>شراء جوال</Text>
                            </Left>
                        </ListItem>
                        <ListItem style={{ height: 50 }} onPress={() => this.props.navigation.navigate('brands', {navigation: this.props.navigation, type: 3})}>
                            <Left>
                                <View style={{ borderRadius: 20, padding: 6, backgroundColor: '#437c1a', paddingLeft: 8, paddingRight: 7  }}>
                                    <Icon type={'MaterialCommunityIcons'} name={'cellphone-screenshot'} style={{ color: '#fff', fontSize: 27, width: 25 }}/>
                                </View>
                                <Text style={{ color: '#5b5b5b', marginTop: 8, fontSize: 18, marginLeft: 15, marginRight: 4 }}>اكسسوارات للجوال</Text>
                            </Left>
                        </ListItem>
                        <ListItem style={{ height: 50 }} onPress={() => this.props.navigation.navigate('simCards', {navigation: this.props.navigation, type: 4})}>
                            <Left>
                                <View style={{ borderRadius: 20, padding: 6, backgroundColor: '#437c1a', paddingLeft: 8, paddingRight: 7  }}>
                                    <Icon type={'MaterialIcons'} name={'sim-card'} style={{ color: '#fff', fontSize: 27, width: 25 }}/>
                                </View>
                                <Text style={{ color: '#5b5b5b', marginTop: 8, fontSize: 18, marginLeft: 15, marginRight: 4 }}>شرائح بيانات الانترنت</Text>
                            </Left>
                        </ListItem>
                    </List>
                </Animated.View>
            </Container>
        )
    }

}

const mapStateToProps = ({ auth }) => {
    return {
        auth: auth.user
    };
};


export default connect(mapStateToProps)(Home);