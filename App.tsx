import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';

import {
  initialize,
  requestPermission,
  readRecords
} from 'react-native-health-connect';

type HealthData = {
  steps: number;
  height: number;
  weight: number;  // Added weight
  sleepDuration: number;
};

const COLORS = {
  primary: '#2196F3',
  secondary: '#4CAF50',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#212121',
  disabled: '#BDBDBD',
  error: '#F44336',
  accent: '#673AB7',
  weight: '#FF9800'  // New color for weight
};

const App: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    height: 0,
    weight: 0,  // Added weight
    sleepDuration: 0
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHealthData = async () => {
    try {
      setLoading(true);

      const isInitialized = await initialize();
      if (!isInitialized) throw new Error('Initialization failed');

      await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'Height' },
        { accessType: 'read', recordType: 'Weight' },  // Added weight permission
        { accessType: 'read', recordType: 'SleepSession' }
      ]);

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      const timeRangeFilter = {
        operator: 'between' as const,
        startTime: startOfDay,
        endTime: endOfDay
      };

      // Fetch steps
      const stepsResult = await readRecords('Steps', { timeRangeFilter });
      const totalSteps = stepsResult.records
        ? stepsResult.records.reduce((sum: number, record: any) => sum + (record.count || 0), 0)
        : 0;

      // Fetch height
      const heightResult = await readRecords('Height', { timeRangeFilter });
      const latestHeight = heightResult.records && heightResult.records.length > 0
        ? heightResult.records[heightResult.records.length - 1].height.inMeters
        : 0;

      // Fetch weight (new section)
      const weightResult = await readRecords('Weight', { timeRangeFilter });
      const latestWeight = weightResult.records && weightResult.records.length > 0
        ? weightResult.records[weightResult.records.length - 1].weight.inKilograms
        : 0;

      // Fetch sleep
      const sleepResult = await readRecords('SleepSession', { timeRangeFilter });
      const totalSleep = sleepResult.records
        ? sleepResult.records.reduce((sum: number, record: any) => {
          const start = new Date(record.startTime);
          const end = new Date(record.endTime);
          return sum + (end.getTime() - start.getTime());
        }, 0)
        : 0;

      setHealthData({
        steps: totalSteps,
        height: latestHeight,
        weight: latestWeight,  // Added weight
        sleepDuration: totalSleep / (1000 * 60 * 60)
      });
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Health Connect</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Fetching..." : "Get Health Data"}
          onPress={fetchHealthData}
          disabled={loading}
          color={COLORS.primary}
        />
        {loading && <ActivityIndicator style={styles.loader} color={COLORS.primary} />}
      </View>

      <View style={styles.dataContainer}>
        <DataItem
          label="Steps"
          value={healthData.steps.toLocaleString()}
          color={COLORS.secondary}
          unit="steps"
        />
        <DataItem
          label="Height"
          value={(healthData.height * 100).toFixed(1)}
          color={COLORS.primary}
          unit="cm"
        />
        <DataItem
          label="Weight"
          value={healthData.weight.toFixed(1)}
          color={COLORS.weight}
          unit="kg"
        />
        <DataItem
          label="Sleep"
          value={healthData.sleepDuration.toFixed(1)}
          color={COLORS.accent}
          unit="hours"
        />
      </View>
    </SafeAreaView>
  );
};

// Reusable DataItem component remains the same
const DataItem = ({ label, value, color, unit }: any) => (
  <View style={styles.dataItem}>
    <View style={[styles.dataIcon, { backgroundColor: color }]} />
    <View style={styles.dataTextContainer}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>
        {value} <Text style={styles.dataUnit}>{unit}</Text>
      </Text>
    </View>
  </View>
);

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 16,
    elevation: 4,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
    marginVertical: 16,
  },
  loader: {
    marginTop: 8,
  },
  dataContainer: {
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dataIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  dataTextContainer: {
    flex: 1,
  },
  dataLabel: {
    color: COLORS.text,
    fontSize: 14,
    opacity: 0.8,
  },
  dataValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '500',
    marginTop: 4,
  },
  dataUnit: {
    fontSize: 16,
    color: '#757575',
  },
});

export default App;
