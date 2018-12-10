import React, { Component } from 'react';
import {Image, View, Text, TouchableOpacity, ImageBackground, AsyncStorage } from 'react-native';
import {Container, Footer, Content, Body } from 'native-base';
import { DrawerItems } from 'react-navigation';
import {connect} from "react-redux";



class DrawerCustomization extends Component {
    constructor(props){
        super(props);
        this.state={
            user: [],
            lang: 'en'
        }

        console.log('this fuck cons');
    }

	async logout(){
		this.props.navigation.navigate('login');
        AsyncStorage.clear();
    }



	render(){
        const { user } = this.props;
        // console.log(user);

        return(
            <Container style={{ overflow: 'visible' }}>
                <View style={{ paddingRight: 10, paddingLeft: 10, marginBottom: 30 }}>
                    <View style={styles.drawerHeader}>
                        <Body style={{ alignItems: 'center' }}>
                            <View style={styles.profileContainer}>
                                <Image style={styles.profileImage} source={{ uri: user.image }} />
                                <TouchableOpacity style={styles.authContainer} onPress={() => this.props.navigation.navigate('profile')}>
                                    <Text onPress={() => this.props.navigation.navigate('profile')} style={styles.usernameText}>{ user.name }</Text>
                                </TouchableOpacity>
                            </View>
                        </Body>
                    </View>
                </View>
                <Content>
                    <DrawerItems {...this.props} labelStyle={{color: '#9c9c9c', margin: 10, right: 15}} onItemPress={
                            (route, focused) => {
                                if (route.route.key === 'logout') {
                                    this.logout()
                                }else {
                                    this.props.navigation.navigate(route.route.key);
                                }
                            }
                        }
						items={this.props.auth !== null && this.props.user.provider === "1" ? this.props.items.filter((item) => item.routeName !== 'joinToProvider') : this.props.items.filter((item) => item.routeName !== 'newOrders' && item.routeName !== 'commission')  }
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', flex: 1 }}>
                        <TouchableOpacity style={{ padding: 3 }}>
                            <Image style={{ width: 30, height: 30 }} source={require('../../assets/images/email.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 3 }}>
                            <Image style={{ width: 30, height: 30 }} source={require('../../assets/images/smartphone.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 3 }}>
                            <Image style={{ width: 30, height: 30 }} source={require('../../assets/images/twitter.png')}/>
                        </TouchableOpacity>
                    </View>
                </Content>
                    <TouchableOpacity style={{ position: 'absolute', left: 250, top: '45%' }}>
                        <Image style={{ width: 50, height: 50 }} source={require('../../assets/images/button.png')} />
                    </TouchableOpacity>
                <Footer style={{ backgroundColor: '#fff' }}>
                    <ImageBackground resizeMode={'cover'} style={{ width: '100%', height: 140, bottom: -6, position: 'absolute' }} source={require('../../assets/images/Vector_Smart_Object2.png')}/>
                </Footer>
            </Container>
        );
    }
}


const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    drawerHeader: {
        height: 125,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccdeca',
        marginTop: 60,
    },
    drawerImage: {
        height: 200,
        width: 550,
        position: 'relative',
        left: -10,
    },
    profileImage: {
        height: 80,
        width: 80,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#639d57'
    },
    profileContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    usernameText:{
        color: '#9f9f9f',
        fontWeight: 'bold',
        fontSize: 20,
        height: 25,
        textAlign: 'center'
    },
    authContainer:{
        flexDirection:'row',
        marginTop: 10,
        alignItems: 'center'
    },
    logout:{
        color: '#fff',
    },
    logoutImage: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    logoutContainer:{
        flex: 1,
        flexDirection:'row',
        flexWrap: 'wrap',
        alignSelf: 'flex-end'
    },
};

const mapStateToProps = ({ auth, profile }) => {
    return {
        auth: auth.user,
        user: profile.user
    };
};

export default connect(mapStateToProps)(DrawerCustomization);