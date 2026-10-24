import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import PokemonCard from '../components/PokemonCard';
import useResponsive from '../hooks/useResponsive';
import { getPokemonPage } from '../services/pokemonApi';
import { extractPokemonId, getPokemonImageUrl } from '../utils/pokemonUtils';

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const { columns, paddingHorizontal } = useResponsive();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadPokemons = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getPokemonPage(20, 0);
        const formattedPokemons = data.results.map((pokemon) => {
          const id = extractPokemonId(pokemon.url);
          return {
            id: id,
            name: pokemon.name,
            imageUrl: getPokemonImageUrl(id),
          };
        });
        if (active) {
          setResults(formattedPokemons);
        }
      } catch (err) {
        if (active) {
          setError('No se pudo conectar con la API. Revisa tu internet');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPokemons();
    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokedex Explorer</Text>
        <Text style={styles.subtitle}>¡Descubre los secretos de cada Pokémon ahora mismo!</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.roseGold} />

        <TextInput
          style={styles.searchInput}
          placeholder="Busca por nombre o número..."
          placeholderTextColor={colors.roseGold}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {search.length > 0 && (
          <Pressable
            onPress={() => setSearch('')}
            accessibilityLabel="Limpiar búsqueda"
          >
            <Ionicons name="close-circle" size={20} color={colors.roseGold} />
          </Pressable>
        )}
      </View>

      {/* Categorías: se agregarán después */}
      <ScrollView
        style={styles.categoriesContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {/* Aquí irán los tipos Pokémon */}
      </ScrollView>

      {/* Título de sección */}
      <Text style={styles.sectionTitle}>Explora Pokemon</Text>

      {/* Lista */}
      <FlatList
        key={columns}
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PokemonCard
            data={item}
            onPress={() =>
              navigation.navigate('PokemonDetail', {
                
              })
            }
          />
        )}
        numColumns={columns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={columns > 1 ? styles.listRow : undefined}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.roseGold} />
          ) : error ? (
            <Text style={styles.emptyText}>{error}</Text>
          ) : (
            <Text style={styles.emptyText}>
              Aún no hay Pokemon para mostrar.
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pinkIvory,
    paddingTop: 20,
  },

  header: {
    marginBottom: 22,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: 14,
    color: colors.roseGold,
    marginTop: 5,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.lavender,
    paddingHorizontal: 15,
    minHeight: 52,
    gap: 10,
    marginBottom: 15,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 10,
  },

  categoriesContainer: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },

  listContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },

  listRow: {
    justifyContent: 'space-between',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 45,
    fontSize: 14,
    color: colors.roseGold,
  },
});
