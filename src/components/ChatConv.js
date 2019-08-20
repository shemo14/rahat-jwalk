import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	Animated,
	FlatList,
	KeyboardAvoidingView,
	Dimensions,
	ScrollView,
	Platform,
	ActivityIndicator
} from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left , Card, CardItem, Thumbnail , Item, Input, Form } from 'native-base';
import { DoubleBounce } from 'react-native-loader';
import axios from 'axios';
import CONST from '../consts';
import {connect} from "react-redux";
import {Notifications} from "expo";
import {Spinner} from "../common";


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const deviceType = Platform.OS;
const data = [{'msg': 'test 1'}, {'msg': 'test 1'}, {'msg': 'test 1'}, {'msg': 'test 1'}, {'msg': 'test 1'}, {'msg': 'test 1'}, {'msg': 'test 1'}, {'msg': 'test 1'}]

class ChatConv extends Component{
    constructor(props){
        super(props);
        this.state = {
            orderId: this.props.navigation.state.params.orderId,
            receiverId: this.props.navigation.state.params.receiverId,
            senderId: this.props.navigation.state.params.senderId,
            messages : [],
            key: null,
            msg: null,
            refreshed: false,
            isLoad: false
        }
    }

    componentWillMount() {
        axios.post( CONST.url + 'orderMsgs', { order_id: this.state.orderId }).then(response => this.setState({ messages: response.data.data, key: response.data.key }))
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    _keyExtractor = (item, index) => item.index;

    componentDidMount() {
        Notifications.addListener(this.handleNotification);
    }

    handleNotification = (notification) => {
        console.log(notification);
        this.componentWillMount();
    }

	renderLoading(){
		if (this.state.isLoad){
			return(<ActivityIndicator color='#eebc47' size={ 'large' }/>);
		}

		if (this.state.msg === '' || this.state.msg === null){
			return (
				<Button disabled rounded style={{ zIndex:-1,backgroundColor: '#eee', justifyContent: 'flex-end', height: 45  , width:45 ,borderRadius:50, marginLeft:15 , top:5}}>
					<Icon name={'send'} type={'FontAwesome'} style={{  color: "#fff" , fontSize:17 , top : -2 , right:-2 }}/>
				</Button>
			);
		}

		return (
			<Button onPress={() => this.sendMessage()} rounded style={{ zIndex:-1,backgroundColor: '#eebc47', justifyContent: 'flex-end', height: 45  , width:45 ,borderRadius:50, marginLeft:15 , top:5}}>
				<Icon name={'send'} type={'FontAwesome'} style={{  color: "#fff" , fontSize:17 , top : -2 , right:-2 }}/>
			</Button>
		);
	}

    renderItem(item, i){

        if (this.props.auth.data.id == item.sender_id){
            return(
                <View style={{ width: '100%' }}>
                    <Card transparent style={{marginBottom: i === this.state.messages.length-1 ? 90 : 10}} >
                        <CardItem style={{paddingTop:0 , paddingBottom:5}}>
                            <Left>
                                <Thumbnail style={{height:60, width:60 ,  borderRadius: deviceType === 'ios' ? 30 : 50  , borderWidth:2 , borderColor:'#fff'}} source={{ uri: item.sender_avatar }}/>
                                <View style={{flex:1 , width:'100%'}}>
                                    <Body style={{backgroundColor:'#fff' , borderWidth:1 , borderRadius:25 , borderTopLeftRadius:2 , borderColor: '#eee', marginLeft:5 , paddingHorizontal:15 , paddingVertical:10 , width: '100%'}} >
                                    <Text note style={{color: '#868686',fontSize: 13 , lineHeight:18, alignSelf: 'flex-start'}}>{ item.msg }</Text>
                                    </Body>
                                </View>
                            </Left>
                        </CardItem>
                        <Text note style={{ color: '#868686',fontSize: 13 , alignSelf:'flex-end' , marginHorizontal:20}}>{ item.time }</Text>
                    </Card>
                </View>
            );
        }

        return(
            <View style={{ width: '100%' }}>
                <Card transparent style={{marginBottom: i === this.state.messages.length-1 ? 90 : 10}}>
                    <CardItem style={{paddingTop:0 , paddingBottom:5}}>
                        <Left>
                            <View style={{flex:1 , width:'100%'}}>
                                <Body style={{backgroundColor:'#eebc47' , borderWidth:1 , borderRadius:25 , borderTopRightRadius:2 , borderColor: '#eebc47', marginLeft:0 , marginRight:5 , paddingHorizontal:15 , paddingVertical:10 , width: '100%'}} >
                                <Text note style={{color: '#fff',fontSize: 13 , lineHeight:18, alignSelf: 'flex-start'}}>{ item.msg }</Text>
                                </Body>
                            </View>
                            <Thumbnail style={{height:60, width:60 ,  borderRadius: deviceType === 'ios' ? 30 : 50 , borderWidth:2 , borderColor:'#eebc47'}} source={{ uri: item.receiver_avatar }}/>
                        </Left>
                    </CardItem>
                    <Text note style={{ color: '#868686',fontSize: 13 , alignSelf:'flex-start' , marginHorizontal:20}}>{ item.time }</Text>
                </Card>
            </View>
        );
    }

    sendMessage(){
        this.setState({ isLoad: true });
        let receiverId = this.state.receiverId;
        if (receiverId == this.props.auth.data.id)
            receiverId = this.state.senderId;


        console.log('reciver_id', receiverId);

        this.setState({ refreshed: true })
        axios.post( CONST.url + 'sendMsg', {
            order_id: this.state.orderId,
            msg: this.state.msg,
            sender_id: this.props.auth.data.id,
            receiver_id: receiverId

        }).then(response => this.setState({ messages: response.data.data, key: response.data.key, refreshed: false, msg: '', isLoad: false }))
    }
   
    render(){
        console.log('state id', this.state.receiverId);

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
                <KeyboardAvoidingView behavior={'position'} style={{width:'100%', flexDirection:'column', flex: 1, zIndex: -1 }}>

                    <ScrollView 
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                        this.scrollView.scrollToEnd({animated: true});
                    }}
                    style={{height:height-70 , paddingTop:20, }}>
                        {
                            this.state.messages.map((msg, i) => this.renderItem(msg, i))
                        }
                    </ScrollView>    
                    <View style={{ backgroundColor:'#fff' , borderTopWidth:3 , borderColor:'#eee' , flexDirection:'row' , flex: 1, width: '100%',height:60, position:'absolute' , bottom:0}}>
                                { this.renderLoading() }
                                <Item  style={{flex:1,zIndex:2222 , borderWidth:1 , borderColor:'#eee', borderRadius:50, height:45 , alignSelf:'flex-end' , marginBottom:5}}>
                                    <Input placeholder="أكتب رسالتك..." onChangeText={(msg) => this.setState({ msg })} value={this.state.msg}
                                           style={{ flex:1, width:'100%', paddingLeft:15 , paddingRight:15,marginRight:15 , borderWidth:1 , borderColor:'#eee', borderRadius:50, paddingBottom:10 , color: '#797979' , textAlign:'right' , backgroundColor:'#fff'}}
                                           placeholderTextColor={{ color: '#a7a7a7' }}
                                    />
                                </Item>
                            </View>
                </KeyboardAvoidingView>
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
export default connect(mapStateToProps)(ChatConv);