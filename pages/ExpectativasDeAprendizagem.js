import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import Expec from '../img/Expec.png';

const ExpectativasDeAprendizagem = () => {
  const [materiaSelecionada, setMateriaSelecionada] = useState('História');
  const [expectativaAtiva, setExpectativaAtiva] = useState(null); // Mudança aqui
  const navigation = useNavigation();

  // Dados de exemplo para as matérias e expectativas
  const expectativasPorMateria = {
    História: [
      { titulo: '1.1 Título', texto: 'Texto da expectativa de História 1.1' },
      { titulo: '2.1 Título', texto: 'Texto da expectativa de História 2.1' },
      { titulo: '3.1 Título', texto: 'Texto da expectativa de História 3.1' },
      { titulo: '4.1 Título', texto: 'Texto da expectativa de História 4.1' },
      { titulo: '5.1 Título', texto: 'Texto da expectativa de História 5.1' },
    ],
    Matemática: [
      { titulo: '1.1 Título', texto: 'Texto da expectativa de Matemática 1.1' },
      { titulo: '2.1 Título', texto: 'Texto da expectativa de Matemática 2.1' },
      { titulo: '3.1 Título', texto: 'Texto da expectativa de Matemática 3.1' },
      { titulo: '4.1 Título', texto: 'Texto da expectativa de Matemática 4.1' },
      { titulo: '5.1 Título', texto: 'Texto da expectativa de Matemática 5.1' },
    ],
    // Adicione mais matérias aqui
  };

  // Função para alternar a expectativa ativa e fechar a anterior
  const toggleExpectativa = (index) => {
    setExpectativaAtiva(expectativaAtiva === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Seletor de Matéria */}
      <View style={styles.materiaContainer}>
        <Text style={styles.materiaText}>Matéria:</Text>
        <Picker
          selectedValue={materiaSelecionada}
          style={styles.picker}
          onValueChange={(itemValue) => setMateriaSelecionada(itemValue)}
        >
          <Picker.Item label="História" value="História" />
          <Picker.Item label="Matemática" value="Matemática" />
          {/* Adicione mais opções de matérias aqui */}
        </Picker>
      </View>

      {/* Lista de Expectativas */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.expectativaInicio}>
          {expectativasPorMateria[materiaSelecionada].map((expectativa, index) => (
            <View key={index} style={styles.expectativaContainer}>
              {/* Título da Expectativa */}
              <TouchableOpacity
                style={styles.tituloContainer}
                onPress={() => toggleExpectativa(index)}
              >
                <Text style={styles.tituloText}>{expectativa.titulo}</Text>
                <Text style={styles.icon}>{expectativaAtiva === index ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {/* Texto da Expectativa (expandido ou recolhido) */}
              {expectativaAtiva === index && (
                <View style={styles.textoContainer}>
                  <Text style={styles.texto}>{expectativa.texto}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Botão de Voltar */}
      <View style={styles.voltarBox}>
        <View style={styles.voltarButton}>
          <Image style={styles.iconImage} source={Expec} />
          <Text style={styles.voltarText}>Expec. de Aprendizagem</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.fecharIcon}>
              <Text style={styles.fecharIconText}>X</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 60, // Espaço para evitar sobreposição no topo
  },
  scrollContainer: {
    marginTop: -40,
    paddingBottom: 100,
    marginLeft: 10,
    marginRight: 10,
  },
  materiaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centraliza horizontalmente
    marginBottom: 10,
    backgroundColor: '#E5383B',
    width: '50%', // Ajusta para centralização
    alignSelf: 'center', // Garante que fique no centro
    borderRadius: 20,
    paddingLeft: 10,
    marginRight: 10
  },
  materiaText: {
    fontSize: 16,
    marginRight: 10,
    color: 'white',
  },
  picker: {
    flex: 1,
    height: 50,
    color: 'white',
  },
  expectativaInicio: {
    marginTop: 50, // Ajuste para distanciar do seletor de matéria
  },
  expectativaContainer: {
    marginBottom: 10,
  },
  tituloContainer: {
    backgroundColor: '#E5383B',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tituloText: {
    fontSize: 16,
    color: '#FFF',
  },
  icon: {
    color: 'white',
  },
  textoContainer: {
    backgroundColor: '#F1A7A1',
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  texto: {
    color: '#333',
  },
  voltarBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  voltarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voltarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    paddingRight: 80,
  },
  fecharIcon: {
    backgroundColor: '#00FFAB',
    borderRadius: 50,
    padding: 10,
    paddingHorizontal: 16,
  },
  fecharIconText: {
    fontSize: 16,
    color: '#FFF',
  },
  iconImage: {
    width: 45,
    height: 45,
  },
});

export default ExpectativasDeAprendizagem;
