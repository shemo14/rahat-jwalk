import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, List, ListItem, Radio } from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';
import {connect} from "react-redux";


const height = Dimensions.get('window').height;
class PreviousOrders extends Component{
    constructor(props){
        super(props);
        this.state = {
            offers: [],
            key: '',
            near: false,
            price: false,
            time: false,
            rate: false,
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null
    });

    componentWillMount(){
        axios.post( CONST.url + 'show/finish/order', { user_id: this.props.auth.data.id }).then(response =>
        {
            let offers = response.data.data.offer_by_time;
            if (this.state.order_by === 1)
                offers = response.data.data.offer_by_near;
            else if(this.state.order_by === 2)
                offers = response.data.data.offer_by_price;
            else if(this.state.order_by === 4)
                offers = response.data.data.offer_by_rate;

            this.setState({
                offers,
                key: response.data.key,
                hours: hours,
                minutes: minutes,
                totalMinutes: response.data.data.total_minutes
            })
        })
    }

    renderLoader(){
        if (this.state.key === ''){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: height, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                    <DoubleBounce size={20} color="#437c1a" />
                </View>
            );
        }
    }


    renderListItems(){
        return this.state.offers.map((offer, i) => (
            <ListItem key={i} style={{ backgroundColor: '#f4f3f3', marginLeft: 0, borderRadius: 15, borderLeftWidth: 5, borderColor: '#4a8c4c', paddingLeft: 10, marginBottom: 10 }}>
                <Body>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#f7f7f7', marginBottom: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#686868' }}>{ offer.provider_name }</Text>
                    <Text style={{ color: '#686868' }}>{ offer.price } ريال</Text>
                    <Text style={{ color: '#686868' }}>{ offer.time } ايام</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#686868' }}>{ offer.provider_rate }</Text>
                        <Icon type={'FontAwesome'} name={'star'} style={{ color: '#eebc47', fontSize: 18, top: 2, marginLeft: 5 }}/>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ alignSelf: 'flex-start', flex: 5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon type={'FontAwesome'} name={'check-square'} style={{ color: '#565656', fontSize: 18, top: 3, marginRight: 5 }}/>
                            <Text style={{ color: '#686868' }}>{ offer.notes }</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', flex: 1 }} onPress={() => this.props.navigation.navigate('vendorDetails', { offer, order_id: this.state.orderId } )}>
                        <Icon type={'Feather'} name={'check-circle'} style={{color: '#44813a', fontSize: 18, top: 3, marginRight: 5}}/>
                        <Text style={{color: '#44813a' }}>قبول</Text>
                    </TouchableOpacity>
                </View>
                </Body>
            </ListItem>
        ));
    }

    selectFillteration(type){
        if (type === 1)
            this.setState({ near: true, price: false, time: false, rate: false, order_by: type, key: '' });
        else if(type === 2)
            this.setState({ near: false, price: true, time: false, rate: false, order_by: type, key: '' });
        else if(type === 3)
            this.setState({ near: false, price: false, time: true, rate: false, order_by: type, key: '' });
        else
            this.setState({ near: false, price: false, time: false, rate: true, order_by: type, key: '' });

        this.componentWillMount()
    }

    render(){
        return(
            <Container>
                <Header style={{ height: 70, backgroundColor: '#437c1a', paddingTop: 15 }}>
                    <Right style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' type='Entypo' style={{ color: '#fff', fontSize: 30, marginTop: 8, left: -10 }} />
                        </Button>
                    </Right>
                    <Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>اختر العرض</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                { this.renderLoader() }
                <Content>
                    <View style={{ padding: 10 }}>
                        <AnimatedCircularProgress
                            size={65}
                            width={2}
                            fill={this.state.fill}
                            tintColor="#437c1a"
                            onAnimationComplete={() => console.log(this.state.fill)}
                            style={{ transform: [{ rotate: '-90deg'}], top: 138, marginBottom: 15 }}
                            backgroundColor="#c9c5c6" >
                            {
                                () => (
                                    <Text style={{ transform: [{ rotate: '90deg'}], color: '#44813a' }}> {this.state.hours}:{this.state.minutes}:{this.state.seconds} </Text>
                                )
                            }
                        </AnimatedCircularProgress>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row' }} >
                                <Radio selected={this.state.near} onPress={() => this.selectFillteration(1)} style={{ marginRight: 5 }} selectedColor='#437c1a' />
                                <Text>الاقرب</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }} >
                                <Radio selected={this.state.price} onPress={() => this.selectFillteration(2)} style={{ marginRight: 5 }} selectedColor='#437c1a'/>
                                <Text>السعر</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }} >
                                <Radio selected={this.state.time} onPress={() => this.selectFillteration(3)} style={{ marginRight: 5 }} selectedColor='#437c1a'/>
                                <Text>المدة</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }} >
                                <Radio selected={this.state.rate} onPress={() => this.selectFillteration(4)} style={{ marginRight: 5 }} selectedColor='#437c1a'/>
                                <Text>التقيم</Text>
                            </View>
                        </View>
                        <List>
                            { this.renderListItems() }
                        </List>
                    </View>
                </Content>
            </Container>
        )
    }
}


const mapStateToProps = ({ auth }) => {
    return {
        auth: auth.user
    };
};

export default connect(mapStateToProps)(PreviousOrders);