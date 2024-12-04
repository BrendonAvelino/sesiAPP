import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando o AsyncStorage

import notebook from '../img/notebook.png';

const PaginaInicial = () => {
  const navigation = useNavigation();

  const handleNavigate = async (option) => {
    try {
      // Salvar 'alunoId' no AsyncStorage
      // await AsyncStorage.setItem('alunoId', '5');
      // Navegar para a próxima tela
      navigation.navigate(option);
    } catch (error) {
      console.error('Erro ao salvar alunoId:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={notebook} style={styles.image} />
      <Text style={styles.description}>O App da sua instituição de ensino</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleNavigate('PaginaLogin')}>
        <Text style={styles.buttonText}>Continuar para o Login</Text>
        <Icon name="arrow-forward" size={20} color="#00B8AE" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00B8AE',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  description: {
    fontSize: 26,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 60,
    padding: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: '#00B8AE',
    marginRight: 10,
  },
});

export default PaginaInicial;
