import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import PagerView from 'react-native-pager-view';
import {
  initialize,
  requestPermission,
  readRecords
} from 'react-native-health-connect';

type HealthData = {
  steps: number;
  height: number;
  weight: number;  
  sleepDuration: number;
  distance: number;
  calories: number;
  menstruationFlow: string | null;
  menstruationPeriod: string | null;
  heartRate: string | number | null;
  hydration: number | null;
  bloodPressure: {
    systolic: number | null;
    diastolic: number | null;
  } | null;
  bodyTemperature: number | null;
  activeCalories: number | null;
  basalBodyTemperature: number | null;
  basalMetabolicRate: number | null;
  bloodGlucose: number | null;
  bodyFat: number | null;
  boneMass: number | null;
  cervicalMucus: string | null;
  elevationGained: number | null;
  exerciseSession: string | null;
  floorsClimbed: number | null;
  leanBodyMass: number | null;
  nutrition: string | null;
  ovulationTest: string | null;
  oxygenSaturation: number | null;
  power: number | null;
  respiratoryRate: number | null;
  restingHeartRate: number | null;
  sexualActivity: boolean | null;
  sexualActivityTimestamp: string | null;
  speed: number | null;
  stepsCadence: number | null;
  vo2Max: number | null;
  wheelchairPushes: number | null;
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
  weight: '#FF9800',
  distance: '#8BC34A',
  calories: '#E91E63',
  menstruation: '#EC407A',
  hydration: '#00BCD4',
  heartRate: '#FF1744',
  bloodPressure: '#6A1B9A',
  bodyTemperature: '#FFB300',
  speed: '#009688',
  stepsCadence: '#607D8B',
  wheelchairPushes: '#607D8B', 
  vo2Max: '#1976D2', 
};

