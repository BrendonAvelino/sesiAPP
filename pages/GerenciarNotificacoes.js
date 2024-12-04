import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Image, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Aula from '../img/Aula.png'; 
import Obs from '../img/Obs.png';

const GerenciarNotificacoes = () => {
  const [habilitarNotificacoes, setHabilitarNotificacoes] = useState(false);
  const [obsProfessoresAtivado, setObsProfessoresAtivado] = useState(false);
  const [aulasAnterioresAtivado, setAulasAnterioresAtivado] = useState(false);
  const [permissaoNegada, setPermissaoNegada] = useState(false);

  // Carregar as configurações salvas e pedir permissão de notificação ao abrir o aplicativo
  useEffect(() => {
    const inicializarNotificacoes = async () => {
      try {
        const notificacoesAtivas = await AsyncStorage.getItem('habilitarNotificacoes');
        const obsAtivado = await AsyncStorage.getItem('obsProfessoresAtivado');
        const aulasAtivado = await AsyncStorage.getItem('aulasAnterioresAtivado');
        
        if (notificacoesAtivas !== null) setHabilitarNotificacoes(JSON.parse(notificacoesAtivas));
        if (obsAtivado !== null) setObsProfessoresAtivado(JSON.parse(obsAtivado));
        if (aulasAtivado !== null) setAulasAnterioresAtivado(JSON.parse(aulasAtivado));
  
        // Pedir permissão ao abrir o aplicativo
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          setHabilitarNotificacoes(true);
          salvarConfiguracoes('habilitarNotificacoes', true);
        } else {
          setPermissaoNegada(true);
          setHabilitarNotificacoes(false);
        }
      } catch (error) {
        console.log('Erro ao carregar as configurações:', error);
      }
    };
  
    inicializarNotificacoes();
  }, []);

  // Salvar as configurações quando forem alteradas
  const salvarConfiguracoes = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log('Erro ao salvar as configurações:', error);
    }
  };

  // Função para alternar o estado de habilitar notificações
  const toggleHabilitarNotificacoes = async (value) => {
    if (!habilitarNotificacoes && permissaoNegada) {
      // Se a permissão foi negada antes, perguntar novamente
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Para habilitar notificações, você precisa conceder a permissão nas configurações.');
        return; // Não permitir ativar se a permissão foi negada
      } else {
        setPermissaoNegada(false); // Atualizar o estado para não negado
      }
    }
    
    setHabilitarNotificacoes(value);
    salvarConfiguracoes('habilitarNotificacoes', value);

    // Se desabilitar as notificações gerais, desativa automaticamente as outras opções
    if (!value) {
      setObsProfessoresAtivado(false);
      setAulasAnterioresAtivado(false);
      salvarConfiguracoes('obsProfessoresAtivado', false);
      salvarConfiguracoes('aulasAnterioresAtivado', false);
    }
  };

  // Função para alternar o estado de Observação dos Professores
  const toggleObsProfessores = (value) => {
    setObsProfessoresAtivado(value);
    salvarConfiguracoes('obsProfessoresAtivado', value);
  };

  // Função para alternar o estado de Aulas Anteriores
  const toggleAulasAnteriores = (value) => {
    setAulasAnterioresAtivado(value);
    salvarConfiguracoes('aulasAnterioresAtivado', value);
  };

  return (
    <View style={styles.container}>
      
      {/* Habilitar Notificações */}
      <View style={styles.optionContainer}>
        <Switch
          onValueChange={toggleHabilitarNotificacoes}
          value={habilitarNotificacoes}
          trackColor={{ false: '#C0C0C0', true: '#00D19A' }}
          thumbColor={habilitarNotificacoes ? '#00D19A' : '#f4f3f4'}
        />
        <Text style={styles.optionText}>Habilitar notificações</Text>
      </View>

      {/* Observação dos Professores */}
      <View style={styles.optionContainer}>
        <Image source={Obs} style={styles.icon} />
        <Text style={[styles.optionText, { color: habilitarNotificacoes ? '#000' : '#C0C0C0' }]}>
          Observação dos professores
        </Text>
        <Switch
          onValueChange={toggleObsProfessores}
          value={obsProfessoresAtivado}
          disabled={!habilitarNotificacoes}
          trackColor={{ false: '#C0C0C0', true: '#00D19A' }}
          thumbColor={obsProfessoresAtivado ? '#00D19A' : '#f4f3f4'}
        />
      </View>

      {/* Aulas Anteriores */}
      <View style={styles.optionContainer}>
        <Image source={Aula} style={styles.icon} />
        <Text style={[styles.optionText, { color: habilitarNotificacoes ? '#000' : '#C0C0C0' }]}>
          Aulas anteriores
        </Text>
        <Switch
          onValueChange={toggleAulasAnteriores}
          value={aulasAnterioresAtivado}
          disabled={!habilitarNotificacoes}
          trackColor={{ false: '#C0C0C0', true: '#00D19A' }}
          thumbColor={aulasAnterioresAtivado ? '#00D19A' : '#f4f3f4'}
        />
      </View>

      <Text style={styles.infoText}>
        Algumas notificações sobre sua conta não podem ser desativados, pois garantem seu acesso à plataforma.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    paddingTop: 100
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    paddingLeft: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  infoText: {
    marginTop: 20,
    fontSize: 12,
    color: '#808080',
  },
});

export default GerenciarNotificacoes;
