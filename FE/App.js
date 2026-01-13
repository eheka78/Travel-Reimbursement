import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider } from "./app/context/AuthContext";
import Home from "./app/screens/Home";
import Login from "./app/screens/Login";
import Trip from "./app/screens/Trip";
import TripSetting from "./app/screens/TripSetting";
import TripMember from "./app/screens/TripMember";
import AccountBook from "./app/screens/AccountBook";
import AddExpense from "./app/screens/AddExpense";
import ExpenseDetail from "./app/screens/ExpenseDetail";
import AddTrip from "./app/screens/AddTrip";
import EditTripSetting from './app/screens/EditTripSetting';
import EditExpense from "./app/screens/EditExpense";
import ImageCollection from "./app/screens/ImageCollection";
import ReceiptDetail from "./app/screens/ReceiptDetail";
import Signup from "./app/screens/Signup";


const Stack = createNativeStackNavigator();


export default function App() {
	return (
		<AuthProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Login">
					<Stack.Screen
						name="Home"
						component={Home}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Login"
						component={Login}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Signup"
						component={Signup}
						options={{ headerShown: false }}
					/>
					<Stack.Screen name="Trip" component={Trip} />
					<Stack.Screen name="AddTrip" component={AddTrip} />
					<Stack.Screen name="TripSetting" component={TripSetting} />
					<Stack.Screen name="EditTripSetting" component={EditTripSetting} />
					<Stack.Screen name="TripMember" component={TripMember} />
					<Stack.Screen name="ImageCollection" component={ImageCollection} />
					<Stack.Screen
						name="ReceiptDetail"
						component={ReceiptDetail}
						options={{ headerShown: false }}
					/>
					<Stack.Screen name="AccountBook" component={AccountBook} />
					<Stack.Screen name="AddExpense" component={AddExpense} />
					<Stack.Screen name="ExpenseDetail" component={ExpenseDetail} />
					<Stack.Screen name="EditExpense" component={EditExpense} />
				</Stack.Navigator>
			</NavigationContainer>
		</AuthProvider>
	);
}
