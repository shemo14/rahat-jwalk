import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, List, ListItem, Toast } from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';
import {connect} from "react-redux";
import { AnimatedCircularProgress } from 'react-native-circular-progress';



class FinishedOrder extends Component{
    constructor(props){
        super(props);
        this.state = {
            orders: [],
            key: '',
            showToast: false,
        }
    }

    static navigationOptions = () => ({
        drawerLabel: 'الطلبات المنتهيه',
        drawerIcon: ( <Icon style={{ fontSize: 20, color: '#437c1a' }} type={'MaterialCommunityIcons'} name={'folder-remove'}/> )
    });

    componentWillMount(){
        axios.post( CONST.url + 'show/deleted/order', { user_id: this.props.auth.data.id }).then(response => this.setState({ orders: response.data.data, key: response.data.key }))
    }


    renderLoader(){
        if (this.state.key === ''){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 500, }}>
                    <DoubleBounce size={20} color="#437c1a" />
                </View>
            );
        }
    }

    renderOrderDetails(type, problems, accessories){
        if (type === "1"){
            return (<Text>المشكلة :
                {
                    problems.map(( problem, i )=> (
                        <Text key={i}>{problem.title} , </Text>
                    ))
                }
            </Text>);
        }else if(type === "3"){
            return (<Text> الاكسسوارات :
                {
                    accessories.map(( accessory, i ) => (
                        <Text key={i}>{accessory.title} , </Text>
                    ))
                }
            </Text>);
        }
    }

    resendOrder(order_id){
        axios.post(CONST.url + 'resend/deleted/order', { order_id }).then(response =>
            {
                Toast.show({
                    text: response.data.massage,
                    type: "success",
                    duration: 3000
                });

                this.componentWillMount();
            }
        )
    }


    renderListItems(){
        return this.state.orders.map((order, i) => (
            <ListItem key={i} style={{ backgroundColor: '#f4f3f3', marginLeft: 0, borderRadius: 15, borderLeftWidth: 5, borderColor: '#4a8c4c', paddingLeft: 10, marginBottom: 10 }}>
                <Body>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#f7f7f7', marginBottom: 3 }}>
                    <Text style={{ color: '#949494', fontSize: 18, textAlign: 'left' }}>{ order.model }</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 3 }}>
                        <Text><Text style={{ width: 50 }}>نوع الطلب :</Text> { order.type_text } </Text>
                        { this.renderOrderDetails(order.type, order.problem, order.accessory) }
                        <Text><Text style={{ width: 50 }}>الموقع :</Text> { order.city }</Text>
                    </View>

                    <TouchableOpacity style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', flex: 1 }} onPress={() => this.resendOrder(order.id)}>
                        <Icon type={'EvilIcons'} name={'refresh'} style={{color: '#44813a', fontSize: 25, top: 1, marginRight: 2}}/>
                        <Text style={{color: '#44813a' }}>اعادة ارسال</Text>
                    </TouchableOpacity>
                </View>
                </Body>
            </ListItem>
        ));
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
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>الطلبات المنتهيه</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                { this.renderLoader() }
                <Content style={{ padding: 10 }}>
                    <View>
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

export default connect(mapStateToProps)(FinishedOrder);