import React, { Component } from 'react';
import { View, Text, Image, Animated , Platform  } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, List, ListItem, CheckBox } from 'native-base';
import axios from 'axios';
import CONST from '../consts';
import {DoubleBounce} from "react-native-loader";


const deviceType = Platform.OS;
class Storage extends Component{
    constructor(props){
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(-240),
            params: this.props.navigation.state.params.params,
            availabel: 0,
            checked: false,
            sizes: [],
            key: null,
            checkedSizeId: null
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });


    setSize(value){
        this.setState({ checkedSizeId: value })
    }

    componentWillMount() {
        axios.post( CONST.url + 'show/models/sizes', { model_id: this.state.params.modelId } ).then(response => {
            this.setState({ sizes: response.data.data, key: response.data.key });
        })
    }

    renderLoader(){
        console.log('this is key ...', this.state.key);


        if (this.state.key !== null){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 500, }}>
                    <DoubleBounce size={20} color="#437c1a" />
                </View>
            );
        }
    }

    navigateToNotes(){
        const params = {
            companyId: this.state.params.companyId,
            modelId: this.state.params.modelId,
            type: this.state.params.type,
            colorId: this.state.params.id,
            companyImage: this.state.params.companyImage,
            sizeId: this.state.checkedSizeId,
        };
        this.props.navigation.navigate('notes', { params });
    }

    renderButton(){
        if (this.state.checkedSizeId !== null){
            return(
                <Button block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 20}} onPress={() => this.navigateToNotes()} primary>
                    <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
                </Button>
            );
        }

        return(
            <Button block disabled style={{marginTop: 20, width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 20}} onPress={() => this.props.navigation.navigate('notes')} light>
                <Text style={{color: '#999', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
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
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>سعة التخزين</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate('colors')}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content style={{ padding: 10 }}>
                    {/*{ this.renderLoader() }*/}
                    <View style={{ flex: 1, width: '100%' }}>
                        <View style={{ alignItems: 'center', width: 80, height: 80, borderRadius: 50, margin: 30, backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#ebebed', justifyContent: 'center', alignSelf: 'center' }}>
                            <Image resizeMode={'center'} style={{ height: 60, width: 60 }} source={{ uri: this.state.params.companyImage }}/>
                        </View>
                        <List style={{ flex: 1 , paddingLeft :  deviceType === 'ios' ? 20 : 0 }}>
                            {
                                this.state.sizes.map((size, i) => (
                                    <ListItem key={i} onPress={() => this.setSize(size.id)} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                                        <Left style={{ flex: 1 }}>
                                            <Icon type={'FontAwesome'} name={'database'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 , height:  deviceType === 'ios' ? 20 : 'auto'}}/>
                                            <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 , height:  deviceType === 'ios' ? 20 : 'auto'}}>{ size.title }</Text>
                                        </Left>
                                        <Right style={{ flex: 1 }}>
                                            <CheckBox style={{ borderRadius: 3, paddingRight: 2 }} checked={this.state.checkedSizeId === size.id ? true : false} onPress={() => this.setSize(size.id)} color="#437c1a"/>
                                        </Right>
                                    </ListItem>
                                ))
                            }

                        </List>
                    </View>
                </Content>
                <View style={{ padding: 10 }}>
                    { this.renderButton() }
                </View>
            </Container>
        )
    }
}

const styles={

};

export default Storage;