const App: React.FC = () => {
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

  const getDateForPage = (index: number) => {
    const date = new Date();
    date.setDate(date.getDate() + (index - 1000));
    return date;
  };

  const fetchHealthDataForDate = async (date: Date) => {
    try {
      setLoading(true);
      const isInitialized = await initialize();
      if (!isInitialized) throw new Error('Initialization failed');

      await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'Height' },
        { accessType: 'read', recordType: 'Weight' },
        { accessType: 'read', recordType: 'SleepSession' },
        { accessType: 'read', recordType: 'Distance' },
        { accessType: 'read', recordType: 'TotalCaloriesBurned' },
        { accessType: 'read', recordType: 'MenstruationFlow' },
        { accessType: 'read', recordType: 'MenstruationPeriod' },
        { accessType: 'read', recordType: 'HeartRate' },
        { accessType: 'read', recordType: 'Hydration' },
        { accessType: 'read', recordType: 'BloodPressure' },
        { accessType: 'read', recordType: 'BodyTemperature' },
        { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
        { accessType: 'read', recordType: 'BasalBodyTemperature' },
        { accessType: 'read', recordType: 'BasalMetabolicRate' },
        { accessType: 'read', recordType: 'BloodGlucose' },
        { accessType: 'read', recordType: 'BodyFat' },
  { accessType: 'read', recordType: 'BoneMass' },
  { accessType: 'read', recordType: 'CervicalMucus' },
  { accessType: 'read', recordType: 'ElevationGained' },
  { accessType: 'read', recordType: 'ExerciseSession' },
  { accessType: 'read', recordType: 'FloorsClimbed' },
  { accessType: 'read', recordType: 'LeanBodyMass' },
  { accessType: 'read', recordType: 'Nutrition' },
  { accessType: 'read', recordType: 'OvulationTest' },
  { accessType: 'read', recordType: 'OxygenSaturation' },
  { accessType: 'read', recordType: 'Power' },
  { accessType: 'read', recordType: 'RespiratoryRate' },
  { accessType: 'read', recordType: 'RestingHeartRate' },
  { accessType: 'read', recordType: 'SexualActivity' },
  { accessType: 'read', recordType: 'Speed' },
  { accessType: 'read', recordType: 'Vo2Max' },
  { accessType: 'read', recordType: 'WheelchairPushes' },
      ]);

      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      
      const timeRangeFilter = {
        operator: 'between' as const,
        startTime: startOfDay.toISOString(),
        endTime: endOfDay.toISOString()
      };

      const [
        stepsResult, 
        heightResult, 
        weightResult,
        sleepResult,
        distanceResult,
        caloriesResult,
        menstruationFlowResult,
        menstruationPeriodResult,
        heartRateResult,
        hydrationResult,
        bloodPressureResult,
        bodyTemperatureResult, 
        activeCaloriesResult,
        basalBodyTemperatureResult,
        basalMetabolicRateResult,
        bloodGlucoseResult,
        bodyFatResult,
        boneMassResult,
        cervicalMucusResult,
        elevationGainedResult,
        exerciseSessionResult,
        floorsClimbedResult,
        leanBodyMassResult,
        nutritionResult,
        ovulationTestResult,
        oxygenSaturationResult,
        powerResult,
        respiratoryRateResult,
        restingHeartRateResult,
        sexualActivityResult,
        speedResult,
        stepsCadenceResult,
        vo2MaxResult,
        wheelchairPushesResult,
      ] = await Promise.all([
        readRecords('Steps', { timeRangeFilter }),
        readRecords('Height', { timeRangeFilter }),
        readRecords('Weight', { timeRangeFilter }),
        readRecords('SleepSession', { timeRangeFilter }),
        readRecords('Distance', { timeRangeFilter }),
        readRecords('TotalCaloriesBurned', { timeRangeFilter }),
        readRecords('MenstruationFlow', { timeRangeFilter }),
        readRecords('MenstruationPeriod', { timeRangeFilter }),
        readRecords('HeartRate', { timeRangeFilter }),
        readRecords('Hydration', { timeRangeFilter }),
        readRecords('BloodPressure', { timeRangeFilter }),
        readRecords('BodyTemperature', { timeRangeFilter }),
        readRecords('ActiveCaloriesBurned', { timeRangeFilter }),
        readRecords('BasalBodyTemperature', { timeRangeFilter }),
        readRecords('BasalMetabolicRate', { timeRangeFilter }),
        readRecords('BloodGlucose', { timeRangeFilter }),
        readRecords('BodyFat', { timeRangeFilter }),
        readRecords('BoneMass', { timeRangeFilter }),
        readRecords('CervicalMucus', { timeRangeFilter }),
        readRecords('ElevationGained', { timeRangeFilter }),
        readRecords('ExerciseSession', { timeRangeFilter }),
        readRecords('FloorsClimbed', { timeRangeFilter }),
        readRecords('LeanBodyMass', { timeRangeFilter }),
        readRecords('Nutrition', { timeRangeFilter }),
        readRecords('OvulationTest', { timeRangeFilter }),
        readRecords('OxygenSaturation', { timeRangeFilter }),
        readRecords('Power', { timeRangeFilter }),
        readRecords('RespiratoryRate', { timeRangeFilter }),
        readRecords('RestingHeartRate', { timeRangeFilter }),
        readRecords('SexualActivity', { timeRangeFilter }),
        readRecords('Speed', { timeRangeFilter }),
        readRecords('StepsCadence', { timeRangeFilter }),
        readRecords('Vo2Max', { timeRangeFilter }),
        readRecords('WheelchairPushes', { timeRangeFilter }),
      ]);

//Fetch steps
      const totalSteps = stepsResult.records?.reduce((sum, record) => sum + (record.count || 0), 0) || 0;

// Get current date
const currentDate = new Date();
const thirtyDaysAgo = new Date(currentDate);
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

// Fetch height records for the last 30 days
const heightResults = await readRecords('Height', {
  timeRangeFilter: {
    operator: 'between',
    startTime: thirtyDaysAgo.toISOString(),
    endTime: currentDate.toISOString(),
  },
});
const heightRecords = heightResults.records || [];
const latestHeightRecord = heightRecords
  .slice()
  .sort((a, b) => {
    const getTime = (rec: any) =>
      new Date(rec.endTime || rec.startTime || rec.recordTime || 0).getTime();
    return getTime(b) - getTime(a);
  })[0];
const latestHeight = latestHeightRecord?.height?.inMeters || 0;



// Fetch weight records for the last 30 days
const weightResults = await readRecords('Weight', {
  timeRangeFilter: {
    operator: 'between',
    startTime: thirtyDaysAgo.toISOString(),
    endTime: currentDate.toISOString(),
  },
});
const weightRecords = weightResults.records || [];
const latestWeightRecord = weightRecords
  .slice()
  .sort((a, b) => {
    
    const getTime = (rec: any) =>
      new Date(rec.endTime || rec.startTime || rec.recordTime || 0).getTime();
    return getTime(b) - getTime(a);
  })[0];
const latestWeight = latestWeightRecord?.weight?.inKilograms || 0;

      const totalSleep = sleepResult.records?.reduce((sum, record) => {
        const start = new Date(record.startTime);
        const end = new Date(record.endTime);
        return sum + (end.getTime() - start.getTime());
      }, 0) || 0;
      const totalDistance = distanceResult.records?.reduce((sum, record) => sum + (record.distance?.inMeters || 0), 0) || 0;
      const totalCalories = caloriesResult.records?.reduce((sum, record) => sum + (record.energy?.inKilocalories || 0), 0) || 0;
      
      // Handle menstrual data 
     const latestFlow = menstruationFlowResult.records && menstruationFlowResult.records.length > 0
    ? menstruationFlowResult.records[0].flow ?? 'No data'
    : 'No data';
    const periodStatus = menstruationPeriodResult.records && menstruationPeriodResult.records.length > 0
    ? `${menstruationPeriodResult.records[0].startTime ?? 'No data'}`
    : 'No data';
//Fetch heart rate data
      const latestHeartRate = heartRateResult.records && heartRateResult.records.length > 0
  ? heartRateResult.records[0].samples?.[0]?.beatsPerMinute ?? 'No data'
  : 'No data';
//Fetch hydration data
      const totalHydration = hydrationResult.records?.reduce(
  (sum, record) => sum + (record.volume?.inLiters || 0),
  0
) || 0;
// Fetch blood pressure data
  const latestBloodPressure = bloodPressureResult.records && bloodPressureResult.records.length > 0
  ? {
      systolic: bloodPressureResult.records[0].systolic?.inMillimetersOfMercury ?? null,
      diastolic: bloodPressureResult.records[0].diastolic?.inMillimetersOfMercury ?? null,
    }
  : { systolic: null, diastolic: null };
// Fetch body temperature 
  const latestBodyTemperature = bodyTemperatureResult.records && bodyTemperatureResult.records.length > 0
    ? bodyTemperatureResult.records[0].temperature?.inCelsius ?? null
    : null;
// Fetch active calories data
    const totalActiveCalories = activeCaloriesResult.records?.reduce(
  (sum, record) => sum + (record.energy?.inKilocalories || 0),
  0
) || 0;
// Fetch basal body temperature, basal metabolic rate, and blood glucose data
const latestBasalBodyTemperature = basalBodyTemperatureResult.records?.[0]?.temperature?.inCelsius ?? null;
const latestBasalMetabolicRate = basalMetabolicRateResult.records?.[0]?.basalMetabolicRate?.inKilocaloriesPerDay ?? null;
const latestBloodGlucose = bloodGlucoseResult.records?.[0]?.level?.inMillimolesPerLiter ?? null;
// Fetch body fat, bone mass, cervical mucus, elevation gained, exercise session, and floors climbed data
const latestBodyFat = bodyFatResult.records?.[0]?.percentage ?? null;
const latestBoneMass = boneMassResult.records?.[0]?.mass?.inKilograms ?? null;
const latestCervicalMucus = cervicalMucusResult.records?.[0]?.appearance ?? null;
const totalElevationGained = elevationGainedResult.records?.reduce(
  (sum, record) => sum + (record.elevation?.inMeters || 0),
  0
) || null;
const latestExerciseSession = exerciseSessionResult.records?.[0]?.title ?? null;
const totalFloorsClimbed = floorsClimbedResult.records?.reduce(
  (sum, record) => sum + (record.floors || 0),
  0
) || null;
// Fetch lean body mass, nutrition, ovulation test, oxygen saturation, power, respiratory rate, resting heart rate, and sexual activity data
const latestLeanBodyMass = leanBodyMassResult.records?.[0]?.mass?.inKilograms ?? null;
const latestNutritionCalories = nutritionResult.records?.[0]?.energy?.inKilocalories ?? null;
const latestOvulationTest = ovulationTestResult.records?.[0]?.result ?? null;
const latestOxygenSaturation = oxygenSaturationResult.records?.[0]?.percentage ?? null;
const latestPower = powerResult.records?.[0]?.samples?.[0]?.power ?? null;

const latestRespiratoryRate = respiratoryRateResult.records?.[0]?.rate ?? null;
const latestRestingHeartRate = restingHeartRateResult.records?.[0]?.beatsPerMinute ?? null;

const hadSexualActivity = sexualActivityResult.records && sexualActivityResult.records.length > 0;
const sexualActivityTimestamp = hadSexualActivity
  ? sexualActivityResult.records[0].time || null
  : null;


// Fetch speed, steps cadence, vo2 max, and wheelchair pushes data
const latestSpeed =
  speedResult.records?.[0]?.samples?.[0]?.speed?.inMetersPerSecond ?? null;
const latestStepsCadence = stepsCadenceResult.records?.[0]?.samples?.[0]?.rate ?? null;



const latestVo2Max = vo2MaxResult.records?.[0]?.vo2MillilitersPerMinuteKilogram ?? null;
const totalWheelchairPushes = wheelchairPushesResult?.records?.reduce((sum, record) => sum + (record.count || 0), 0) || null;

    setHealthData({
      steps: totalSteps,
      height: latestHeight,
      weight: latestWeight,
      sleepDuration: totalSleep / (1000 * 60 * 60),
      distance: totalDistance,
      calories: totalCalories,
      menstruationFlow: typeof latestFlow === 'string' ? latestFlow : String(latestFlow),
      menstruationPeriod: periodStatus,
      heartRate: latestHeartRate,
      hydration: totalHydration,
      bloodPressure: latestBloodPressure,
      bodyTemperature: latestBodyTemperature,
      activeCalories: totalActiveCalories,
      basalBodyTemperature: latestBasalBodyTemperature,
      basalMetabolicRate: latestBasalMetabolicRate,
      bloodGlucose: latestBloodGlucose,
      bodyFat: latestBodyFat,
      boneMass: latestBoneMass,
      cervicalMucus: latestCervicalMucus !== null && latestCervicalMucus !== undefined ? String(latestCervicalMucus) : null,
      elevationGained: totalElevationGained,
      exerciseSession: latestExerciseSession,
      floorsClimbed: totalFloorsClimbed,
      leanBodyMass: latestLeanBodyMass,
      nutrition: latestNutritionCalories !== null && latestNutritionCalories !== undefined ? latestNutritionCalories.toString() : null,
      ovulationTest: latestOvulationTest !== null && latestOvulationTest !== undefined ? String(latestOvulationTest) : null,
      oxygenSaturation: latestOxygenSaturation,
      power: typeof latestPower === 'object' && latestPower !== null && 'inWatts' in latestPower
        ? latestPower.inWatts
        : latestPower ?? null,
      respiratoryRate: latestRespiratoryRate,
      restingHeartRate: latestRestingHeartRate,
      sexualActivity: hadSexualActivity,
      sexualActivityTimestamp,
      speed: latestSpeed,
      stepsCadence: latestStepsCadence,
      vo2Max: latestVo2Max,
      wheelchairPushes: totalWheelchairPushes,
      
    });
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthDataForDate(getDateForPage(pageIndex));
  }, [pageIndex]);

  return (
    <SafeAreaView style={styles.container}>
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
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                  </View>
                ) : (
                  <ScrollView 
                    style={styles.dataContainer}
                    contentContainerStyle={styles.scrollContent}
                  >
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
                      value={healthData.weight > 0 ? `${healthData.weight.toFixed(1)}` : 'N/A'}
                      color={COLORS.weight}
                      unit="kg"
                    />
                    <DataItem
                      label="Sleep"
                      value={
                        (() => {
                          const totalMinutes = Math.round(healthData.sleepDuration * 60);
                          const hours = Math.floor(totalMinutes / 60);
                          const minutes = totalMinutes % 60;
                          return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
                        })()
                      }
                      color={COLORS.accent}
                      unit=""
                    />
                    <DataItem
                      label="Distance"
                      value={(healthData.distance / 1000).toFixed(2)}
                      color={COLORS.distance}
                      unit="km"
                    />
                    <DataItem
                      label="Total Calories Burned"
                      value={healthData.calories.toFixed(0)}
                      color={COLORS.calories}
                      unit="kcal"
                    />
                    <DataItem
                      label="Menstruation Flow"
                      value={healthData.menstruationFlow || 'N/A'}
                      color={COLORS.menstruation}
                      unit=""
                    />
                    <DataItem
                      label="Menstruation Period"
                      value={healthData.menstruationPeriod || 'N/A'}
                      color={COLORS.menstruation}
                      unit=""
                    />
                    <DataItem
                      label="Heart Rate"
                      value={
                        healthData.heartRate && healthData.heartRate !== 'No data'
                          ? `${healthData.heartRate}`
                          : 'N/A'
                      }
                      color={COLORS.heartRate}
                      unit={healthData.heartRate && healthData.heartRate !== 'No data' ? 'bpm' : ''}
                    />
                    <DataItem
                      label="Hydration"
                      value={
                        healthData.hydration !== null && healthData.hydration > 0
                          ? healthData.hydration.toFixed(2)
                          : 'N/A'
                      }
                      color={COLORS.hydration}
                      unit="L"
                    />
                    <DataItem
                      label="Blood Pressure"
                      value={
                        healthData.bloodPressure &&
                        healthData.bloodPressure.systolic &&
                        healthData.bloodPressure.diastolic
                          ? `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`
                          : 'N/A'
                      }
                      color={COLORS.bloodPressure} 
                      unit="mmHg"
                    />
                    <DataItem
                      label="Body Temperature"
                      value={
                        healthData.bodyTemperature !== null
                          ? healthData.bodyTemperature.toFixed(1)
                          : 'N/A'
                      }
                      color={COLORS.bodyTemperature}
                      unit={healthData.bodyTemperature !== null ? '°C' : ''}
                    />
                    <DataItem
                      label="Active Calories"
                      value={healthData.activeCalories !== null ? healthData.activeCalories.toFixed(0) : 'N/A'}
                      color="#FF7043"
                      unit="kcal"
                    />
                    <DataItem
                      label="Basal Body Temp."
                      value={healthData.basalBodyTemperature !== null ? healthData.basalBodyTemperature.toFixed(1) : 'N/A'}
                      color="#00B8D4"
                      unit={healthData.basalBodyTemperature !== null ? '°C' : ''}
                    />
                    <DataItem
                      label="Basal Metabolic Rate"
                      value={healthData.basalMetabolicRate !== null ? healthData.basalMetabolicRate.toFixed(0) : 'N/A'}
                      color="#8D6E63"
                      unit="kcal/day"
                    />
                    <DataItem
                      label="Blood Glucose"
                      value={healthData.bloodGlucose !== null ? healthData.bloodGlucose.toFixed(2) : 'N/A'}
                      color="#43A047"
                      unit="mmol/L"
                    />
                    <DataItem
                      label="Body Fat"
                      value={healthData.bodyFat !== null ? healthData.bodyFat.toFixed(1) : 'N/A'}
                      color="#FFB6C1"
                      unit="%"
                    />
                    <DataItem
                      label="Bone Mass"
                      value={healthData.boneMass !== null ? healthData.boneMass.toFixed(2) : 'N/A'}
                      color="#A1887F"
                      unit="kg"
                    />
                    <DataItem
                      label="Cervical Mucus"
                      value={healthData.cervicalMucus || 'N/A'}
                      color="#BA68C8"
                      unit=""
                    />
                    <DataItem
                      label="Elevation Gained"
                      value={healthData.elevationGained !== null ? healthData.elevationGained.toFixed(1) : 'N/A'}
                      color="#90CAF9"
                      unit="m"
                    />
                    <DataItem
                      label="Exercise Session"
                      value={healthData.exerciseSession || 'N/A'}
                      color="#FFD54F"
                      unit=""
                    />
                    <DataItem
                      label="Floors Climbed"
                      value={healthData.floorsClimbed !== null ? healthData.floorsClimbed.toString() : 'N/A'}
                      color="#8D6E63"
                      unit="floors"
                    />
                    <DataItem
                      label="Lean Body Mass"
                      value={healthData.leanBodyMass !== null ? healthData.leanBodyMass.toFixed(2) : 'N/A'}
                      color="#607D8B"
                      unit="kg"
                    />
                    <DataItem
                      label="Nutrition"
                      value={healthData.nutrition !== null ? healthData.nutrition : 'N/A'}
                      color="#FFA726"
                      unit="kcal"
                    />

                    <DataItem
                      label="Ovulation Test"
                      value={healthData.ovulationTest || 'N/A'}
                      color="#AB47BC"
                      unit=""
                    />
                    <DataItem
                      label="Oxygen Saturation"
                      value={healthData.oxygenSaturation !== null ? healthData.oxygenSaturation.toFixed(1) : 'N/A'}
                      color="#00E676"
                      unit="%"
                    />
                    <DataItem
                      label="Power"
                      value={healthData.power !== null ? healthData.power.toFixed(1) : 'N/A'}
                      color="#FF5722"
                      unit="W"
                    />
                    <DataItem
                      label="Respiratory Rate"
                      value={healthData.respiratoryRate !== null ? healthData.respiratoryRate.toFixed(1) : 'N/A'}
                      color="#26A69A"
                      unit="breaths/min"
                    />
                    <DataItem
                      label="Resting Heart Rate"
                      value={healthData.restingHeartRate !== null ? healthData.restingHeartRate.toString() : 'N/A'}
                      color="#C62828"
                      unit="bpm"
                    />
                    <DataItem
                      label="Sexual Activity Time"
                      value={
                        healthData.sexualActivityTimestamp 
                          ? new Date(healthData.sexualActivityTimestamp).toLocaleString()
                          : 'N/A'
                      }
                      color="#F06292"
                      unit=""
                    />
                    <DataItem
                      label="Speed"
                      value={healthData.speed !== null ? healthData.speed.toFixed(2) : 'N/A'}
                      color={COLORS.speed}
                      unit="m/s"
                    />
                    <DataItem
                      label="Steps Cadence"
                      value={healthData.stepsCadence !== null ? healthData.stepsCadence.toFixed(0) : 'N/A'}
                      color={COLORS.stepsCadence}
                      unit="spm" // steps per minute
                    />
                    <DataItem
                      label="VO2 Max"
                      value={healthData.vo2Max !== null ? healthData.vo2Max.toFixed(1) : 'N/A'}
                      color={COLORS.vo2Max}
                      unit="ml/(min·kg)"
                    />
                    <DataItem
                      label="Wheelchair Pushes"
                      value={healthData.wheelchairPushes !== null ? healthData.wheelchairPushes.toString() : 'N/A'}
                      color={COLORS.wheelchairPushes}
                      unit="pushes"
                    />
                  </ScrollView>
                )}
              </>
            )}
          </View>
        ))}
      </PagerView>

      <View style={styles.footer}>
        <Button
          title={loading ? "Fetching..." : "Refresh Data"}
          onPress={() => fetchHealthDataForDate(getDateForPage(pageIndex))}
          disabled={loading}
          color={COLORS.primary}
        />
        {loading && <ActivityIndicator style={styles.loader} color={COLORS.primary} />}
      </View>
    </SafeAreaView>
  );
};

const DataItem = ({ label, value, color, unit }: any) => (
  <View style={styles.dataItem}>
    <View style={[styles.dataIcon, { backgroundColor: color }]} />
    <View style={styles.dataTextContainer}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>
        {value} {unit && <Text style={styles.dataUnit}>{unit}</Text>}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    elevation: 4,
  },
  headerText: {
    color: 'white',
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
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dataIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 16,
  },
  dataTextContainer: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.8,
  },
  dataValue: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 4,
  },
  dataUnit: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  loader: {
    marginTop: 8,
  },
});

export default App;
function getHealthRecords(arg0: string) {
  throw new Error('Function not implemented.');
}

