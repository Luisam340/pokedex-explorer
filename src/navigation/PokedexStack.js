import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PokemonDetailScreen from '../screens/PokemonDetailScreen';
const Stack = createNativeStackNavigator();

export default function PokedexStack() {
  return (
    <Stack.Navigator id="PokedexStack">
       <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false}}
      ></Stack.Screen>
      <Stack.Screen
        name="PokemonDetailScreen"
        component={PokemonDetailScreen}
        options={{ title: 'Información del Pokémon', headerShown: true, headerBackTitle: 'Atrás' }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
