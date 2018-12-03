import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, Item ,List, ListItem, CheckBox, Input, Form } from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';
import {connect} from "react-redux";
import Services from "./Services";
import {Spinner} from "../common";
import { ImagePicker } from 'expo';


class JoinToVendors extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: this.props.auth.data.name,
            idNumber: '',
            city: this.props.auth.data.city,
            email: this.props.auth.data.email,
            password: '',
            confirmPassword: '',
            loader: false,
            userImage: null,
            phone: ''
        }
    }

    static navigationOptions = () => ({
        drawerLabel: 'التسجيل للانظمام الينا',
        drawerIcon: ( <Icon style={{ fontSize: 20, color: '#437c1a' }} type={'FontAwesome'} name={'users'}/> )
    });

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: true,
        });

        if (!result.cancelled) {
            this.setState({ userImage: result.uri, base64: result.base64 });
        }
    };

    renderLoading(){
        if (this.state.loader){
            return(<Spinner />);
        }

        return (
            <Button block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', marginBottom: 30}} onPress={() => { this.onLoginPressed()  }} primary>
                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>حفظ</Text>
            </Button>
        );
    }

    render(){
        let { userImage } = this.state;

        return(
            <Container>
                <Header style={{ height: 70, backgroundColor: '#437c1a', paddingTop: 15 }}>
                    <Right style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' style={{ color: '#fff', fontSize: 30, marginTop: 8, left: -10 }} />
                        </Button>
                    </Right>
                    <Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>الملف الشخصي</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content style={{ padding: 10 }}>
                    <View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={this._pickImage} style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 55, padding: 3, width: 90, height: 90 }}>
                                {userImage != null ? <Image source={{ uri: userImage }} style={{ width: 100, height: 100, borderRadius: 55 }} /> : <Icon style={{ fontSize: 35, color: '#437c1a' }} type={'MaterialIcons'} name={'add-a-photo'}/> }
                            </TouchableOpacity>
                            <Text style={{ color: '#437c1a' }}>الصورة الشخصية</Text>
                        </View>

                        <View>
                            <Form style={{ alignItems: 'center' }}>
                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginBottom: 10,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20}} name={'user'} type={'FontAwesome'}/>
                                    <Input autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(name) => this.setState({name})} style={{ alignSelf: 'flex-end' , color: '#277c19', height: 35 }} placeholder='اسم المستخدم' />
                                </Item>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginBottom: 10,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20}} name={'v-card'} type={'Entypo'}/>
                                    <Input autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(idNumber) => this.setState({idNumber})} style={{ alignSelf: 'flex-end' , color: '#277c19', height: 35 }} placeholder='رقم الهوية' />
                                </Item>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginBottom: 10,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} name={'phone'} type={'FontAwesome'}/>
                                    <Input autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(phone) => this.setState({phone})} style={{ alignSelf: 'flex-end', height: 35 }} placeholder='رقم الهاتف' value={this.state.phone}/>
                                </Item>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginBottom: 10,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20}} name={'v-card'} type={'Entypo'}/>
                                    <Input disabled autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(email) => this.setState({email})} style={{ alignSelf: 'flex-end', height: 35 }} placeholder='صوره الهوية' value={this.state.email}/>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} type={'MaterialIcons'} name={'add-a-photo'}/>
                                </Item>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginBottom: 10,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20}} name={'graduation-cap'} type={'FontAwesome'}/>
                                    <Input disabled autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(email) => this.setState({email})} style={{ alignSelf: 'flex-end', height: 35 }} placeholder='صوره دورة الصيانة' value={this.state.email}/>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} type={'MaterialIcons'} name={'add-a-photo'}/>
                                </Item>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginBottom: 10,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20}} name={'shop'} type={'Entypo'}/>
                                    <Input disabled autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(email) => this.setState({email})} style={{ alignSelf: 'flex-end', height: 35 }} placeholder='صوره السجل التجاري' value={this.state.email}/>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} type={'MaterialIcons'} name={'add-a-photo'}/>
                                </Item>
                            </Form>

                            <Services/>

                            { this.renderLoading() }
                        </View>
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

export default connect(mapStateToProps)(JoinToVendors);