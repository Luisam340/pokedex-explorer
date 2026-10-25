import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPokemonByIdOrName } from '../services/pokemonApi';
import { colors } from '../theme/colors';
import {
  capitalizeName,
  translatePokemonType,
  translateStatName,
} from '../utils/pokemonUtils';

export default function PokemonDetailScreen({ route, navigation }) {
  const { pokemonId } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadPokeInfo = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getPokemonByIdOrName(pokemonId);

        if (active) {
          setPokemon(data);
        }
      } catch (err) {
        if (active) {
          setError('No se pudo cargar la información del Pokémon.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPokeInfo();

    return () => {
      active = false;
    };
  }, [pokemonId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primaryButton} />
        <Text style={styles.statusText}>Cargando Pokémon...</Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.center}>
        <Text style={styles.statusText}>
          {error || 'Pokémon no encontrado.'}
        </Text>
      </View>
    );
  }

  const pokemonImage = pokemon.sprites.other['official-artwork'].front_default;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.pokemonCard}>
          <Image source={{ uri: pokemonImage }} style={styles.pokemonImage} />

          <Text style={styles.pokemonName}>{capitalizeName(pokemon.name)}</Text>

          <Text style={styles.pokemonNumber}>
            #{String(pokemon.id).padStart(3, '0')}
          </Text>

          <View style={styles.typesContainer}>
            {pokemon.types.map((item) => {
              const type = item.type.name;

              return (
                <View
                  key={type}
                  style={[
                    styles.typeBadge,
                    { backgroundColor: colors[type] },
                  ]}
                >
                  <Text style={styles.typeText}>
                    {capitalizeName(translatePokemonType(type))}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.measurementsContainer}>
          <View style={styles.measurementCard}>
            <Ionicons
              name="resize-outline"
              size={24}
              color={colors.primaryButton}
            />

            <Text style={styles.measurementLabel}>Altura</Text>

            <Text style={styles.measurementValue}>
              {(pokemon.height / 10).toLocaleString('es-CO')} m
            </Text>
          </View>

          <View style={styles.measurementCard}>
            <Ionicons
              name="scale-outline"
              size={24}
              color={colors.primaryButton}
            />

            <Text style={styles.measurementLabel}>Peso</Text>

            <Text style={styles.measurementValue}>
              {(pokemon.weight / 10).toLocaleString('es-CO')} kg
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Estadísticas</Text>

        <View style={styles.statsContainer}>
          {pokemon.stats.map((item) => {
            const name = item.stat.name;
            const value = item.base_stat;
            const percentage = Math.min((value / 255) * 100, 100);

            return (
              <View key={name} style={styles.statRow}>
                <Text style={styles.statLabel}>{translateStatName(name)}</Text>

                <View style={styles.statTrack}>
                  <View
                    style={[styles.statFill, { width: `${percentage}%` }]}
                  />
                </View>

                <Text style={styles.statValue}>{value}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pinkIvory,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 35,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.pinkIvory,
    padding: 20,
  },

  statusText: {
    color: colors.textPrimary,
    fontSize: 15,
    marginTop: 14,
    textAlign: 'center',
  },

  pokemonCard: {
    backgroundColor: colors.pastelPink,
    borderRadius: 26,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dustyPink,
    marginBottom: 18,
  },

  pokemonImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },

  pokemonName: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },

  pokemonNumber: {
    fontSize: 15,
    color: colors.roseGold,
    marginTop: 5,
  },

  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },

  typeBadge: {
    // backgroundColor: colors.pastelLilac,
    borderRadius: 20,
    paddingHorizontal: 17,
    paddingVertical: 8,
  },

  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  measurementsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },

  measurementCard: {
    flex: 1,
    backgroundColor: colors.pastelLilac,
    borderRadius: 20,
    paddingVertical: 19,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 7,
  },

  measurementLabel: {
    fontSize: 13,
    color: colors.roseGold,
  },

  measurementValue: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 18,
  },

  statsContainer: {
    gap: 17,
    paddingBottom: 12,
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  statLabel: {
    width: 91,
    fontSize: 12,
    color: colors.textPrimary,
  },

  statTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.pastelLilac,
    borderRadius: 10,
    overflow: 'hidden',
  },

  statFill: {
    height: '100%',
    backgroundColor: colors.roseGold,
    borderRadius: 10,
  },

  statValue: {
    width: 27,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'right',
  },
});
