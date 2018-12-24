import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, Textarea, Form } from 'native-base';
import { ImagePicker } from 'expo';


class ProblemDesc extends Component{
    constructor(props){
        super(props);
        this.state = {
            problemList: this.props.navigation.state.params.problemList,
            companyId: this.props.navigation.state.params.companyId,
            modelId: this.props.navigation.state.params.modelId,
            type: this.props.navigation.state.params.type,
            desc: '',
            image1Base64: '',
            image2Base64: '',
        }
    }

    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    _pickImage = async (imageName) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: true
        });

        if (!result.cancelled) {
            if (imageName === 'image_1')
                this.setState({ image1Base64: result.base64 });
            else
                this.setState({ image2Base64: result.base64 });
        }
    };

    onPressConfirm(){
        this.props.navigation.navigate('determinedLocation', { params: { companyId: this.state.companyId, modelId: this.state.modelId, problemList: this.state.problemList, desc: this.state.desc, image1: this.state.image1Base64, image2: this.state.image2Base64, type: this.state.type } })
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
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>اوصف المشكلة</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate('problems')}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content style={{ padding: 10 }}>
                    <View style={{ flex: 1, width: '100%' }}>
                        {/*<View style={{ alignItems: 'center', width: 80, height: 80, borderRadius: 50, marginTop: 30, backgroundColor: '#f7f7f9', borderWidth: 1, borderColor: '#ebebed', justifyContent: 'center', alignSelf: 'center' }}>*/}
                            {/*<Image resizeMode={'center'} style={{ height: 60, width: 60 }} source={{ uri: 'http://pngimg.com/uploads/samsung_logo/samsung_logo_PNG9.png' }}/>*/}
                        {/*</View>*/}
                        {/*<Text style={{ fontSize: 18, textAlign: 'center', color: '#747474', marginBottom: 30, marginTop: 5 }}>سماعه</Text>*/}

                        <Form>
                            <Textarea onChangeText={(desc) => this.setState({ desc })} rowSpan={5} placeholderTextColor={{ color: '#d4d4d4' }} style={{ backgroundColor: '#f4f4f4', borderColor: '#ededed', borderWidth: 1, borderRadius: 5 }} bordered placeholder="وصف المشكلة ..." />

                            <TouchableOpacity  style={{ flexDirection: 'row', backgroundColor: '#f4f4f4', borderWidth: 1, height: 35,borderColor: '#ededed', borderRadius: 5, alignItems: 'center', marginTop: 5 }} onPress={() => this._pickImage('image_1')}>
                                <Icon type={'Entypo'} name={'upload'} style={{ color: '#4a862f', fontSize: 20, marginRight: 7, marginLeft: '38%' }}/>
                                <Text style={{ color: '#989899', textAlign: 'center', fontSize: 15 }}>ارفق صورة</Text>
                            </TouchableOpacity>

                            <TouchableOpacity  style={{ flexDirection: 'row', backgroundColor: '#f4f4f4', borderWidth: 1, height: 35,borderColor: '#ededed', borderRadius: 5, alignItems: 'center', marginTop: 5 }} onPress={() => this._pickImage('image_2')}>
                                <Icon type={'Entypo'} name={'upload'} style={{ color: '#4a862f', fontSize: 20, marginRight: 7, marginLeft: '38%' }}/>
                                <Text style={{ color: '#989899', textAlign: 'center', fontSize: 15 }}>ارفق صورة</Text>
                            </TouchableOpacity>
                        </Form>
                    </View>
                </Content>
                <View style={{ padding: 10 }}>
                    <Button disabled={this.state.desc === '' ? true : false} block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 20}} onPress={() => this.onPressConfirm()} primary>
                        <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
                    </Button>
                </View>
            </Container>
        )
    }
}

const styles={

};

export default ProblemDesc;