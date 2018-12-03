import React, { Component } from 'react';
import {View, Text, Image, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left } from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';

const width = Dimensions.get('window').width;
class SimCards extends Component{
    constructor(props){
        super(props);
        this.state = {
            type: this.props.navigation.state.params.type,
            simCards: [],
            key: ''
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    componentWillMount(){
        axios.post( CONST.url + 'show/card/company').then(response => this.setState({ simCards: response.data.data, key: response.data.key }))
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
                { this.renderLoader() }
                <Content>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        {
                            this.state.simCards.map((sim, i) => (
                                <View style={{ margin: 10 }} key={i}>
                                    <TouchableOpacity style={{ borderWidth: 1, borderRadius: 70, height: 125, width: 125, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('simSize', { type: this.state.type, simData: sim })}>
                                        <Image resizeMode={'center'} style={{ height: 100, width: 100 }} source={{ uri: sim.image }}/>
                                        <View style={styles.fixCircleClipping}/>
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#62b6b8', textAlign: 'center',  }}>{ sim.title }</Text>
                                </View>
                            ))
                        }
                    </View>
                </Content>
            </Container>
        )
    }
}

const styles={
    fixCircleClipping: {
        position: 'absolute',
        top: -2,
        bottom: -2,
        right: -2,
        left: -2,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: '#437c1a'
    }
};

export default SimCards;