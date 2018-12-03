import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, List, ListItem } from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';
import {connect} from "react-redux";
import { AnimatedCircularProgress } from 'react-native-circular-progress';



class CurrentOrders extends Component{
    constructor(props){
        super(props);
        this.state = {
            orders: [],
            key: ''
        }
    }

    static navigationOptions = () => ({
        drawerLabel: 'الطلبات الحالية',
        drawerIcon: ( <Icon style={{ fontSize: 20, color: '#437c1a' }} type={'FontAwesome'} name={'user'}/> )
    });

    componentWillMount(){
        axios.post( CONST.url + 'show/current/order', { user_id: this.props.auth.data.id }).then(response => this.setState({ orders: response.data.data, key: response.data.key }))
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


    renderListItems(){
        return this.state.orders.map((order, i) => (
            <ListItem onPress={() => this.props.navigation.navigate('chooseOffer', {orderId: order.id})} key={i} style={{ backgroundColor: '#f4f3f3', marginLeft: 0, borderRadius: 15, borderLeftWidth: 5, borderColor: '#4a8c4c', paddingLeft: 10, marginBottom: 10 }}>
                <Body>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#f7f7f7', marginBottom: 3 }}>
                    <Text style={{ color: '#949494', fontSize: 18, textAlign: 'left' }}>{ order.model }</Text>
                </View>
                <Text><Text style={{ width: 50 }}>نوع الطلب :</Text> { order.type_text } </Text>
                { this.renderOrderDetails(order.type, order.problem, order.accessory) }
                <Text><Text style={{ width: 50 }}>الموقع :</Text> { order.city }</Text>
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
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>الطلبات الحالية</Text>
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

export default connect(mapStateToProps)(CurrentOrders);