import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import PagerView from 'react-native-pager-view';
import { HealthDataDisplay } from '../components/HealthDataDisplay';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { fetchHealthDataForDate } from '../services/HealthDataService';
import { getDateForPage } from '../utils/DateUtils';
import { HealthData } from '../types/HealthData';
import { COLORS } from '../constants/Colors';

export const MainScreen: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    height: 0,
    weight: 0,
    sleepDuration: 0,
    distance: 0,
    calories: 0,
    menstruationFlow: null,
    menstruationPeriod: null,
    heartRate: null,
    hydration: null,
    bloodPressure: { systolic: null, diastolic: null },
    bodyTemperature: null,
    activeCalories: null,
    basalBodyTemperature: null,
    basalMetabolicRate: null,
    bloodGlucose: null,
    bodyFat: null,
    boneMass: null,
    cervicalMucus: null,
    elevationGained: null,
    exerciseSession: null,
    floorsClimbed: null,
    leanBodyMass: null,
    nutrition: null,
    ovulationTest: null,
    oxygenSaturation: null,
    power: null,
    respiratoryRate: null,
    restingHeartRate: null,
    sexualActivity: null,
    sexualActivityTimestamp: null,
    speed: null,
    stepsCadence: null,
    vo2Max: null,
    wheelchairPushes: null,
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(1000);

  const handleFetchHealthData = async (date: Date) => {
    try {
      setLoading(true);
      const data = await fetchHealthDataForDate(date);
      setHealthData(data);
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchHealthData(getDateForPage(pageIndex));
  }, [pageIndex]);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Health Connect</Text>
      </View>

      <PagerView
        style={styles.pager}
        initialPage={1000}
        onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}
      >
        {Array.from({ length: 2000 }).map((_, index) => (
          <View key={index} style={styles.pageContainer}>
            {/* Only show data for the current page */}
            {index === pageIndex && (
              <>
                <Text style={styles.dateHeader}>
                  {getDateForPage(index).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
                
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <HealthDataDisplay healthData={healthData} />
                )}
              </>
            )}
          </View>
        ))}
      </PagerView>

      <View style={styles.footer}>
        <Button
          title={loading ? "Fetching..." : "Refresh Data"}
          onPress={() => handleFetchHealthData(getDateForPage(pageIndex))}
          disabled={loading}
          color={COLORS.primary}
        />
        {loading && <ActivityIndicator style={styles.loader} color={COLORS.primary} />}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    elevation: 4,
  },
  headerText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  pager: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  pageContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  loader: {
    marginTop: 8,
  },
});

export default MainScreen;
