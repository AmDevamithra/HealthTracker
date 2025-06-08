import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Colors';

interface DataItemProps {
  label: string;
  value: string;
  color: string;
  unit: string;
}

export const DataItem: React.FC<DataItemProps> = ({ label, value, color, unit }) => (
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 8,
    opacity: 0.85,
  },
  headerText: {
    color: COLORS.text,             // White text
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
    backgroundColor: COLORS.background, // Ensure black
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
    backgroundColor: COLORS.surface, // Dark surface
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
    borderBottomColor: '#222',      // Darker divider
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
    opacity: 0.7,
  },
  dataValue: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 4,
  },
  dataUnit: {
    fontSize: 16,
    color: '#8F8F8F',              // Muted grey for units
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
