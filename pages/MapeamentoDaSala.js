import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabaseClient'; // Importe o cliente do Supabase

// Importe as imagens
import prof from '../img/prof.png';
import porta from '../img/porta.png';
import cadeira from '../img/cadeira.png';
import Map from '../img/Map.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MapeamentoDaSala = () => {
  const navigation = useNavigation();
  const [alunos, setAlunos] = useState([]);
  const [ocupacao, setOcupacao] = useState({}); // Para associar cadeiras aos IDs dos alunos

  function abreviarNome(nomeCompleto) {
    const partes = nomeCompleto.split(" ");
    return partes[0];
  }
  
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Obtenha a turma escolhida do AsyncStorage ou localStorage (substitua pela lógica necessária)
        const turmaEscolha = await AsyncStorage.getItem('turmaId');

        // Obtenha o ID da turma com base no nome
        // const { data: turmaID, error: turmaIDError } = await supabase
        //   .from('turmas')
        //   .select('*')
        //   .eq('id', turmaEscolha);

        // if (turmaIDError || !turmaID?.length) {
        //   Alert.alert('Erro', 'Não foi possível carregar a turma.');
        //   return;
        // }

        // Obtenha os alunos da turma
        const { data: alunosData, error: alunosError } = await supabase
          .from('alunos')
          .select('id')
          .eq('turma_id', turmaEscolha);

        if (alunosError) {
          Alert.alert('Erro', 'Não foi possível carregar os alunos.');
          return;
        }

        // console.log(alunosData)
        setAlunos(alunosData);

        // Obtenha as cadeiras já ocupadas
        const { data: ocupacaoData, error: ocupacaoError } = await supabase
          .from('salas')
          .select('*')
          .eq('turma', turmaEscolha);
          
          // console.log(ocupacaoData)
        if (ocupacaoError) {
          Alert.alert('Erro', 'Não foi possível carregar a ocupação.', ocupacaoError);
          return;
        }

        // Cria um mapeamento de cadeiras para alunos
        const ocupacaoMap = {};

        for (const registro of ocupacaoData) {
          const { data: alunoNome, error: ocupacaoError } = await supabase
          .from('alunos')
          .select('nome')
          .eq('id', registro.aluno_id)
          .single();


          ocupacaoMap[registro.cadeira_numero] = abreviarNome(alunoNome.nome) ;
        }
        ocupacaoData.forEach((registro) => {
        });

        setOcupacao(ocupacaoMap);
      } catch (err) {
        console.error(err);
        Alert.alert('Erro', 'Algo deu errado ao carregar os dados.');
      }
    };

    carregarDados();
  }, []);

  const voltarParaPaginaInicial = () => {
    navigation.goBack(); // Volta para a página inicial
  };

  const renderCadeiras = (coluna) => {
    const rows = [];
    for (let i = coluna * 12 + 1; i <= coluna * 12 + 6; i++) {
      const alunoId1 = ocupacao[i] || null;
      const alunoId2 = ocupacao[i + 6] || null;

      rows.push(
        <View key={i} style={styles.row}>
          {/* Cadeira 1 */}
          <View style={styles.cadeiraContainer}>
            {/* <Text style={styles.cadeiraTexto}>{`N°${i}`}</Text> */}
            {alunoId1 && (
              <Text style={styles.alunoTexto}>{`${alunoId1}`}</Text>
            )}
            <Image source={cadeira} style={styles.chairImage} />
          </View>

          {/* Cadeira 2 */}
          <View style={styles.cadeiraContainer}>
            {/* <Text style={styles.cadeiraTexto}>{`N°${i + 6}`}</Text> */}
            {alunoId2 && (
              <Text style={styles.alunoTexto}>{`${alunoId2}`}</Text>
            )}
            <Image source={cadeira} style={styles.chairImage} />
          </View>
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      {/* Parte superior com professor e porta */}
      <View style={styles.topRow}>
        <Image source={prof} style={styles.profImage} />
        <Image source={porta} style={styles.iconImage2} />
      </View>

      {/* Cadeiras em colunas */}
      <View style={styles.chairsOrganization}>
        <View style={styles.chairsContainer}>{renderCadeiras(0)}</View>
        <View style={styles.chairsContainer}>{renderCadeiras(1)}</View>
        <View style={styles.chairsContainer}>{renderCadeiras(2)}</View>
      </View>

      {/* Botão de Voltar (com ícone, nome e X) */}
      <View style={styles.voltarBox}>
        <View style={styles.voltarButton}>
          <View>
            <Image style={styles.iconImage} source={Map} />
          </View>
          <View>
            <Text style={styles.voltarText}>Mapeamento da sala</Text>
          </View>
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
    justifyContent: 'center',
  },
  alunoTexto: {
    fontSize: 14,
    fontWeight: '600'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50, // Ajuste para espaçamento entre a parte superior e as cadeiras
  },
  profImage: {
    width: 70,
    height: 70,
    alignItems: 'center',
  },
  iconImage: {
    width: 45,
    height: 45,
  },
  iconImage2: {
    width: 30,
    height: 45,
  },
  chairsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  chairsOrganization: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: -20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap: 1, // Espaçamento entre as linhas de cadeiras
  },
  chairImage: {
    width: 40,
    height: 40,
    marginHorizontal: 10, // Espaçamento entre as cadeiras
  },
  cadeiraContainer: {
    alignItems: 'center', 
    height: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
    // Alinhar o texto ao centro em relação à cadeira
  },
  cadeiraTexto: {
    fontSize: 12,
    marginBottom: -5, // Espaçamento entre o texto e a imagem da cadeira
    fontWeight: 'bold',
    color: '#000',
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
    paddingRight: 100,
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
});

export default MapeamentoDaSala;
