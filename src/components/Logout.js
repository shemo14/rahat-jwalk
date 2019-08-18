import React, { Component } from 'react';
import { Icon } from 'native-base';
import {connect} from "react-redux";

class Logout extends Component{
    static navigationOptions = () => ({
        drawerLabel: this.props.auth == null ? 'تسجيل الدخول' : "تسجيل الدخول",
        drawerIcon: ( <Icon style={{ fontSize: 20, color: '#437c1a' }} type={'MaterialCommunityIcons'} name={this.props.auth == null ? 'login' : 'logout'}/> )
    });


    render(){
        return false;
    }
}


const mapStateToProps = ({ auth, profile }) => {
    return {
        auth: auth.user,
        user: profile.user
    };
};
export default connect(mapStateToProps, {  })(Logout);