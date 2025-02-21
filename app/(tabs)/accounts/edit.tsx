import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../src/shared/contexts/theme-context';
import { accountsService } from '../../../src/shared/services/accounts';
import { Account, AccountType } from '../../../src/shared/types/account';
import { z } from 'zod';

const accountSchema = z.object({
  name: z.string().min(1, 'Введите название счета'),
  type: z.enum(['cash', 'card', 'deposit', 'savings'] as const),
  balance: z.number().min(0, 'Баланс не может быть отрицательным'),
  currency: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

const accountTypes: { value: AccountType; label: string }[] = [
  { value: 'cash', label: 'Наличные' },
  { value: 'card', label: 'Карта' },
  { value: 'deposit', label: 'Депозит' },
  { value: 'savings', label: 'Сбережения' },
];

const defaultColors = ['#22C55E', '#EF4444', '#3B82F6', '#F59E0B'];
const defaultIcons = ['💵', '💳', '🏦', '💰'];

export default function EditAccountScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    type: 'cash',
    balance: 0,
    currency: '₸',
    color: defaultColors[0],
    icon: defaultIcons[0],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AccountFormData, string>>>({});

  useEffect(() => {
    if (id) {
      fetchAccount();
    }
  }, [id]);

  const fetchAccount = async () => {
    try {
      const account = await accountsService.getAccountById(id as string);
      if (account) {
        setFormData({
          name: account.name,
          type: account.type,
          balance: account.balance,
          currency: account.currency || '₸',
          color: account.color || defaultColors[0],
          icon: account.icon || defaultIcons[0],
        });
      } else {
        Alert.alert('Ошибка', 'Счет не найден');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching account:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные счета');
      router.back();
    }
  };

  const validateForm = (): boolean => {
    try {
      accountSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: typeof errors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof AccountFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (id) {
        await accountsService.updateAccount(id as string, formData);
        Alert.alert('Успех', 'Счет успешно обновлен');
      } else {
        await accountsService.createAccount(formData);
        Alert.alert('Успех', 'Счет успешно создан');
      }
      router.back();
    } catch (error) {
      console.error('Error saving account:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить счет');
    }
  };

  const handleTypeChange = (type: AccountType) => {
    const typeIndex = accountTypes.findIndex(t => t.value === type);
    setFormData({
      ...formData,
      type,
      color: defaultColors[typeIndex] || defaultColors[0],
      icon: defaultIcons[typeIndex] || defaultIcons[0],
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    error: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
    typeSelector: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -4,
    },
    typeButton: {
      flex: 1,
      minWidth: '45%',
      margin: 4,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
    },
    typeButtonText: {
      fontSize: 14,
      fontWeight: '500',
    },
    saveButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 24,
    },
    saveButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Название счета</Text>
          <TextInput
            style={[
              styles.input,
              errors.name && { borderColor: colors.error },
            ]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Введите название счета"
            placeholderTextColor={colors.textTertiary}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Тип счета</Text>
          <View style={styles.typeSelector}>
            {accountTypes.map((type) => (
              <Pressable
                key={type.value}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor:
                      formData.type === type.value
                        ? colors.primary + '20'
                        : colors.surface,
                    borderColor:
                      formData.type === type.value
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                onPress={() => handleTypeChange(type.value)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    {
                      color:
                        formData.type === type.value
                          ? colors.primary
                          : colors.textPrimary,
                    },
                  ]}
                >
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Начальный баланс</Text>
          <TextInput
            style={[
              styles.input,
              errors.balance && { borderColor: colors.error },
            ]}
            value={formData.balance.toString()}
            onChangeText={(text) =>
              setFormData({ ...formData, balance: parseFloat(text) || 0 })
            }
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
          />
          {errors.balance && <Text style={styles.error}>{errors.balance}</Text>}
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {id ? 'Сохранить изменения' : 'Создать счет'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
} 