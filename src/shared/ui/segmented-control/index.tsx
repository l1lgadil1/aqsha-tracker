import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../text';
import { useTheme } from '../../contexts/theme-context';
import { TransactionType } from '../../types/transaction';

interface SegmentedControlProps {
  selectedType: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  selectedType,
  onTypeChange,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      padding: 4,
      width: '100%',
    },
    button: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 6,
    },
    activeButton: {
      backgroundColor: '#FFFFFF',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    text: {
      color: '#9E9E9E',
      fontSize: 14,
      fontWeight: '500',
    },
    activeText: {
      color: '#212121',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          selectedType === 'expense' && styles.activeButton,
        ]}
        onPress={() => onTypeChange('expense')}
      >
        <Text
          variant="body2"
          style={[
            styles.text,
            selectedType === 'expense' && styles.activeText,
          ]}
        >
          Расход
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selectedType === 'income' && styles.activeButton,
        ]}
        onPress={() => onTypeChange('income')}
      >
        <Text
          variant="body2"
          style={[
            styles.text,
            selectedType === 'income' && styles.activeText,
          ]}
        >
          Доход
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selectedType === 'transfer' && styles.activeButton,
        ]}
        onPress={() => onTypeChange('transfer')}
      >
        <Text
          variant="body2"
          style={[
            styles.text,
            selectedType === 'transfer' && styles.activeText,
          ]}
        >
          Перевод
        </Text>
      </TouchableOpacity>
    </View>
  );
}; 