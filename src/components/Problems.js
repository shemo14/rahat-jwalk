import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, List, ListItem, CheckBox } from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';
import ProblemListItem from './ProblemListItem'


class Problems extends Component{
    constructor(props){
        super(props);
        this.state = {
            problems: [],
            availabel: 0,
            checked: false,
            key: '',
            checkedProblems: [],
            companyId: this.props.navigation.state.params.companyId,
            modelId: this.props.navigation.state.params.modelId,
            type: this.props.navigation.state.params.type,
        }
    }


    static navigationOptions = () => ({
        drawerLabel: ()=> null,
    });

    componentWillMount(){
        axios.post( CONST.url + 'show/problem' ).then(response => this.setState({ problems: response.data.data, key: response.data.key  }))
    }

    addToProblemList(id, type){
        let problemsList = this.state.checkedProblems;
        if (type){
            problemsList.push(id);
        }else{
            problemsList = problemsList.filter(problemId => problemId !== id);
        }

        this.setState({ checkedProblems: problemsList });
    }

    renderListItems(){
        return this.state.problems.map(problem => <ProblemListItem addProblem={(id, type) => this.addToProblemList(id, type)} key={problem.id} data={problem}/>)
    }

    renderLoader(){
        if (this.state.key === ''){
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 500 }}>
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
                    <Text style={{ color: '#fff', textAlign: 'center', marginRight: 20, fontSize: 18 }}>تحديد المشكلة</Text>
                    </Body>
                    <Left style={{ flex: 0 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                </Header>
                <Content style={{ padding: 10 }}>
                    { this.renderLoader() }
                    <View style={{ flex: 1, width: '100%' }}>
                        <List style={{ flex: 1 }}>
                            { this.renderListItems() }
                        </List>
                    </View>
                </Content>
                <View style={{ padding: 10 }}>
                    <Button block style={{marginTop: 20, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 20}} onPress={() => this.props.navigation.navigate('problemDesc', { problemList: this.state.checkedProblems, companyId: this.state.companyId, modelId: this.state.modelId, type: this.state.type })}>
                        <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
                    </Button>
                </View>
            </Container>
        )
    }
}


export default Problems;