import React from 'react';
import { SafeAreaView } from 'react-native';
import MainScreen from './src/screens/MainScreen';
import { COLORS } from './src/constants/Colors';

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <MainScreen />
    </SafeAreaView>
  );
};

export default App;