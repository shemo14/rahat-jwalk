import React, { Component } from 'react';
import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, Textarea, Form } from 'native-base';
import { ImagePicker, Permissions } from 'expo';


const deviceType = Platform.OS;
class Notes extends Component{
    constructor(props){
        super(props);
        this.state = {
            params: this.props.navigation.state.params.params,
            accessoryList: this.props.navigation.state.params.accessoryList,
            serviceId: this.props.navigation.state.params.serviceId,
            desc: '',
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };


    onPressConfirm(){
        const params = {
            companyId: this.state.params.companyId,
            modelId: this.state.params.modelId,
            type: this.state.params.type,
            colorId: this.state.params.id,
            companyImage: this.state.params.companyImage,
            serviceId: this.state.serviceId,
            notes: this.state.desc
        };

        this.props.navigation.navigate('determinedLocation', { params, accessoryList: this.state.accessoryList });
    }

    render(){
        let navigate = '';
        if(this.state.params.type === 2){
			navigate = 'storage';
        } else if(this.state.params.type === 3){
			navigate = 'accessory';
        }else
            navigate = 'simCards';


        return(
            <Container>
                <Header style={{ height: 70, backgroundColor: '#437c1a', paddingTop: 15 }}>
                    <Right style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' type='Entypo' style={{ color: '#fff', fontSize: 30, marginTop: 8, left: -10 }} />
                        </Button>
                    </Right>
                    <Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>ملاحظات</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate(navigate, { params: this.state.params })}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content style={{ padding: 10 }}>
                    <View style={{ flex: 1, width: '100%' }}>
                        <Form>
                            <Textarea onChangeText={(desc) => this.setState({ desc })} rowSpan={5} placeholderTextColor={{ color: '#d4d4d4' }} style={{ backgroundColor: '#f4f4f4', borderColor: '#ededed', borderWidth: 1, borderRadius: 5, writingDirection: 'rtl', textAlign: 'right' , marginLeft: deviceType === 'ios' ? 20 : 0}} bordered placeholder="ملاحظات ..." />
                        </Form>
                    </View>
                </Content>
                <View style={{ padding: 10 }}>
                    <Button disabled={this.state.desc === '' ? true : false} block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 20}} onPress={() => this.onPressConfirm()} primary>
                        <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
                    </Button>
                </View>
            </Container>
        )
    }
}

const styles={

};

export default Notes;