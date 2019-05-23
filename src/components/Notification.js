import React, { Component } from 'react';
import { View, Text, Image, Animated, FlatList, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left , Card, CardItem, Thumbnail } from 'native-base';
import { DoubleBounce } from 'react-native-loader';
import axios from 'axios';
import CONST from '../consts';
import {connect} from "react-redux";

const width  = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const deviceType = Platform.OS;
class Notification extends Component{
    constructor(props){
        super(props);
        this.state = {
            notifications: [],
            key: null
        }

        console.log(deviceType)
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    componentWillMount(){
        axios.post( CONST.url + 'notification/show', { user_id: this.props.auth.data.id }).then(response =>
            this.setState({ notifications: response.data.data, key: response.data.key }))
    }

    renderLoader(){
        if (this.state.key === null){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 500, }}>
                    <DoubleBounce size={20} color="#437c1a" />
                </View>
            );
        }
    }

    deleteNotification(id){
        this.setState({ key: null });
        axios.post( CONST.url + 'notification/delete', { notification_id: id }).then(response =>
            this.setState({ key: response.data.key }))

        this.componentWillMount();
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
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>الاشعارات</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content>
                    { this.renderLoader() }
                    <View style={{ flex :1 , width:'100%' , flexDirection:'column' , paddingTop:10 }}>
                        {
                            this.state.notifications.map((notification , i) => (
                                <Card key={i} transparent >
                                    <CardItem style={{paddingTop:0 , paddingBottom:5}}>
                                        <Left>
                                            <Thumbnail style={{height:70, width:70 , borderRadius: deviceType === 'ios' ? 35 : 50 , marginRight:15}} source={{ uri: notification.sender_image }}/>

                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('noti')} style={{flex:1 , width:'100%'}}>
                                                <Body style={{borderWidth:1 , borderRadius:20 , borderColor: '#eee', marginLeft:0 , paddingHorizontal:15 , paddingVertical:10 , width: '100%'}} >
                                                    <Text style={{color: '#eebc47', fontSize: 15}}>{ notification.sender_name }</Text>
                                                    <Text note style={{color: '#868686',fontSize: 13, writingDirection: 'rtl' }}>{ notification.desc }</Text>
                                                    <Text note style={{ color: '#bbb',fontSize: 13 , alignSelf:'flex-end'}}>{ notification.for_time }</Text>
                                                    <TouchableOpacity onPress={() => this.deleteNotification(notification.id)} style={{backgroundColor:'#eee' , borderRadius:50 , borderWidth:1 , borderColor:'#eee' , position:'absolute' , width:20 , height:20 , right:-3 ,justifyContent:'center' , alignItems:'center' , top:- 5}}>
                                                        <Icon name={'close'} type='EvilIcons' style={{ color: '#eebc47' , fontSize: 17 }}  />
                                                    </TouchableOpacity>
                                                </Body>
                                            </TouchableOpacity>
                                        </Left>
                                    </CardItem>
                                </Card>
                            ))
                        }
                    </View>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = ({ auth }) => {
    return {
        auth: auth.user,
    };
};

export default connect(mapStateToProps)(Notification);