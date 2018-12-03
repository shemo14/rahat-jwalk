import React, { Component } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, List, ListItem, CheckBox } from 'native-base';


class Storage extends Component{
    constructor(props){
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(-240),
            availabel: 0,
            checked: false
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });


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
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>سعة التخزين</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content style={{ padding: 10 }}>
                    <View style={{ flex: 1, width: '100%' }}>
                        <View style={{ alignItems: 'center', width: 80, height: 80, borderRadius: 50, margin: 30, backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#ebebed', justifyContent: 'center', alignSelf: 'center' }}>
                            <Image resizeMode={'center'} style={{ height: 60, width: 60 }} source={{ uri: 'http://pngimg.com/uploads/samsung_logo/samsung_logo_PNG9.png' }}/>
                        </View>
                        <List style={{ flex: 1 }}>
                            <ListItem noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                                <Left style={{ flex: 1 }}>
                                    <Icon type={'FontAwesome'} name={'database'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
                                    <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>8 جيجا </Text>
                                </Left>
                                <Right style={{ flex: 1 }}>
                                    <CheckBox style={{ borderRadius: 3 }} checked={this.state.checked} onPress={() => this.setInstallation()} color="#437c1a"/>
                                </Right>
                            </ListItem>
                            <ListItem noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                                <Left style={{ flex: 1 }}>
                                    <Icon type={'FontAwesome'} name={'database'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
                                    <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>8 جيجا </Text>
                                </Left>
                                <Right style={{ flex: 1 }}>
                                    <CheckBox style={{ borderRadius: 3 }} checked={this.state.checked} onPress={() => this.setInstallation()} color="#437c1a"/>
                                </Right>
                            </ListItem>
                            <ListItem noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                                <Left style={{ flex: 1 }}>
                                    <Icon type={'FontAwesome'} name={'database'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
                                    <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>8 جيجا </Text>
                                </Left>
                                <Right style={{ flex: 1 }}>
                                    <CheckBox style={{ borderRadius: 3 }} checked={this.state.checked} onPress={() => this.setInstallation()} color="#437c1a"/>
                                </Right>
                            </ListItem>
                            <ListItem noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
                                <Left style={{ flex: 1 }}>
                                    <Icon type={'FontAwesome'} name={'database'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10 }}/>
                                    <Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4 }}>8 جيجا </Text>
                                </Left>
                                <Right style={{ flex: 1 }}>
                                    <CheckBox style={{ borderRadius: 3 }} checked={this.state.checked} onPress={() => this.setInstallation()} color="#437c1a"/>
                                </Right>
                            </ListItem>
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

const styles={

};

export default Storage;