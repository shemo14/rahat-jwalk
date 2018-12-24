import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left } from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';
import Communications from 'react-native-communications';
import Modal from "react-native-modal";
import {connect} from "react-redux";

class VendorDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            visibleModal: null,
            setRateValue: 1,
            orderId: this.props.navigation.state.params.order_id,
            vendorData: this.props.navigation.state.params.offer,
            rate: this.props.navigation.state.params.offer.provider_rate
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    onSetRate(){
        this.setState({ visibleModal: null });
        axios.post(CONST.url + 'store/rate', {
            user_id: this.props.auth.data.id,
            rate: this.state.setRateValue,
            provider_id: this.state.vendorData.provider_id,
        }).then(response => this.setState({ rate: response.data.rate }))
    }

    onAcceptProvider(){
        axios.post(CONST.url + 'choose/provider', {
            order_id: this.state.orderId,
            offer_id: this.state.vendorData.id,
        }).then(response => {
            this.props.navigation.navigate('acceptOffer');
        })
    }

    render(){
        return(
            <Container>
                <Header style={{ height: 70, backgroundColor: '#437c1a', paddingTop: 15 }}>
                    <Right style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' style={{ color: '#fff', fontSize: 30, marginTop: 8, left: -10 }} />
                        </Button>
                    </Right>
                    <Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>تفاصيل الفني</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate('chooseOffer')}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content>
                    <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => Communications.phonecall(this.state.vendorData.provider_phone, false)} style={{ width: 50, height: 50, backgroundColor: '#f4f3f3', borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 75, marginHorizontal: 30 }}>
                                <Icon style={{ color: '#437c1a' }} type={'FontAwesome'} name={'volume-control-phone'}/>
                            </TouchableOpacity>
                            <Image source={{ uri: this.state.vendorData.provider_image }} style={{ height: 100, width: 100, marginTop: 50, borderRadius: 80, borderWidth: 1, borderColor: '#f4f4f4' }}/>
                            <TouchableOpacity onPress={() => Communications.email(this.state.vendorData.provider_email, null, null, null, null)} style={{ width: 50, height: 50, backgroundColor: '#f4f3f3', borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 75, marginHorizontal: 30 }}>
                                <Icon style={{ color: '#437c1a' }} type={'MaterialIcons'} name={'email'}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#f6f6f6', borderRadius: 5, height: 40, width: 200, alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                                <Text style={{ color: '#989899', fontSize: 20 }}>{ this.state.vendorData.provider_name }</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 25 }}>
                                <Icon type={'FontAwesome'} name={'star'} style={{ color: this.state.rate >= 1 ? '#eebc47' : '#6a6a6a', fontSize: 20 }}/>
                                <Icon type={'FontAwesome'} name={'star'} style={{ color: this.state.rate >= 2 ? '#eebc47' : '#6a6a6a', fontSize: 20 }}/>
                                <Icon type={'FontAwesome'} name={'star'} style={{ color: this.state.rate >= 3 ? '#eebc47' : '#6a6a6a', fontSize: 20 }}/>
                                <Icon type={'FontAwesome'} name={'star'} style={{ color: this.state.rate >= 4 ? '#eebc47' : '#6a6a6a', fontSize: 20 }}/>
                                <Icon type={'FontAwesome'} name={'star'} style={{ color: this.state.rate >= 5 ? '#eebc47' : '#6a6a6a', fontSize: 20 }}/>
                            </View>
                            <View style={{ width: '100%' }}>
                                <View style={{ flexDirection: 'row', backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eae9ec', borderRadius: 5, height: 35, width: '100%', padding: 5, justifyContent: 'center', marginBottom: 10 }}>
                                    <Text style={{ flex: 1.5, color: '#74a66e', fontSize: 18 }}>الخدمة :</Text>
                                    <Text style={{ flex: 4, textAlign: 'center', color: '#7f7f80', fontSize: 18 }}>{ this.state.vendorData.type_text }</Text>
                                </View>

                                <View style={{ flexDirection: 'row', backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eae9ec', borderRadius: 5, height: 35, width: '100%', padding: 5, justifyContent: 'center', marginBottom: 10 }}>
                                    <Text style={{ flex: 1.5, color: '#74a66e', fontSize: 18 }}>المبلغ :</Text>
                                    <Text style={{ flex: 4, textAlign: 'center', color: '#7f7f80', fontSize: 18 }}>{ this.state.vendorData.price } ريال</Text>
                                </View>

                                <View style={{ flexDirection: 'row', backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eae9ec', borderRadius: 5, height: 35, width: '100%', padding: 5, justifyContent: 'center', marginBottom: 10 }}>
                                    <Text style={{ flex: 1.5, color: '#74a66e', fontSize: 18 }}>وقت التنفيذ :</Text>
                                    <Text style={{ flex: 4, textAlign: 'center', color: '#7f7f80', fontSize: 18 }}>{ this.state.vendorData.time } يوم</Text>
                                </View>

                                <View style={{ flexDirection: 'row', backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eae9ec', borderRadius: 5, height: 35, width: '100%', padding: 5, justifyContent: 'center', marginBottom: 10 }}>
                                    <Text style={{ flex: 1.5, color: '#74a66e', fontSize: 18 }}>الضمان :</Text>
                                    <Text style={{ flex: 4, textAlign: 'center', color: '#7f7f80', fontSize: 18 }}>{ this.state.vendorData.warranty_time }</Text>
                                </View>

                                <View style={{ flexDirection: 'row', backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eae9ec', borderRadius: 5, height: 35, width: '100%', padding: 5, justifyContent: 'center', marginBottom: 10 }}>
                                    <Text style={{ flex: 3, color: '#74a66e', fontSize: 18 }}>المميزات المجانية :</Text>
                                    <Text style={{ flex: 5, textAlign: 'center', color: '#7f7f80', fontSize: 18 }}>{ this.state.vendorData.notes }</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Modal isVisible={this.state.visibleModal === 1} onBackdropPress={() => this.setState({ visibleModal: null })}>
                        <View style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: 300, borderColor: 'rgba(0, 0, 0, 0.1)', }}>
                            <Header style={{ backgroundColor: '#437c1a', alignItems: 'center', width: '100%', height: 40, top: -8, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
                                <Body style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 20 }}>قيمني</Text>
                                </Body>
                            </Header>
                            <View style={{ alignItems: 'center' }}>
                                <Image source={{ uri: this.state.vendorData.provider_image }} style={{ height: 90, width: 90, borderRadius: 80, borderWidth: 1, borderColor: '#f4f4f4', marginTop: 10 }}/>
                                <View style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#f6f6f6', borderRadius: 5, height: 40, width: 200, alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 10 }}>
                                    <Text style={{ color: '#989899', fontSize: 20 }}>{ this.state.vendorData.provider_name }</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 10 }}>
                                    <Icon onPress={() => this.setState({ setRateValue: 1 })} type={'FontAwesome'} name={'star'} style={{ color: this.state.setRateValue >= 1 ? '#eebc47' : '#6a6a6a', fontSize: 30 }}/>
                                    <Icon onPress={() => this.setState({ setRateValue: 2 })} type={'FontAwesome'} name={'star'} style={{ color: this.state.setRateValue >= 2 ? '#eebc47' : '#6a6a6a', fontSize: 30 }}/>
                                    <Icon onPress={() => this.setState({ setRateValue: 3 })} type={'FontAwesome'} name={'star'} style={{ color: this.state.setRateValue >= 3 ? '#eebc47' : '#6a6a6a', fontSize: 30 }}/>
                                    <Icon onPress={() => this.setState({ setRateValue: 4 })} type={'FontAwesome'} name={'star'} style={{ color: this.state.setRateValue >= 4 ? '#eebc47' : '#6a6a6a', fontSize: 30 }}/>
                                    <Icon onPress={() => this.setState({ setRateValue: 5 })} type={'FontAwesome'} name={'star'} style={{ color: this.state.setRateValue === 5 ? '#eebc47' : '#6a6a6a', fontSize: 30 }}/>
                                </View>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Button style={{ padding: 5, alignSelf: 'center', width: 60, justifyContent: 'center', height: 35, marginTop: 10, borderColor: '#437c1a' }} bordered onPress={() => this.onSetRate()}>
                                    <Text style={{ color: '#437c1a' }}>قيم</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                </Content>
                <View style={{ padding: 10 }}>
                    <Button block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 20}} onPress={() => this.onAcceptProvider()}>
                        <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>الموافقة علي العرض</Text>
                    </Button>

                    <Button block style={{marginTop: 10, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 20}} onPress={() => this.setState({ visibleModal: 1 })}>
                        <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>قيمني</Text>
                    </Button>
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
export default connect(mapStateToProps)(VendorDetails);