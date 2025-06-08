import { readRecords } from 'react-native-health-connect';
import { HealthData } from '../types/HealthData';
import { initializeHealthConnect, requestHealthPermissions } from './HealthConnectAPI';

export const fetchHealthDataForDate = async (date: Date): Promise<HealthData> => {
  try {
    const isInitialized = await initializeHealthConnect();
    if (!isInitialized) throw new Error('Initialization failed');

    await requestHealthPermissions();

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

    // Fetch steps
    const totalSteps = stepsResult.records?.reduce((sum, record) => sum + (record.count || 0), 0) || 0;

    // Get current date for height and weight lookup
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

    // Fetch heart rate data
    const latestHeartRate = heartRateResult.records && heartRateResult.records.length > 0
      ? heartRateResult.records[0].samples?.[0]?.beatsPerMinute ?? 'No data'
      : 'No data';

    // Fetch hydration data
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
    const latestSpeed = speedResult.records?.[0]?.samples?.[0]?.speed?.inMetersPerSecond ?? null;
    const latestStepsCadence = stepsCadenceResult.records?.[0]?.samples?.[0]?.rate ?? null;
    const latestVo2Max = vo2MaxResult.records?.[0]?.vo2MillilitersPerMinuteKilogram ?? null;
    const totalWheelchairPushes = wheelchairPushesResult?.records?.reduce((sum, record) => sum + (record.count || 0), 0) || null;

    return {
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
    };
  } catch (error) {
    console.error('Error fetching health data:', error);
    throw error;
  }
};
