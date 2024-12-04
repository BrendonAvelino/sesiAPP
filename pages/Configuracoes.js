import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Config from '../img/Config.png'; // Sua imagem existente
import Not from '../img/Not.png'; // Ícone das notificações
import Polit from '../img/Polit.png'; // Ícone para Termo e Políticas
import Ajuda from '../img/Ajuda.png'; // Ícone para Central de Ajuda
import Logout from '../img/Logout.png'; // Ícone para Sair

const Configuracoes = () => {
  const navigation = useNavigation();

  const handleNotificacoes = () => {
    // Navegar para a página de Gerenciar Notificações
    navigation.navigate('GerenciarNotificacoes');
  };

  const handleTermoPoliticas = () => {
    // Abrir link externo para Termo e Políticas
    Linking.openURL('https://layers.education/privacidade');
  };

  const handleCentralAjuda = () => {
    // Abrir link externo para Central de Ajuda
    Linking.openURL('https://suporte.layers.education/kb');
  };

  const handleNavigate = (option) => {
    navigation.navigate(option);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Opções de Configurações */}
        <TouchableOpacity style={styles.option} onPress={handleNotificacoes}>
          <Image source={Not} style={styles.icon} />
          <Text style={styles.optionText}>Gerenciar notificações</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.option} onPress={handleTermoPoliticas}>
          <Image source={Polit} style={styles.icon} />
          <Text style={styles.optionText}>Termo e políticas</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.option} onPress={handleCentralAjuda}>
          <Image source={Ajuda} style={styles.icon} />
          <Text style={styles.optionText}>Central de ajuda</Text>
        </TouchableOpacity>
        <View style={styles.divider} />

        <TouchableOpacity style={styles.option} onPress={() => handleNavigate('PaginaInicial')}>
          <Image source={Logout} style={styles.icon} />
          <Text style={[styles.optionText, styles.sairText]}>Sair desta conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Versão do Aplicativo */}
      <Text style={styles.versaoText}>Versão do aplicativo 1.0.0</Text>

      {/* Botão de Voltar com ícone e X */}
      <View style={styles.voltarBox}>
        <View style={styles.voltarButton}>
          <Image style={styles.iconImage} source={Config} />
          <Text style={styles.voltarText}>Configurações</Text>
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
    paddingTop: 60,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  option: {
    flexDirection: 'row', // Coloca o ícone e o texto lado a lado
    alignItems: 'center', // Alinha o ícone com o texto
    paddingVertical: 30,
  },
  optionText: {
    fontSize: 18,
    color: '#000',
    marginLeft: 10, // Adiciona espaçamento entre o ícone e o texto
  },
  icon: {
    width: 28, // Define o tamanho do ícone
    height: 28,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  sairText: {
    color: '#E63946',
  },
  versaoText: {
    textAlign: 'center',
    color: 'black',
    marginTop: 20,
    opacity: 1,
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
    paddingRight: 130,
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

export default Configuracoes;
