import React, { Component } from 'react';
import { View, Text, Image  } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, List, ListItem, CheckBox } from 'native-base';
import axios from "axios/index";
import CONST from "../consts";
import { DoubleBounce } from 'react-native-loader';


class SimSize extends Component{
    constructor(props){
        super(props);
        this.state = {
            type: this.props.navigation.state.params.type,
            simData: this.props.navigation.state.params.simData,
            checked: false,
            sizes: [],
            key: ''
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    componentWillMount(){
        axios.post( CONST.url + 'show/card/company/data', { company_id: this.state.simData.id }).then(response => this.setState({ sizes: response.data.data, key: response.data.key }))
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


    setInstallation(){
        if(this.state.checked){
            this.setState({ checked: false });
        }else{
            this.setState({ checked: true });
        }
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
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>شرائح البيانات</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content style={{ padding: 10 }}>
                    <View style={{ flex: 1, width: '100%' }}>
                        <View style={{ alignItems: 'center', width: 80, height: 80, borderRadius: 50, marginTop: 30, backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#ebebed', justifyContent: 'center', alignSelf: 'center' }}>
                        <Image resizeMode={'center'} style={{ height: 60, width: 60 }} source={{ uri: this.state.simData.image }}/>
                        </View>
                        <Text style={{ fontSize: 18, textAlign: 'center', color: '#747474', marginBottom: 30, marginTop: 5 }}>{ this.state.simData.title }</Text>

                        <List style={{ flex: 1 }}>
                            {
                                this.state.sizes.map((size, i) => (
                                    <ListItem key={i} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                                        <Left style={{ flex: 1 }}>
                                            <Icon type={'FontAwesome'} name={'database'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
                                            <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>{ size.title }</Text>
                                        </Left>
                                        <Right style={{ flex: 1 }}>
                                            <CheckBox style={{ borderRadius: 3 }} checked={this.state.checked} onPress={() => this.setInstallation()} color="#437c1a"/>
                                        </Right>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </View>
                </Content>
                <View style={{ padding: 10 }}>
                    <Button block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 20}} onPress={() => this.props.navigation.navigate('problems')} primary>
                        <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
                    </Button>
                </View>
            </Container>
        )
    }
}


export default SimSize;