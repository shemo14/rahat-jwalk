import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import {Button, Icon, Container, Header, Right, Body, Content, Left, Input, Form, Toast} from 'native-base';
import CONST from "../consts";
import axios from "axios/index";

import {connect} from "react-redux";
import {Spinner} from "../common";

class Plans extends Component{
    constructor(props){
        super(props);
        this.state = {
            visibleModal: null,
            setRateValue: 1,
            accountNum: '',
            accountName: '',
            bankName: '',
            bankingData: [],
            loader: false,
            showToast: false,
            id: this.props.navigation.state.params.planId,
            name: this.props.navigation.state.params.name,
            cost: this.props.navigation.state.params.cost,
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    componentWillMount() {
        console.log(this.state.cost);
        axios.post( CONST.url + 'show/bank/account', { user_id: this.props.profile.id }).then(response => {
            this.setState({ bankingData: response.data.data.bank_account, key: response.data.key })
        })
    }

    setCommission(){
        this.setState({ loader: true });
        axios.post( CONST.url + 'addPackageTransfer', {
            user_id:     this.props.profile.id,
            bank_name:   this.state.bankName,
            account_num: this.state.accountNum,
            amount:      this.state.cost,
            package_id:  this.state.id,
            lang:        'ar'
        }).then(response => {
            this.setState({ loader: false });
            console.log(response.data);
            Toast.show({
                text: response.data.massage,
                type: response.data.key == 0 ? "danger" : "success",
                duration: 3000
            });

            this.componentWillMount()
        })
    }

    renderLoading(){
        if (this.state.loader){
            return(<Spinner />);
        }

        if (this.state.accountNum === '' || this.state.accountName === '' || this.state.bankName === ''){
            return (
                <Button block disabled style={{marginTop: 20, marginBottom: 20, width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} light>
                    <Text style={{color: '#999', fontSize: 17, textAlign: 'center' }}>ارسال</Text>
                </Button>
            );
        }

        return (
            <Button block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', marginBottom: 30}} onPress={() => this.setCommission()  } primary>
                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>ارسال</Text>
            </Button>
        );
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
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>{ this.state.name }</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>

                <Content>
                    <View style={{ paddingHorizontal: 10 }}>
                        <View>
                            <View style={{ flex: 1, marginVertical: 20, backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#e7e7e7' }}>
                                <View style={{ borderRightWidth: 1, borderRightColor: '#c8c8c9', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: '#c8c8c9', justifyContent: 'center', flex: 1, borderRightColor: '#c8c8c9', borderRightWidth: 1 }}>
                                        <Text style={{ textAlign: 'center', color: '#5c8a41', fontSize: 18 }}>اسم البنك</Text>
                                    </View>
                                    <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: '#c8c8c9', justifyContent: 'center', flex: 1, borderRightColor: '#c8c8c9', borderRightWidth: 1 }}>
                                        <Text style={{ textAlign: 'center', color: '#5c8a41', fontSize: 18 }}>اسم الحساب</Text>
                                    </View>
                                    <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: '#c8c8c9', justifyContent: 'center', flex: 1 }}>
                                        <Text style={{ textAlign: 'center', color: '#5c8a41', fontSize: 18 }}>رقم الحساب</Text>
                                    </View>
                                </View>
                                {
                                    this.state.bankingData.map((bank, i) => {
                                        return(
                                            <View key={i} style={{ borderRightWidth: 1, borderRightColor: '#c8c8c9', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: '#c8c8c9', justifyContent: 'center', flex: 1,  borderRightColor: '#c8c8c9', borderRightWidth: 1 }}>
                                                    <Text style={{ textAlign: 'center', color: '#8f8f8f' }}>{ bank.bank_name }</Text>
                                                </View>
                                                <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: '#c8c8c9', justifyContent: 'center', flex: 1, borderRightColor: '#c8c8c9', borderRightWidth: 1 }}>
                                                    <Text style={{ textAlign: 'center', color: '#8f8f8f' }}>{ bank.account_name }</Text>
                                                </View>
                                                <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: '#c8c8c9', justifyContent: 'center', flex: 1 }}>
                                                    <Text style={{ textAlign: 'center', color: '#8f8f8f' }}>{ bank.account_num }</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>

                            <KeyboardAvoidingView behavior="padding">
                                <Form style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', marginBottom: 10 , width:'100%' }}>
                                        <Text style={{ color: '#518033', fontSize: 17 , textAlign:'right' , writingDirection: 'rtl'}}>المبلغ المستحق :</Text>
                                        <Input disabled value={JSON.stringify(this.state.cost)} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35 }}/>
                                    </View>
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={{  color: '#518033', fontSize: 17, marginTop: 22 , textAlign:'right' , writingDirection: 'rtl' , width:'100%'}}>معلومات العميل :	</Text>
                                            <View>
                                                <Input placeholder='رقم الحساب المحول منه' onChangeText={(accountNum) => this.setState({accountNum})} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4, marginBottom: 5 }}/>
                                                <Input placeholder='اسم صاحب الحساب' onChangeText={(accountName) => this.setState({accountName})} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 , marginBottom: 5}}/>
                                                <Input placeholder='البنك' onChangeText={(bankName) => this.setState({bankName})} style={{ backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4, marginBottom: 5 }}/>
                                            </View>
                                        </View>
                                </Form>
                            </KeyboardAvoidingView>
                        </View>
                    </View>
                </Content>
                <View style={{ paddingHorizontal: 10, marginBottom: 20 }}>
                    { this.renderLoading() }
                </View>
            </Container>
        )
    }
}


const mapStateToProps = ({ profile }) => {
    return {
        profile: profile.user
    };
};
export default connect(mapStateToProps)(Plans);