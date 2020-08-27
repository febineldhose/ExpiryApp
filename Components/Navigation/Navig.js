import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../Home';
import Settings from '../Settings';
import Expired from '../Expired';
import {Icon} from 'react-native-elements';
import Details from '../Details';
import Search from '../Search';
import New from '../New';
import Styles from '../Constants/Styles';
import Login from '../Login';
import Forgottpassword from '../Forgottpassword';
import Registration from '../Registration';
import {Text} from 'react-native';
import Font from '../orientation/Orientation';
import {RFPercentage} from 'react-native-responsive-fontsize';
const ExpiryText = () => {
  return (
    <Text
      allowFontScaling={false}
      style={{
        fontWeight: 'bold',
        color: 'white',
        fontSize: Font(22),
      }}>
      ExpiryApp
    </Text>
  );
};
function ExpiredStack({navigation, route}) {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({tabBarVisible: false});
  } else {
    navigation.setOptions({tabBarVisible: true});
  }
  const ExpiredStack = createStackNavigator();
  return (
    <ExpiredStack.Navigator>
      <ExpiredStack.Screen
        name="Expired"
        component={Expired}
        options={{
          headerTitleAlign: 'left',
          headerTitle: () => <ExpiryText />,
          headerStyle: Styles.headerStyle,
          headerLeft: false,
        }}
      />
      <ExpiredStack.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
        }}
      />
      <ExpiredStack.Screen
        name="Details"
        component={Details}
        options={{
          headerStyle: Styles.headerStyle,
        }}
      />
    </ExpiredStack.Navigator>
  );
}
function HomeStack({navigation, route}) {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({tabBarVisible: false});
  } else {
    navigation.setOptions({tabBarVisible: true});
  }
  const HomeStack = createStackNavigator();
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitleAlign: 'left',
          headerTitle: () => <ExpiryText />,
          headerStyle: Styles.headerStyle,
          headerLeft: false,
        }}
      />
      <HomeStack.Screen
        name="Details"
        component={Details}
        options={{
          headerStyle: Styles.headerStyle,
        }}
      />
      <HomeStack.Screen
        name="New"
        component={New}
        options={{
          headerStyle: Styles.headerStyle,
        }}
      />
      <HomeStack.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="settings"
        component={Settings}
        options={{
          headerStyle: Styles.headerStyle,
        }}
      />
    </HomeStack.Navigator>
  );
}
function SettingsStack() {
  const SettingsStack = createStackNavigator();
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTitleAlign: 'left',
          headerTitle: () => <ExpiryText />,
          headerStyle: Styles.headerStyle,
          headerLeft: false,
        }}
      />
    </SettingsStack.Navigator>
  );
}

function TabNavig() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      options={{swipeEnabled: true}}
      initialRouteName="Home"
      screenOptions={({route}) => ({
        activeBackgroundColor: 'red',

        tabBarIcon: ({color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          }
          if (route.name === 'Expired') {
            iconName = 'schedule';
          }
          if (route.name === 'Settings') {
            iconName = 'settings';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'white',
        labelStyle: {fontSize: RFPercentage(1.7)},
        allowFontScaling: false,
        style: {backgroundColor: '#EAA571'},
      }}>
      <Tab.Screen name="Expired" component={ExpiredStack} />
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}
export default function Navig(props) {
  const SpalshRegLogin = createStackNavigator();
  return (
    <NavigationContainer>
      <SpalshRegLogin.Navigator
        initialRouteName={props.initialRoute !== null ? 'Main' : 'Login'}>
        <SpalshRegLogin.Screen
          name="Login"
          component={Login}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <SpalshRegLogin.Screen
          name="Registration"
          component={Registration}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <SpalshRegLogin.Screen
          name="Forgott"
          component={Forgottpassword}
          options={{
            headerTitle: 'Forgott',
            headerStyle: Styles.headerStyle,
          }}
        />
        <SpalshRegLogin.Screen
          name="Main"
          component={TabNavig}
          options={{
            headerShown: false,
          }}
        />
      </SpalshRegLogin.Navigator>
    </NavigationContainer>
  );
}
