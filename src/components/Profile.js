import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, List, ListItem, CheckBox, Input, Form } from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';
import {connect} from "react-redux";
import Services from "./Services";
import {Spinner} from "../common";


class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: this.props.auth.data.name,
            city: this.props.auth.data.city,
            email: this.props.auth.data.email,
            password: '',
            confirmPassword: '',
            loader: false
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null
    });

    renderProviderServices(){
        if (this.props.auth.data.provider === "0"){
            return <Services/>
        }
    }

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
        const { data } = this.props.auth;

        console.log(data);

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
                        <Image source={{ uri: data.image }} style={{ height: 100, width: 100, alignSelf: 'center' ,marginTop: 20, borderRadius: 80, borderWidth: 1, borderColor: '#f4f4f4', marginBottom: 20 }}/>

                        <View>
                            <Form>
                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                    <Text style={{ flex: 2 }}>الاسم :</Text>
                                    <Input onChangeText={(name) => this.setState({name})} value={this.state.name} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                </View>

                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                    <Text style={{ flex: 2 }}>المدينة :</Text>
                                    <Input onChangeText={(city) => this.setState({city})} value={this.state.city} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                </View>

                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                    <Text style={{ flex: 2 }}>الايميل :</Text>
                                    <Input onChangeText={(email) => this.setState({email})} value={this.state.email} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                </View>

                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                    <Text style={{ flex: 2 }}>كلمة المرور :</Text>
                                    <Input onChangeText={(password) => this.setState({password})} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                </View>

                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                    <Text style={{ flex: 2 }}>تأكيد كلمة المرور :</Text>
                                    <Input onChangeText={(confirmPassword) => this.setState({confirmPassword})} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                </View>
                            </Form>

                            { this.renderProviderServices() }

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

export default connect(mapStateToProps)(Profile);