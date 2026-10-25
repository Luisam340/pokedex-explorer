import { StyleSheet} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import PokedexStack from './src/navigation/PokedexStack';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <PokedexStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
