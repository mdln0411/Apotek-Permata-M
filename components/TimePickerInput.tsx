import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DateTimePicker =
  Platform.OS === 'web'
    ? null
    : require('@react-native-community/datetimepicker').default;

type TimePickerInputProps = {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
};

function parseTimeToDate(time: string): Date {
  const date = new Date();
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(Number.isFinite(hours) ? hours : 8, Number.isFinite(minutes) ? minutes : 0, 0, 0);
  } else {
    date.setHours(8, 0, 0, 0);
  }
  return date;
}

export function TimePickerInput({
  value,
  onChange,
  placeholder = 'Pilih Waktu',
}: TimePickerInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(() => parseTimeToDate(value));

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleNativeChange = (event: { type?: string }, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event?.type === 'dismissed' || !selected) {
      return;
    }
    setPickerDate(selected);
    onChange(formatTime(selected));
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Feather name="clock" size={18} color="#2E8B57" style={styles.icon} />
        {React.createElement('input', {
          type: 'time',
          value: value || '08:00',
          onChange: (e: { target: { value: string } }) => onChange(e.target.value),
          style: {
            flex: 1,
            fontSize: 15,
            color: '#333',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontFamily: 'inherit',
          },
        })}
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          setPickerDate(parseTimeToDate(value));
          setShowPicker(true);
        }}
        activeOpacity={0.7}
      >
        <Feather name="clock" size={18} color="#2E8B57" style={styles.icon} />
        <Text style={[styles.label, !value && styles.placeholder]}>{value || placeholder}</Text>
        <Feather name="chevron-down" size={18} color="#999" />
      </TouchableOpacity>

      {showPicker && DateTimePicker ? (
        <DateTimePicker
          value={pickerDate}
          mode="time"
          is24Hour
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleNativeChange}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  icon: {
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  placeholder: {
    color: '#999',
    fontWeight: '400',
  },
});
