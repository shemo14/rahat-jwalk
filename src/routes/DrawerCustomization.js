import React, { Component } from 'react';
import {Image, View, Text, TouchableOpacity, ImageBackground, AsyncStorage, Linking } from 'react-native';
import {Container, Footer, Content, Body } from 'native-base';
import { DrawerItems } from 'react-navigation';
import {connect} from "react-redux";
import axios from 'axios';
import CONST from "../consts";
import { logout } from '../actions'



class DrawerCustomization extends Component {
    constructor(props){
        super(props);
        this.state={
            user: [],
            lang: 'en',
            payment: false,
			site_social: []
        }
    }

	userLogout(){
		this.props.logout({ userId: this.props.user.id });
        this.props.navigation.navigate('login');
    }

    componentWillMount() {
        console.log(this.props.user);

        axios.get(CONST.url + 'contact_info').then(response => {
            this.setState({ site_social: response.data.data.site_social, payment: response.data.payment })
        })
	}

	renderDrawerTabs(){
        let { user } = this.props;
        if (user === null && this.props.auth !== null)
            user = this.props.auth.data;
        else if (this.props.auth === null){
            user = {
                name: 'زائر',
                image: 'http://rahat.aait-sa.com/dashboard/uploads/users/default.png'
            }
        }

        if (this.props.auth !== null && user.provider == 1 )
            return this.state.payment ? this.props.items.filter((item) => item.routeName !== 'joinToProvider') : this.props.items.filter((item) => item.routeName !== 'joinToProvider' && item.routeName !== 'commission' && item.routeName !== 'signIn');
        else if(this.props.auth === null)
            return this.props.items.filter((item) => item.routeName !== 'newOrders' && item.routeName !== 'commission' && item.routeName !== 'currentOrders' && item.routeName !== 'joinToProvider' && item.routeName !== 'chat' && item.routeName !== 'logout' && item.routeName !== 'finishedOrders');
        else
            return this.props.items.filter((item) => item.routeName !== 'newOrders' && item.routeName !== 'commission'  && item.routeName !== 'signIn');
    }



	render(){
        let { user } = this.props;
        if (user === null && this.props.auth !== null)
            user = this.props.auth.data;
        else if (this.props.auth === null){
            user = {
                name: 'زائر',
                image: 'http://rahat.aait-sa.com/dashboard/uploads/users/default.png'
            }
        }

        return(
            <Container style={{ overflow: 'visible' }}>
                <View style={{ paddingRight: 10, paddingLeft: 10, marginBottom: 30 }}>
                    <View style={styles.drawerHeader}>
                        <Body style={{ alignItems: 'center' }}>
                            <View style={styles.profileContainer}>
                                <Image style={styles.profileImage} source={{ uri: user.image }} />
                                <TouchableOpacity style={styles.authContainer} onPress={() => this.props.navigation.navigate( this.props.auth == null ? 'login' : 'profile')}>
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
                                    this.userLogout()
                                } else if (route.route.key === 'signIn') {
                                    this.props.navigation.navigate('login');
                                }else {

                                    this.props.navigation.navigate(route.route.key);
                                }
                            }
                        }
						items={ this.renderDrawerTabs() }
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', flex: 1 }}>
                        {
                            this.state.site_social.map((social, i) => {
                                return (
									<TouchableOpacity key={i} style={{ padding: 3 }} onPress={() => { Linking.openURL(social.link) }}>
										<Image style={{ width: 30, height: 30 }} source={{ uri: social.logo }}/>
									</TouchableOpacity>
                                )
                            })
                        }

                    </View>
                </Content>
                    {/*<TouchableOpacity style={{ position: 'absolute', left: 250, top: '45%' }}>*/}
                        {/*<Image style={{ width: 50, height: 50 }} source={require('../../assets/images/button.png')} />*/}
                    {/*</TouchableOpacity>*/}
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
        borderRadius: 40,
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

export default connect(mapStateToProps, { logout })(DrawerCustomization);