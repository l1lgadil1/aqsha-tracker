import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../../shared/contexts/theme-context';
import { Category } from '../../../../shared/types/transaction';
import Animated, {
  FadeIn,
  FadeInDown,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface CategorySelectorModalProps {
  onClose: () => void;
  onSelect: (category: Category) => void;
}

const EXPENSE_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Покупать',
    icon: '🌱',
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
    type: 'expense',
  },
  {
    id: '2',
    name: 'Grocery',
    icon: '🛒',
    backgroundColor: '#E3F2FD',
    color: '#2196F3',
    type: 'expense',
  },
  {
    id: '3',
    name: 'Транспорт',
    icon: '🚌',
    backgroundColor: '#E3F2FD',
    color: '#2196F3',
    type: 'expense',
  },
  {
    id: '4',
    name: 'Другое',
    icon: '💰',
    backgroundColor: '#FFF3E0',
    color: '#FF9800',
    type: 'expense',
  },
  {
    id: '5',
    name: 'Развлечения',
    icon: '🎁',
    backgroundColor: '#FCE4EC',
    color: '#E91E63',
    type: 'expense',
  },
  {
    id: '6',
    name: 'одежда',
    icon: '🌱',
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
    type: 'expense',
  },
  {
    id: '7',
    name: 'качалка',
    icon: '🌱',
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
    type: 'expense',
  },
  {
    id: '8',
    name: 'Платежи',
    icon: '💵',
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
    type: 'expense',
  },
];

const CategoryButton: React.FC<{
  category: Category;
  index: number;
  onPress: () => void;
}> = ({ category, index, onPress }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const styles = StyleSheet.create({
    categoryItem: {
      width: '25%',
      alignItems: 'center',
      paddingHorizontal: 8,
      marginBottom: 20,
    },
    categoryInner: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: category.backgroundColor || colors.surface,
      marginBottom: 8,
    },
    categoryIcon: {
      fontSize: 24,
    },
    categoryName: {
      fontSize: 13,
      fontWeight: '500',
      textAlign: 'center',
      color: colors.textPrimary,
    },
  });

  return (
    <AnimatedTouchableOpacity
      entering={FadeInDown.delay(index * 50).springify()}
      style={[styles.categoryItem, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <View style={styles.categoryInner}>
        <Text style={styles.categoryIcon}>{category.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </AnimatedTouchableOpacity>
  );
};

export const CategorySelectorModal = React.forwardRef<BottomSheetModal, CategorySelectorModalProps>(
  ({ onClose, onSelect }, ref) => {
    const { colors } = useTheme();
    const snapPoints = React.useMemo(() => ['45%'], []);

    const renderBackdrop = React.useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      [],
    );

    const styles = StyleSheet.create({
      contentContainer: {
        flex: 1,
      },
      header: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      },
      headerText: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
      },
      categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 20,
        paddingHorizontal: 8,
        backgroundColor: colors.background,
      },
    });

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        handleIndicatorStyle={{
          backgroundColor: colors.border,
          width: 40,
        }}
        backgroundStyle={{
          backgroundColor: colors.background,
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Animated.View entering={FadeIn.duration(200)} style={styles.header}>
            <Text style={styles.headerText}>Выберите категорию</Text>
          </Animated.View>
          <View style={styles.categoriesContainer}>
            {EXPENSE_CATEGORIES.map((category, index) => (
              <CategoryButton
                key={category.id}
                category={category}
                index={index}
                onPress={() => {
                  onSelect(category);
                  onClose();
                }}
              />
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
