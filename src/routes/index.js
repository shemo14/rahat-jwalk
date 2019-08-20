import React from 'react';
import { View, Text, Platform } from 'react-native'
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
import NewOrder from "../components/NewOrder";
import AcceptOrder from "../components/AcceptOrder";
import Commission from "../components/Commission";
import ContactUs from "../components/ContactUs";
import NewOrders from "../components/NewOrders";
import FinishOffer from "../components/FinishOffer";
import RenderMapView from "../components/RenderMapView";
import ForgetPassword from "../components/ForgetPassword";
import AcceptOffer from "../components/AcceptOffer";
import FinishOrder from "../components/FinishOrder";
import DeleteOrder from "../components/DeleteOrder";
import Plans from "../components/Plans";
import Notes from "../components/Notes";
import ConfirmCode from "../components/ConfirmCode";
import RenewPassword from "../components/RenewPassword";
import Chat from "../components/Chat";
import Notification from "../components/Notification";
import ChatConv from "../components/ChatConv";


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
   newOrders: NewOrders,
   chooseOffer: ChooseOffers,
   vendorDetails: VendorDetails,
   finishedOrders: FinishedOrder,
   profile: Profile,
   joinToProvider: JoinToVendors,
   newOrder: NewOrder,
   acceptOrder: AcceptOrder,
   chat: Chat,
   commission: Commission,
   contactUs: ContactUs,
   storage: Storage,
   plans: Plans,
   notes: Notes,
   notification: Notification,
   chatConv: ChatConv,

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
        drawerPosition:  Platform.OS ==  'ios' ? '' : 'right',
        contentComponent: CustomDrawerContentComponent,
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        gesturesEnabled: false,
        drawerToggleRoute: 'DrawerToggle'
    }
);

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
	newOrder: {
		screen: NewOrder,
		navigationOptions: {
			header: null
		}
	},
	acceptOrder: {
		screen: AcceptOrder,
		navigationOptions: {
			header: null
		}
	},
	contactUs: {
		screen: ContactUs,
		navigationOptions: {
			header: null
		}
	},
	newOrders: {
		screen: NewOrders,
		navigationOptions: {
			header: null
		}
	},
	finishOffer: {
		screen: FinishOffer,
		navigationOptions: {
			header: null
		}
	},
	renderMapView: {
		screen: RenderMapView,
		navigationOptions: {
			header: null
		}
	},
	forgetPassword: {
		screen: ForgetPassword,
		navigationOptions: {
			header: null
		}
	},
	acceptOffer: {
		screen: AcceptOffer,
		navigationOptions: {
			header: null
		}
	},
	finishOrder: {
		screen: FinishOrder,
		navigationOptions: {
			header: null
		}
	},
	deleteOrder: {
		screen: DeleteOrder,
		navigationOptions: {
			header: null
		}
	},
    commission: {
        screen: Commission,
        navigationOptions: {
            header: null
        }
    },
    plans: {
        screen: Plans,
        navigationOptions: {
            header: null
        }
    },
    notes: {
        screen: Notes,
        navigationOptions: {
            header: null
        }
    },
    confirmCode: {
        screen: ConfirmCode,
        navigationOptions: {
            header: null
        }
    },
    renewPassword: {
        screen: RenewPassword,
        navigationOptions: {
            header: null
        }
    },
    chatConv: {
        screen: ChatConv,
        navigationOptions: {
            header: null
        }
    },
    chat: {
        screen: Chat,
        navigationOptions: {
            header: null
        }
    },
}, {
    navigationOptions: {
        headerStyle: { backgroundColor: '#437c1a' },
		backBehavior: 'none',
		header: null
    },

    notification: {
        screen: Notification,
        navigationOptions: {
            header: null
        }
    }
});

export default AppStack;