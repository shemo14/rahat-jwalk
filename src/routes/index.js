import React from 'react';
import { View, Text } from 'react-native'
import { Icon, Button } from 'native-base'
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, DrawerItems } from 'react-navigation';
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import Home from '../components/Home'
import Brands from '../components/Brands'
import Models from '../components/Models'
import Storage from '../components/Storage'
import Problems from '../components/Problems'
import ProblemDesc from '../components/ProblemDesc'
import DeterminedLocation from '../components/DeterminedLocation'
import ConfirmOrder from '../components/ConfirmOrder'
import InitScreen from '../components/InitScreen'
import DrawerTabs from '../components/DrawerTabs'
import DrawerCustomization from './DrawerCustomization'
import Colors from "../components/Colors";
import Accessories from "../components/Accessories";
import SimCards from "../components/SimCards";
import SimSize from "../components/SimSize";
import CurrentOrders from "../components/CurrentOrders";
import ChooseOffers from "../components/ChooseOffers";
import VendorDetails from "../components/VendorDetails";
import FinishedOrder from "../components/FinishedOrder";
import Profile from "../components/Profile";
import JoinToVendors from "../components/JoinToVendors";


const CustomDrawerContentComponent = (props) => (<DrawerCustomization { ...props }/>);
const drawerNavigation = createDrawerNavigator({
   home: Home ,
   brands: Brands,
   models: Models,
   problems: Problems,
   problemDesc: ProblemDesc,
   determinedLocation: DeterminedLocation,
   colors: Colors,
   accessory: Accessories,
   simCards: SimCards,
   simSize: SimSize,
   currentOrders: CurrentOrders,
   chooseOffer: ChooseOffers,
   vendorDetails: VendorDetails,
   finishedOrders: FinishedOrder,
   profile: Profile,
   joinToProvider: JoinToVendors,

   logout: {
       screen: DrawerTabs,
       navigationOptions: {
           drawerLabel: 'تسجيل الخروج',
           drawerIcon: ( <Icon style={{ fontSize: 20, color: '#437c1a' }} type={'MaterialCommunityIcons'} name={'logout'}/> )
       }
   },
},
    {
        initialRouteName: 'home',
        drawerPosition: 'right',
        contentComponent: CustomDrawerContentComponent,
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        gesturesEnabled: false,
        drawerToggleRoute: 'DrawerToggle'
    });

const AppStack = createStackNavigator({
    initScreen: {
        screen: InitScreen,
        navigationOptions: {
            header: null
        }
    },
    login: {
        screen: Login,
        navigationOptions: {
            header: null
        }
    },
    drawerNavigation:{
        screen: drawerNavigation,
        navigationOptions: {
            header: null,
        }
    },
    home: {
        screen: Home,
    },
    signUp: {
        screen: SignUp,
        navigationOptions: {
            header: null
        }
    },
    brands: {
        screen: Brands,
        navigationOptions: {
            header: null,
        }
    },
    models: {
        screen: Models,
        navigationOptions: {
            header: null,
        }
    },
    storage: {
        screen: Storage,
        navigationOptions: {
            header: null,
        }
    },
    problems: {
        screen: Problems,
        navigationOptions: {
            header: null,
        }
    },
    problemDesc: {
        screen: ProblemDesc,
        navigationOptions: {
            header: null,
        }
    },
    determinedLocation: {
        screen: DeterminedLocation,
        navigationOptions: {
            header: null,
        }
    },
    confirmOrder: {
        screen: ConfirmOrder,
        navigationOptions: {
            header: null,
        }
    },
    colors: {
        screen: Colors,
        navigationOptions: {
            header: null,
        }
    },
    accessory: {
        screen: Accessories,
        navigationOptions: {
            header: null,
        }
    },
    simCards: {
        screen: SimCards,
        navigationOptions: {
            header: null,
        }
    },
    simSize: {
        screen: SimSize,
        navigationOptions: {
            header: null,
        }
    },
    currentOrders: {
        screen: CurrentOrders,
        navigationOptions: {
            header: null
        }
    },
    chooseOffer: {
        screen: ChooseOffers,
        navigationOptions: {
            header: null
        }
    },
    vendorDetails: {
        screen: VendorDetails,
        navigationOptions: {
            header: null,
        }
    },
    finishedOrders: {
        screen: FinishedOrder,
        navigationOptions: {
            header: null,
        }
    },
    profile: {
        screen: Profile,
        navigationOptions: {
            header: null
        }
    },
    joinToProvider: {
        screen: JoinToVendors,
        navigationOptions: {
            header: null
        }
    },
}, {
    navigationOptions: {
        headerStyle: { backgroundColor: '#437c1a' },
    }
});

export default AppStack;