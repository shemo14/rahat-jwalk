import React, { Component } from 'react';
import { View, Text, Image, Animated, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left } from 'native-base';
import { DoubleBounce } from 'react-native-loader';
import axios from 'axios';
import CONST from '../consts';


const width = Dimensions.get('window').width;
class Brands extends Component{
    constructor(props){
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(-240),
            availabel: 0,
            type: this.props.navigation.state.params.type,
            brands: []
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    componentWillMount(){
        axios.post( CONST.url + 'show/mobile/company').then(response => this.setState({ brands: response.data }))
    }

    renderItem(brand){
        return(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('models', { companyId: brand.item.id, type: this.state.type })} style={styles.brandContainer}>
                <Image source={{ uri: brand.item.image }} style={{ height: 150, width: 150, flex: 2 }} resizeMode={'center'}/>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#62b6b8', textAlign: 'center', flex: 0.5, justifyContent: 'center' }}>{ brand.item.title }</Text>
            </TouchableOpacity>
        );
    }

    renderLoader(){
        if (this.state.brands.key === undefined){
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
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>الجوال</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content>
                    { this.renderLoader() }
                    <View style={{ alignItems: 'center' }}>
                        <FlatList
                            style={{ padding: 5  }}
                            data={this.state.brands.data}
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

export default Brands;