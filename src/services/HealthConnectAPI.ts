import { initialize, requestPermission } from 'react-native-health-connect';

export const initializeHealthConnect = async (): Promise<boolean> => {
  return await initialize();
};
export const requestHealthPermissions = async () => {
  return await requestPermission([
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
    };