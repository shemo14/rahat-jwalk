import React, { Component } from 'react';
import {View, Text, Image, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left } from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';

const width = Dimensions.get('window').width;
class Colors extends Component{
    constructor(props){
        super(props);
        this.state = {
            companyId: this.props.navigation.state.params.companyId,
            modelId: this.props.navigation.state.params.modelId,
            type: this.props.navigation.state.params.type,
            colors: []
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    componentWillMount(){
        axios.post( CONST.url + 'show/models/colors', { model_id: this.state.modelId }).then(response => this.setState({ colors: response.data }))
    }

    renderItem(color){
        let navigateComponent = '';
        if (this.state.type === 2)
            navigateComponent = 'determinedLocation';
        else if(this.state.type === 3)
            navigateComponent = 'accessory';

        return(
            <TouchableOpacity style={styles.brandContainer} onPress={() => this.props.navigation.navigate( navigateComponent , { params: { companyId: this.state.companyId, modelId: this.state.modelId, type: this.state.type, colorId: color.item.id } })}>
                <Image source={{ uri: color.item.image }} style={{ height: 150, width: 150, flex: 2 }} resizeMode={'center'}/>
            </TouchableOpacity>
        );
    }

    renderLoader(){
        if (this.state.colors.key === undefined){
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
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>ألوان الجوال</Text>
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
                        <FlatList
                            style={{ padding: 5  }}
                            data={this.state.colors.data}
                            renderItem={item => this.renderItem(item)}
                            numColumns={2}
                        />
                    </View>
                </Content>
            </Container>
        )
    }
}

const styles={
    brandContainer: {
        backgroundColor: '#f7f7f9',
        borderColor: '#f1f1f2',
        borderWidth: 1,
        borderRadius: 5,
        width: (width/2) - 20,
        height: (width/2) - 20,
        margin: 5,
        alignItems: 'center',
        padding: 5
    }
};

export default Colors;