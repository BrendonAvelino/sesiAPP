import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './routes'; // Importando o arquivo de rotas

const App = () => {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
};

export default App;
