import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Permissions } from 'expo'
import {AsyncStorage} from "react-native";


class InitScreen extends Component{
    constructor(props){
        super(props);
    }

    componentWillMount = async () => {
        // AsyncStorage.clear();
        console.log(this.props.profile);
        if (this.props.auth !== null && this.props.auth.key !== '0')
            this.props.navigation.navigate('drawerNavigation');
        else
            this.props.navigation.navigate('login');

        let { status } = await Permissions.askAsync(Permissions.LOCATION);

    };

    render(){
        return false
    }
}



const mapStateToProps = ({ auth, profile }) => {
    return {
        message: auth.message,
        loading: auth.loading,
        auth: auth.user,
        user: profile
    };
};
export default connect(mapStateToProps)(InitScreen);