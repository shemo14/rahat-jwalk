import React, { Component } from 'react';
import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, Item ,List, ListItem, CheckBox, Input, Form } from 'native-base';
import {connect} from "react-redux";
import {Spinner} from "../common";
import {ImagePicker, Permissions} from 'expo';
import { joinAsProvider } from '../actions/ProfileAction'


class JoinToVendors extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: this.props.auth.name,
            idNumber: '',
            IDBase64: null,
            mainBase64: null,
            tradBase64: null,
			userBase64: null,
            confirmPassword: '',
            loader: false,
            userImage: null,
            phone: this.props.auth.phone,
			mob_maintenance: false,
			mob_seller: false,
			accessories_seller: false,
			sim_card: false,
        }
    }

    static navigationOptions = () => ({
        drawerLabel: 'التسجيل للانظمام الينا',
        drawerIcon: ( <Icon style={{ fontSize: 20, color: '#437c1a' }} type={'FontAwesome'} name={'users'}/> )
    });

	renderProviderServices(){
			return (
				<View>
					<View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
						<Icon type={'Entypo'} name={'tools'} style={{ color: '#82b37d', marginRight: 5, top: 3 }}/>
						<Text style={{ color: '#82b37d', textAlign: 'center' }}>الخدمات التي ترغب في تقديمها</Text>
					</View>

					<List>
						<ListItem onPress={() => this.state.mob_maintenance ? this.setState({ mob_maintenance: false }) : this.setState({ mob_maintenance: true })} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
							<Left style={{ flex: 1 }}>
								<Icon type={'Ionicons'} name={'ios-settings'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10, height: 22 }}/>
								<Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4, height: 22 }}>صيانة</Text>
							</Left>
							<Right style={{ flex: 1 }}>
								<CheckBox style={{ borderRadius: 3, paddingRight: 4 }} checked={this.state.mob_maintenance} onPress={() => this.state.mob_maintenance ? this.setState({ mob_maintenance: false }) : this.setState({ mob_maintenance: true })} color="#437c1a"/>
							</Right>
						</ListItem>

						<ListItem onPress={() => this.state.mob_seller ? this.setState({ mob_seller: false }) : this.setState({ mob_seller: true })} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
							<Left style={{ flex: 1 }}>
								<Icon type={'Entypo'} name={'mobile'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10, height: 22 }}/>
								<Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4, height: 22 }}>بيع جولات</Text>
							</Left>
							<Right style={{ flex: 1 }}>
								<CheckBox style={{ borderRadius: 3, paddingRight: 4 }} checked={this.state.mob_seller} onPress={() => this.state.mob_seller ? this.setState({ mob_seller: false }) : this.setState({ mob_seller: true })} color="#437c1a"/>
							</Right>
						</ListItem>

						<ListItem onPress={() => this.state.accessories_seller ? this.setState({ accessories_seller: false }) : this.setState({ accessories_seller: true })} noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
							<Left style={{ flex: 1 }}>
								<Icon type={'MaterialCommunityIcons'} name={'cellphone-screenshot'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10, height: 22 }}/>
								<Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4, height: 22 }}>بيع اكسسوارات</Text>
							</Left>
							<Right style={{ flex: 1 }}>
								<CheckBox style={{ borderRadius: 3, paddingRight: 4 }} checked={this.state.accessories_seller} onPress={() => this.state.accessories_seller ? this.setState({ accessories_seller: false}) : this.setState({ accessories_seller: true })} color="#437c1a"/>
							</Right>
						</ListItem>

						<ListItem onPress={() => this.state.sim_card ? this.setState({ sim_card: false }) : this.setState({ sim_card: true }) } noBorder style={{ flex: 1, marginLeft: 0, backgroundColor: '#f7f7f9', borderColor: '#f1f1f2', borderWidth: 1, borderRadius: 5, margin: 5, height: 40 }}>
							<Left style={{ flex: 1 }}>
								<Icon type={'MaterialIcons'} name={'sim-card'} style={{ color: '#478947', fontSize: 20, marginRight: 15, marginLeft: 10, height: 22 }}/>
								<Text style={{ color: '#69696a', fontSize: 16, marginLeft: 4, marginRight: 4, height: 22 }}>شرائح بيانات</Text>
							</Left>
							<Right style={{ flex: 1 }}>
								<CheckBox style={{ borderRadius: 3, paddingRight: 4 }} checked={this.state.sim_card} onPress={() => this.state.sim_card ? this.setState({ sim_card: false }) : this.setState({ sim_card: true }) } color="#437c1a"/>
							</Right>
						</ListItem>
					</List>
				</View>
			);
	}

	askPermissionsAsync = async () => {
		await Permissions.askAsync(Permissions.CAMERA);
		await Permissions.askAsync(Permissions.CAMERA_ROLL);

	};

    _pickImage = async (type) => {
    	this.askPermissionsAsync();


        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: true,
        });

        if (!result.cancelled) {
            if (type === 'profile')
                this.setState({ userImage: result.uri, base64: result.base64 });
            else if (type === 'ID')
				this.setState({ IDBase64: result.base64 });
			else if (type === 'main')
				this.setState({ mainBase64: result.base64 });
			else if (type === 'trad')
				this.setState({ tradBase64: result.base64 });

        }
    };

	onJoinPressed(){
	    const data = {
			id: this.props.auth.id,
			name: this.state.name,
			identity_num: this.state.identity_num,
			phone: this.state.phone === this.props.auth.phone ? null : this.state.phone,
			mob_maintenance: this.state.mob_maintenance,
			mob_seller: this.state.mob_seller,
			accessories_seller: this.state.accessories_seller,
			sim_card: this.state.sim_card,
			userBase64: this.state.userBase64,
			IDBase64: this.state.IDBase64,
			mainBase64: this.state.mainBase64,
			tradBase64: this.state.tradBase64
		}

		this.setState({ loader: true });
		this.props.joinAsProvider(data);
    }

	componentWillReceiveProps(newProps){
	    console.log(newProps, newProps.key);

	    if (newProps.key === undefined){
	        this.props.navigation.navigate('profile');
        }
		this.setState({ loader: false });
	}

    renderLoading(){
        if (this.state.loader){
            return(<Spinner />);
        }

		if (this.state.name === '' || this.state.phone === '' || this.state.IDBase64 === null || this.state.userImage === null ){
			return (
				<Button block disabled style={{marginTop: 20, marginBottom: 20, width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} light>
					<Text style={{color: '#999', fontSize: 17, textAlign: 'center' }}>حفظ</Text>
				</Button>
			);
		}

        return (
            <Button block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', marginBottom: 30}} onPress={() => { this.onJoinPressed()  }} primary>
                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>حفظ</Text>
            </Button>
        );
    }

    render(){
        let { userImage } = this.state;

        return(
            <Container>
                <Header style={{ height: 70, backgroundColor: '#437c1a', paddingTop: 15 }}>
                    <Right style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' type='Entypo' style={{ color: '#fff', fontSize: 30, marginTop: 8, left: -10 }} />
                        </Button>
                    </Right>
                    <Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>انضم الينا </Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content style={{ padding: 10 }}>
                    <View style={{ marginLeft: Platform.OS === 'ios' ? 20 : 0 }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this._pickImage('profile')} style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 55, padding: 3, width: 90, height: 90 }}>
                                {userImage != null ? <Image source={{ uri: userImage }} style={{ width: 100, height: 100, marginTop: 20, borderRadius: 80, borderWidth: 1, borderColor: '#f4f4f4', marginBottom: 20 }} /> : <Icon style={{ fontSize: 35, color: '#437c1a' }} type={'MaterialIcons'} name={'add-a-photo'}/> }
                            </TouchableOpacity>
                            <Text style={{ color: '#437c1a' }}>الصورة الشخصية</Text>
                        </View>

                        <View>
                            <Form style={{ alignItems: 'center' }}>
                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginBottom: 10,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20}} name={'user'} type={'FontAwesome'}/>
                                    <Input autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} value={this.state.name} onChangeText={(name) => this.setState({name})} style={{ alignSelf: 'flex-end' , color: '#277c19', height: 35, textAlign: 'right' }} placeholder='اسم المستخدم' />
                                </Item>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginBottom: 10,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20}} name={'v-card'} type={'Entypo'}/>
                                    <Input autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(idNumber) => this.setState({idNumber})} style={{ alignSelf: 'flex-end' , color: '#277c19', height: 35, textAlign: 'right' }} placeholder='رقم الهوية' />
                                </Item>

                                <Item style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginBottom: 10,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} name={'phone'} type={'FontAwesome'}/>
                                    <Input autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(phone) => this.setState({phone})} style={{ alignSelf: 'flex-end', height: 35, textAlign: 'right' }} placeholder='رقم الهاتف' value={this.state.phone}/>
                                </Item>

                                <Item onPress={() => this._pickImage('ID')} style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginBottom: 10,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20}} name={'v-card'} type={'Entypo'}/>
                                    <Input disabled autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(email) => this.setState({email})} style={{ alignSelf: 'flex-end', height: 35, textAlign: 'right' }} placeholder='صوره الهوية' value={this.state.email}/>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} type={'MaterialIcons'} name={'add-a-photo'}/>
                                </Item>

                                <Item onPress={() => this._pickImage('main')} style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginBottom: 10,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20}} name={'graduation-cap'} type={'FontAwesome'}/>
                                    <Input disabled autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(email) => this.setState({email})} style={{ alignSelf: 'flex-end', height: 35, textAlign: 'right' }} placeholder='صوره دورة الصيانة' value={this.state.email}/>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} type={'MaterialIcons'} name={'add-a-photo'}/>
                                </Item>

                                <Item onPress={() => this._pickImage('trad')} style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    // borderBottomColor: this.state.emailError === '' ? '#ddd' : '#ff0000',
                                    padding: 3,
                                    alignSelf: 'flex-start',
                                    height: 35,
                                    marginBottom: 10,
                                    marginLeft: 0
                                }}>
                                    <Icon style={{color: '#277c19', fontSize: 20}} name={'shop'} type={'Entypo'}/>
                                    <Input disabled autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(email) => this.setState({email})} style={{ alignSelf: 'flex-end', height: 35, textAlign: 'right' }} placeholder='صوره السجل التجاري' value={this.state.email}/>
                                    <Icon style={{color: '#277c19', fontSize: 20 }} type={'MaterialIcons'} name={'add-a-photo'}/>
                                </Item>
                            </Form>

							{ this.renderProviderServices() }

                            { this.renderLoading() }
                        </View>
                    </View>
                </Content>
            </Container>
        )
    }
}


const mapStateToProps = ({ profile }) => {
    return {
        auth: profile.user
    };
};

export default connect(mapStateToProps, { joinAsProvider })(JoinToVendors);