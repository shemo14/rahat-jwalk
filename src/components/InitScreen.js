import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Permissions } from 'expo'
import {AsyncStorage, BackHandler} from "react-native";


class InitScreen extends Component{
    constructor(props){
        super(props);
    }


    componentWillMount = async () => {
        // AsyncStorage.clear();
        console.log('init screen...', this.props.auth);

        if (this.props.auth !== null)
            this.props.navigation.navigate('drawerNavigation');
        else
            this.props.navigation.navigate('login');

        let { status } = await Permissions.askAsync(Permissions.LOCATION);

    };

    render(){
        return false;
    }
}



const mapStateToProps = ({ auth, profile }) => {
    return {
        message: auth.message,
        loading: auth.loading,
        auth: auth.user,
        user: profile.user
    };
};
export default connect(mapStateToProps)(InitScreen);