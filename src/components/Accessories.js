import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, List, ListItem, CheckBox } from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';
import AccessoryListItems from './AccessoryListItems'


class Accessories extends Component{
    constructor(props){
        super(props);
        this.state = {
            accessories: [],
            availabel: 0,
            checked: false,
            key: '',
            checkedAccessory: [],
            params: this.props.navigation.state.params.params,
        }
    }


    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    componentWillMount(){
        axios.post( CONST.url + 'show/accessory' ).then(response => this.setState({ accessories: response.data.data, key: response.data.key  }))
    }

    addToAccessoriesList(id, type){
        let accessoriesList = this.state.checkedAccessory;
        if (type){
            accessoriesList.push(id);
        }else{
            accessoriesList = accessoriesList.filter(accessoryId => accessoryId !== id);
        }

        this.setState({ checkedAccessory: accessoriesList });
    }

    renderListItems(){
        return this.state.accessories.map(accessory => <AccessoryListItems addAccessory={(id, type) => this.addToAccessoriesList(id, type)} key={accessory.id} data={accessory}/>)
    }

    onPressConfirm(){
        this.props.navigation.navigate('determinedLocation', { params: this.state.params, accessoryList: this.state.checkedAccessory });
    }

    renderLoader(){
        if (this.state.key === ''){
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 500 }}>
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
                            <Icon name='menu' style={{ color: '#fff', fontSize: 30, marginTop: 8, left: -10 }} />
                        </Button>
                    </Right>
                    <Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>اكسسوارات الجوال</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content style={{ padding: 10 }}>
                    { this.renderLoader() }
                    <View style={{ flex: 1, width: '100%' }}>
                        <List style={{ flex: 1 }}>
                            { this.renderListItems() }
                        </List>
                    </View>
                </Content>
                <View style={{ padding: 10 }}>
                    <Button block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 20}} onPress={() => this.onPressConfirm()}>
                        <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
                    </Button>
                </View>
            </Container>
        )
    }
}


export default Accessories;