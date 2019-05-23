import React, { Component } from 'react';
import { View, Text, Image, Animated, FlatList, TouchableOpacity, Dimensions , Platform } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left , Card, CardItem, Thumbnail } from 'native-base';
import { DoubleBounce } from 'react-native-loader';
import axios from 'axios';
import CONST from '../consts';
import {connect} from "react-redux";


const width = Dimensions.get('window').width;
const deviceType = Platform.OS;
class Chat extends Component{
    constructor(props){
        super(props);
        this.state = {
            rooms: [],
            key: null
        }
    }

    static navigationOptions = () => ({
        drawerLabel: 'المحادثات',
        drawerIcon: ( <Icon style={{ fontSize: 20, color: '#437c1a' }} type={'Ionicons'} name={'ios-chatbubbles'}/> )
    });


    componentWillMount() {
        axios.post( CONST.url + 'chatRooms', { user_id: this.props.auth.data.id }).then(response => this.setState({ rooms: response.data.data, key: response.data.key }))
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
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>الدردشة</Text>
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
                            this.state.rooms.map((room, i) => (
                                <Card transparent key={i} >
                                    <CardItem style={{paddingTop:0 , paddingBottom:5}}>
                                        <Left>
                                            <View>
                                                <Thumbnail style={{height:70, width:70 ,  borderRadius: deviceType === 'ios' ? 35 : 50 , marginRight:15}} source={{ uri: room.avatar }}/>
                                            </View>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('chatConv', { orderId: room.order_id, receiverId: room.receiver_id, senderId: room.sender_id })} style={{flex:1 , width:'100%'}}>
                                                <Body style={{borderWidth:1 , borderRadius:20 , borderColor: '#eee', marginLeft:0 , paddingHorizontal:15 , paddingVertical:10 , width: '100%'}} >
                                                <Text style={{color: '#eebc47', fontSize: 15, alignSelf: 'flex-start'}}>{ room.name }</Text>
                                                <Text note style={{color: '#868686',fontSize: 13, alignSelf: 'flex-start'}}>{ room.msg }</Text>
                                                <Text note style={{ color: '#bbb',fontSize: 13 , alignSelf:'flex-end'}}>{ room.time }</Text>
                                                <TouchableOpacity style={{backgroundColor:'#eee' , borderRadius:50 , borderWidth:1 , borderColor:'#eee' , position:'absolute' , width:20 , height:20 , right:-3 ,justifyContent:'center' , alignItems:'center' , top:5}}>
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

const styles={
 
};


const mapStateToProps = ({ auth }) => {
    return {
        auth: auth.user
    };
};
export default connect(mapStateToProps)(Chat);