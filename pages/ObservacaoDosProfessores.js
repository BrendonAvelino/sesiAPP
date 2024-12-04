import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseClient';
import Obs from '../img/Obs.png';

const ObservacaoDosProfessores = () => {
  const [observacoes, setObservacoes] = useState([]);
  const [modalData, setModalData] = useState(null); // Dados para exibir no modal
  const navigation = useNavigation();

  // Carregar observações do aluno
  useEffect(() => {
    const fetchObservacoes = async () => {
      try {
        // Recuperar alunoId do AsyncStorage
        const storedAlunoId = await AsyncStorage.getItem('alunoId');
        console.log('Aluno ID armazenado:', storedAlunoId);

        if (!storedAlunoId) {
          console.log('Nenhum alunoId encontrado no AsyncStorage.');
          return;
        }

        // Buscar observações do aluno
        const { data: obsData, error: obsError } = await supabase
          .from('observacoes')
          .select('*')
          .eq('aluno_id', storedAlunoId)
          .order('data', { ascending: false }); // Ordenar por data mais recente

        if (obsError) {
          console.error('Erro ao buscar observações:', obsError);
          return;
        }

        // Buscar informações dos professores para cada observação
        const observacoesComProfessor = await Promise.all(
          obsData.map(async (obs) => {
            const { data: professorData, error: profError } = await supabase
              .from('professores')
              .select('nome, sobrenome')
              .eq('id', obs.professor_id)
              .single(); // Retorna apenas um registro

              // console.log(professorData)

            if (profError) {
              console.error(`Erro ao buscar professor ${obs.professor_id}:`, profError);
              return { ...obs, professor: 'Desconhecido' };
            }

            const professorNome = `Prof. ${professorData.nome} ${professorData.sobrenome}`;
            return { ...obs, professor: professorNome };
          })
        );

        setObservacoes(observacoesComProfessor);
      } catch (error) {
        console.error('Erro ao carregar observações:', error);
      }
    };

    fetchObservacoes();
  }, []);

  const toggleModal = (data) => {
    setModalData(data); // Define os dados para o modal
  };

  const fecharModal = () => {
    setModalData(null); // Fecha o modal
  };

  const voltarParaPaginaInicial = () => {
    navigation.goBack(); // Voltar para a página inicial
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {observacoes.length === 0 ? (
          <Text style={styles.semObservacoes}>Nenhuma observação disponível.</Text>
        ) : (
          observacoes.map((obs) => (
            <View key={obs.id} style={styles.observacaoBox}>
              <View style={styles.headerBox}>
                <Text style={styles.professorName}>{obs.professor}</Text>
                <Text style={styles.data}>{new Date(obs.data).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.observacaoTexto}>
                {obs.conteudo.length > 100 ? `${obs.conteudo.substring(0, 100)}...` : obs.conteudo}
              </Text>
              <TouchableOpacity onPress={() => toggleModal(obs)}>
                <Text style={styles.lerMais}>Ler mais</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal para exibir o conteúdo completo */}
      {modalData && (
        <Modal visible={!!modalData} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.professorName}>{modalData.professor}</Text>
                <Text style={styles.data}>{new Date(modalData.data).toLocaleDateString()}</Text>
              </View>
              <ScrollView>
                <Text style={styles.observacaoCompleta}>{modalData.conteudo}</Text>
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
          <Image style={styles.iconImage} source={Obs} />
          <Text style={styles.voltarText}>Obs. dos Professores</Text>
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
  // (Estilos permanecem os mesmos do código anterior)
  semObservacoes: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 50,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    paddingTop: 45
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
  professorName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  data: {
    color: '#888',
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
  observacaoCompleta: {
    fontSize: 14,
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
    backgroundColor: '#FF3B30',
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
    paddingRight: 100
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
export default ObservacaoDosProfessores;
