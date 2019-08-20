
import React, { Component } from 'react';
import {View, Text, Image, Animated, ScrollView, Platform} from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, Input, List, ListItem } from 'native-base';
import {MapView, Location, Permissions} from 'expo'
import { DoubleBounce } from 'react-native-loader'
import axios from 'axios';
import CONST from "../consts";
import { Spinner } from '../common'
import { connect } from 'react-redux';


const deviceType = Platform.OS;
class DeterminedLocation extends Component{
    constructor(props){
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(-240),
            availabel: 0,
            checked: false,
            params: this.props.navigation.state.params.params,
            accessoryList: this.props.navigation.state.params.accessoryList,
            query: '',
            searchResult: null,
            selectedLocation: null,
            userLocation: [],
            initMap: true,
            loader: false,
            city: ''
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    async componentWillMount() {

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
        getCity += '&key=AIzaSyDYjCVA8YFhqN2pGiW4I8BCwhlxThs1Lc0&language=ar&sensor=true';

        console.log(getCity);

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
    }

    async componentDidMount(){
        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
        const userLocation = { latitude, longitude };
        this.setState({  initMap: false, userLocation });

        console.log(this.state.userLocation.latitude, this.state.userLocation.longitude);
    }

    search = async () => {

        let endPoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=';
        endPoint += this.state.city;
        endPoint += '&key=AIzaSyDYjCVA8YFhqN2pGiW4I8BCwhlxThs1Lc0';

        console.log(endPoint);

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
            <ScrollView style={{ backgroundColor: '#fff', maxHeight: 200, marginBottom: 20, position: 'absolute', width: deviceType === 'ios' ?'100%' : '88%', top: 35, left:deviceType === 'ios' ?59: 40, zIndex: 99999999999 }}>
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
        if (!this.state.selectedLocation) return;
        const { latitude, longitude, name } = this.state.selectedLocation;
        return (
            <MapView.Marker
                title={name}
                image={require('../../assets/images/maps-and-flags.png')}
                coordinate={{ latitude, longitude }}
            />
        );
    }

    onLocationSelected() {
        this.setState({ loader: true });
        if (this.props.auth !== null){
            axios.post(CONST.url + 'store/order',
                {
                    user_id: this.props.auth.data.id,
                    company_id: this.state.params.companyId,
                    type: this.state.params.type,
                    lat: this.state.selectedLocation.latitude,
                    lng: this.state.selectedLocation.longitude,
                    city: this.state.selectedLocation.name,
                    problem_desc: this.state.params.desc,
                    image1: this.state.params.image1,
                    image2: this.state.params.image2,
                    service_id: this.state.params.serviceId,
                    notes: this.state.params.notes,
                    color_id: this.state.params.colorId,
                    accessory_id: this.state.accessoryList !== undefined ? this.state.accessoryList.toString() : null,
                    model_id: this.state.params.modelId,
                    problem_id: this.state.params.problemList !== undefined ? this.state.params.problemList.toString() : null,
                }
            ).then(response => {
                this.setState({ loader: false });
                // this.props.navigation.navigate('confirmOrder');
            }).catch(() => this.setState({ loader: false }));

            console.log('cord', this.state.selectedLocation);

            this.props.navigation.navigate('confirmOrder');
        } else
            this.props.navigation.navigate('login')
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
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                { this.showMapMarker() }
            </MapView>
        );
    }

    renderLoading(){
        if (this.state.loader){
            return(<Spinner />);
        }

        if (this.state.selectedLocation === null){
            return (
                <Button disabled block disabled style={{marginTop: 20, marginBottom: 20, width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} light >
                    <Text style={{color: '#999', fontSize: 17, textAlign: 'center' }}>تأكيد</Text>
                </Button>
            );
        }

        return (
            <Button block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 20}} onPress={() => { this.onLocationSelected()  }} primary>
                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
            </Button>
        );
    }

    render(){
        console.log(this.state.params.type);
        let navigate = '';
        if (this.state.params.type === 1)
            navigate = 'problemDesc';
        else if(this.state.params.type === 2 || this.state.params.type === 3 )
            navigate = 'notes';
        else if(this.state.params.type === 4)
            navigate = 'simSize'

        return(
            <Container>
                <Header style={{ height: 70, backgroundColor: '#437c1a', paddingTop: 15 }}>
                    <Right style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' style={{ color: '#fff', fontSize: 30, marginTop: 8, left: -10 }} />
                        </Button>
                    </Right>
                    <Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>تحديد الموقع</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate(navigate)}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content style={{ padding: 10 }}>
                    <View style={{ flex: 1, width: '100%', marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 20 , paddingLeft:deviceType === 'ios' ?5 : 0, paddingRight:deviceType === 'ios' ?8:0 , width:deviceType === 'ios' ?'90%' : 'auto' }}>
                            <Text style={{ color: '#747474', marginTop: 5, fontSize: 17 }}>موقعك : </Text>
                            <View style={{ flexDirection: 'row', backgroundColor: '#f4f4f4', borderWidth: 1, height: 35,borderColor: '#ededed', borderRadius: 5, width: '100%' }}>
                                <Icon style={{ color: '#4a862f', fontSize: 22, marginRight: 5, marginTop: 5 }} type={'Entypo'} name={'location-pin'}/>
                                <Input value={this.state.city} onChangeText={(city) => this.setState({ city })} onSubmitEditing={() => this.search()} style={{ width: '100%', paddingBottom: 20 , textAlign :'right'}} placeholderStyle={{ color: '#d4d4d4' }} placeholder='حدد موقعك'/>
                            </View>
                            { this.toggleSearchResult() }

                        </View>
                        <View style={{ borderColor: '#71a768', borderWidth: 1, width: '100%', height: 500 , marginLeft:deviceType === 'ios' ?10 : 0 , zIndex:deviceType === 'ios' ?-1 : 1 }}>
                            { this.renderLoader() }
                        </View>
                    </View>
                </Content>
                <View style={{ padding: 10 }}>
                    { this.renderLoading() }
                </View>
            </Container>
        )
    }
}


const mapStateToProps = ({ auth }) => {
    return {
        auth: auth.user
    };
};
export default connect(mapStateToProps)(DeterminedLocation);
