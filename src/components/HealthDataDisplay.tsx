import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { DataItem } from './DataItem';
import { HealthData } from '../types/HealthData';
import { COLORS } from '../constants/Colors';

interface HealthDataDisplayProps {
  healthData: HealthData;
}

export const HealthDataDisplay: React.FC<HealthDataDisplayProps> = ({ healthData }) => (
  <ScrollView style={styles.dataContainer} contentContainerStyle={styles.scrollContent}>
    {/* Activity */}
    <Text style={styles.sectionHeader}>Activity</Text>
    <DataItem label="Steps" value={healthData.steps.toLocaleString()} color={COLORS.secondary} unit="steps" />
    <DataItem label="Distance" value={(healthData.distance / 1000).toFixed(2)} color={COLORS.distance} unit="km" />
    <DataItem label="Total Calories Burned" value={healthData.calories.toFixed(0)} color={COLORS.calories} unit="kcal" />
    <DataItem label="Active Calories" value={healthData.activeCalories !== null ? healthData.activeCalories.toFixed(0) : 'N/A'} color="#FF7043" unit="kcal" />
    <DataItem label="Elevation Gained" value={healthData.elevationGained !== null ? healthData.elevationGained.toFixed(1) : 'N/A'} color="#90CAF9" unit="m" />
    <DataItem label="Exercise Session" value={healthData.exerciseSession || 'N/A'} color="#FFD54F" unit="" />
    <DataItem label="Floors Climbed" value={healthData.floorsClimbed !== null ? healthData.floorsClimbed.toString() : 'N/A'} color="#8D6E63" unit="floors" />
    <DataItem label="Power" value={healthData.power !== null ? healthData.power.toFixed(1) : 'N/A'} color="#FF5722" unit="W" />
    <DataItem label="Speed" value={healthData.speed !== null ? healthData.speed.toFixed(2) : 'N/A'} color={COLORS.speed} unit="m/s" />
    <DataItem label="Steps Cadence" value={healthData.stepsCadence !== null ? healthData.stepsCadence.toFixed(0) : 'N/A'} color={COLORS.stepsCadence} unit="spm" />
    <DataItem label="Wheelchair Pushes" value={healthData.wheelchairPushes !== null ? healthData.wheelchairPushes.toString() : 'N/A'} color={COLORS.wheelchairPushes} unit="pushes" />

    {/* Body Measurements */}
    <Text style={styles.sectionHeader}>Body Measurements</Text>
    <DataItem label="Height" value={(healthData.height * 100).toFixed(1)} color={COLORS.primary} unit="cm" />
    <DataItem label="Weight" value={healthData.weight > 0 ? `${healthData.weight.toFixed(1)}` : 'N/A'} color={COLORS.weight} unit="kg" />
    <DataItem label="Body Fat" value={healthData.bodyFat !== null ? healthData.bodyFat.toFixed(1) : 'N/A'} color="#FFB6C1" unit="%" />
    <DataItem label="Lean Body Mass" value={healthData.leanBodyMass !== null ? healthData.leanBodyMass.toFixed(2) : 'N/A'} color="#607D8B" unit="kg" />
    <DataItem label="Bone Mass" value={healthData.boneMass !== null ? healthData.boneMass.toFixed(2) : 'N/A'} color="#A1887F" unit="kg" />

    {/* Nutrition */}
    <Text style={styles.sectionHeader}>Nutrition</Text>
    <DataItem label="Nutrition" value={healthData.nutrition !== null ? healthData.nutrition : 'N/A'} color="#FFA726" unit="kcal" />
    <DataItem label="Hydration" value={healthData.hydration !== null && healthData.hydration > 0 ? healthData.hydration.toFixed(2) : 'N/A'} color={COLORS.hydration} unit="L" />

    {/* Sleep */}
    <Text style={styles.sectionHeader}>Sleep</Text>
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

    {/* Vitals */}
    <Text style={styles.sectionHeader}>Vitals</Text>
    <DataItem label="Heart Rate" value={healthData.heartRate && healthData.heartRate !== 'No data' ? `${healthData.heartRate}` : 'N/A'} color={COLORS.heartRate} unit={healthData.heartRate && healthData.heartRate !== 'No data' ? 'bpm' : ''} />
    <DataItem label="Resting Heart Rate" value={healthData.restingHeartRate !== null ? healthData.restingHeartRate.toString() : 'N/A'} color="#C62828" unit="bpm" />
    <DataItem label="Blood Pressure" value={healthData.bloodPressure && healthData.bloodPressure.systolic && healthData.bloodPressure.diastolic ? `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}` : 'N/A'} color={COLORS.bloodPressure} unit="mmHg" />
    <DataItem label="Blood Glucose" value={healthData.bloodGlucose !== null ? healthData.bloodGlucose.toFixed(2) : 'N/A'} color="#43A047" unit="mmol/L" />
    <DataItem label="Body Temperature" value={healthData.bodyTemperature !== null ? healthData.bodyTemperature.toFixed(1) : 'N/A'} color={COLORS.bodyTemperature} unit={healthData.bodyTemperature !== null ? '°C' : ''} />
    <DataItem label="Basal Body Temp." value={healthData.basalBodyTemperature !== null ? healthData.basalBodyTemperature.toFixed(1) : 'N/A'} color="#00B8D4" unit={healthData.basalBodyTemperature !== null ? '°C' : ''} />
    <DataItem label="Basal Metabolic Rate" value={healthData.basalMetabolicRate !== null ? healthData.basalMetabolicRate.toFixed(0) : 'N/A'} color="#8D6E63" unit="kcal/day" />
    <DataItem label="Oxygen Saturation" value={healthData.oxygenSaturation !== null ? healthData.oxygenSaturation.toFixed(1) : 'N/A'} color="#00E676" unit="%" />
    <DataItem label="Respiratory Rate" value={healthData.respiratoryRate !== null ? healthData.respiratoryRate.toFixed(1) : 'N/A'} color="#26A69A" unit="breaths/min" />
    <DataItem label="VO2 Max" value={healthData.vo2Max !== null ? healthData.vo2Max.toFixed(1) : 'N/A'} color={COLORS.vo2Max} unit="ml/(min·kg)" />

    {/* Reproductive Health */}
    <Text style={styles.sectionHeader}>Reproductive Health</Text>
    <DataItem label="Menstruation Flow" value={healthData.menstruationFlow || 'N/A'} color={COLORS.menstruation} unit="" />
    <DataItem label="Menstruation Period" value={healthData.menstruationPeriod || 'N/A'} color={COLORS.menstruation} unit="" />
    <DataItem label="Ovulation Test" value={healthData.ovulationTest || 'N/A'} color="#AB47BC" unit="" />
    <DataItem label="Cervical Mucus" value={healthData.cervicalMucus || 'N/A'} color="#BA68C8" unit="" />
    <DataItem label="Sexual Activity Time" value={healthData.sexualActivityTimestamp ? new Date(healthData.sexualActivityTimestamp).toLocaleString() : 'N/A'} color="#F06292" unit="" />
  </ScrollView>
);

const styles = StyleSheet.create({
  dataContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 8,
    opacity: 0.85,
  },
});
