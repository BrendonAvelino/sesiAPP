import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseClient';

import Aula from '../img/Aula.png';

const AulasAnteriores = () => {
  const [roteiros, setRoteiros] = useState([]); // Armazena os roteiros dinâmicos
  const [modalData, setModalData] = useState(null); // Dados do modal atual
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRoteiros = async () => {
      try {
        const storedTurmaId = await AsyncStorage.getItem('turmaId');
        // console.log('Turma ID armazenada:', storedTurmaId);


        const turmaIdParsed = parseInt(storedTurmaId, 10); // Converte para número
        const { data: turmasMaterias, error: turmasMateriasError } = await supabase
          .from('turmas_materias')
          .select('*')
          .eq('turma_id', turmaIdParsed);
        

        // console.log(turmasMaterias)
        if (turmasMateriasError || !turmasMaterias.length) {
          console.error('Erro ao buscar turmas_materias:', turmasMateriasError);
          setRoteiros([]);
          return;
        }

        // Para cada turma_materia, busca os roteiros associados
        let allRoteiros = [];
        for (const tm of turmasMaterias) {
          const { data: roteiros, error: roteirosError } = await supabase
            .from('roteiros')
            .select('*')
            .eq('turma_materia_id', tm.id);

            // console.log(roteiros)
          
          if (roteirosError) {
            console.error('Erro ao buscar roteiros:', roteirosError);
          } else {
            // Adiciona a matéria ao roteiro
            for (const roteiro of roteiros) {
              const { data: materia, error: materiaError } = await supabase
                .from('materias')
                .select('nome_materia')
                .eq('id', tm.materia_id)
                .single();

              if (materiaError) {
                console.error('Erro ao buscar matéria:', materiaError);
              } else {
                allRoteiros.push({ ...roteiro, nomeMateria: materia.nome_materia });
              }
            }
          }
        }

        // Ordena os roteiros por data em ordem decrescente
        allRoteiros.sort((a, b) => new Date(b.data) - new Date(a.data));
        setRoteiros(allRoteiros);
      } catch (error) {
        console.error('Erro ao carregar roteiros:', error);
      }
    };

    fetchRoteiros();
  }, []);

  const abrirModal = (roteiro) => {
    setModalData(roteiro);
  };

  const fecharModal = () => {
    setModalData(null);
  };

  const voltarParaPaginaInicial = () => {
    navigation.goBack(); // Volta para a página inicial
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {roteiros.length === 0 ? (
          <Text style={styles.emptyMessage}>Nenhum roteiro encontrado.</Text>
        ) : (
          roteiros.map((roteiro, index) => (
            <View key={index} style={styles.observacaoBox}>
              <View style={styles.headerBox}>
                <Text style={styles.materiaName}>{roteiro.nomeMateria == `Mundo do Trabalho e Empreendedorismo`? `MTE`: roteiro.nomeMateria}</Text>
                <Text style={styles.data}>{new Date(roteiro.data).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.titulo}>{roteiro.titulo}</Text>
              <Text style={styles.aulaTexto}>
                {roteiro.conteudo.slice(0, 100)}{roteiro.conteudo.length < 100? '': '...'}
              </Text>
              <TouchableOpacity onPress={() => abrirModal(roteiro)}>
                <Text style={styles.lerMais}>Ler mais</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal Dinâmico */}
      {modalData && (
        <Modal visible={!!modalData} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.materiaName}>{modalData.nomeMateria == `Mundo do Trabalho e Empreendedorismo`? `MTE`: modalData.nomeMateria}</Text>
                <Text style={styles.data}>{new Date(modalData.data).toLocaleDateString()}</Text>
              </View>
              <ScrollView>
                <Text style={styles.titulo}>{modalData.titulo}</Text>
                <Text style={styles.aulaCompleta}>{modalData.conteudo}</Text>
              </ScrollView>
              <TouchableOpacity onPress={fecharModal}>
                <Text style={styles.fecharModal}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Botão de Voltar */}
      <View style={styles.voltarBox}>
        <View style={styles.voltarButton}>
          <Image style={styles.iconImage} source={Aula} />
          <Text style={styles.voltarText}>Aulas Anteriores</Text>
          <TouchableOpacity onPress={voltarParaPaginaInicial}>
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
    padding: 20,
    backgroundColor: '#F5F5F5',
    paddingTop: 70
  },
  scrollContent: {
    padding: 20,
  },
  titulo: {
    fontWeight: '700',
    marginBottom: -20,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 50,
  },
  observacaoBox: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30, // Ajuste de espaço entre as boxes
  },
  headerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  materiaName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  data: {
    color: '#222',
    fontSize: 14,
  },
  observacaoTexto: {
    fontSize: 14,
    color: '#333',
  },
  lerMais: {
    color: '#FF0000',
    marginTop: 10,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  aulaCompleta: {
    fontSize: 16,
    color: '#333',
  },
  fecharModal: {
    color: '#FF0000',
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
  voltarIcon: {
    backgroundColor: '#FF9500',
    borderRadius: 20,
    padding: 10,
  },
  voltarIconText: {
    fontSize: 16,
    color: '#FFF',
  },
  voltarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    paddingRight: 120
  },
  fecharIcon: {
    backgroundColor: '#00FFAB',
    borderRadius: 50,
    padding: 10,
    paddingHorizontal: 16
  },
  fecharIconText: {
    fontSize: 16,
    color: '#FFF',
  },
  iconImage: {
    width: 45,
    height: 45
  }
});
export default AulasAnteriores;
