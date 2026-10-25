import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PokemonCard from '../components/PokemonCard';
import useResponsive from '../hooks/useResponsive';
import { getPokemonByIdOrName, getPokemonPage } from '../services/pokemonApi';
import { colors } from '../theme/colors';
import {
  extractPokemonId,
  getPokemonImageUrl,
  normalizedSearch,
} from '../utils/pokemonUtils';

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [searchedPokemon, setSearchedPokemon] = useState(null);
  const [searching, setSearching] = useState(false);
  const isLoadingPokemonsRef = useRef(false);
  const { columns, paddingHorizontal } = useResponsive();

  const searchPokemon = async () => {
    const pokemon = normalizedSearch(search);
    if (!pokemon) return;
    try {
      setSearching(true);
      setSearchedPokemon(null);
      setError('');
      const data = await getPokemonByIdOrName(pokemon);
      setSearchedPokemon({
        id: data.id,
        name: data.name,
        imageUrl: getPokemonImageUrl(data.id),
      });
    } catch (err) {
      setError('Este Pokémon no existe.');
    }
  };

  const loadPokemons = async (offset = 0) => {
    if (isLoadingPokemonsRef.current || (offset > 0 && !hasMore)) return;

    isLoadingPokemonsRef.current = true;
    setLoading(true);
    setError('');

    try {
      const data = await getPokemonPage(20, offset);
      setHasMore(data.next !== null);
      const formattedPokemons = data.results.map((pokemon) => {
        const id = extractPokemonId(pokemon.url);

        return {
          id: id,
          name: pokemon.name,
          imageUrl: getPokemonImageUrl(id),
        };
      });

      setResults((previous) =>
        offset === 0 ? formattedPokemons : [...previous, ...formattedPokemons],
      );
    } catch (err) {
      setError('No se pudo cargar la información. Revisa tu internet');
    } finally {
      isLoadingPokemonsRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemons(0);
  }, []);

  const renderFooter = () => {
    if (searchedPokemon) return null;
    if (loading) {
      return <ActivityIndicator size="small" color={colors.roseGold} />;
    }

    if (!hasMore && results.length > 0) {
      return (
        <Text style={styles.emptyText}>No hay más pokémon por mostrar.</Text>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokedex Explorer</Text>
        <Text style={styles.subtitle}>
          ¡Descubre los secretos de cada Pokémon ahora mismo!
        </Text>
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
          onSubmitEditing={() => searchPokemon()}
        />

        {search.length > 0 && (
          <Pressable
            onPress={() => {
              setSearch('');
              setSearchedPokemon(null);
              setSearching(false);
              setError('');
            }}
            accessibilityLabel="Limpiar búsqueda"
          >
            <Ionicons name="close-circle" size={20} color={colors.roseGold} />
          </Pressable>
        )}
      </View>

      <ScrollView
        style={styles.categoriesContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {/* Aquí irán los tipos Pokémon */}
      </ScrollView>

      <Text style={styles.sectionTitle}>Explora Pokemon</Text>

      <FlatList
        key={columns}
        data={searching ? (searchedPokemon ? [searchedPokemon] : []) : results}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PokemonCard
            data={item}
            onPress={() =>
              navigation.navigate('PokemonDetailScreen', { pokemonId: item.id })
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
        ListFooterComponent={renderFooter}
        onEndReached={() => {
          if (!searchedPokemon && hasMore && !loading && !error) {
            loadPokemons(results.length);
          }
        }}
        onEndReachedThreshold={0.4}
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
  nextButton: {
    backgroundColor: colors.primaryButton,
    borderRadius: 18,
    paddingHorizontal: 26,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 10,
    marginVertical: 16,
    minWidth: 170,

    shadowColor: colors.roseGold,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  nextButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },

  nextButtonText: {
    color: colors.pinkIvory,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
