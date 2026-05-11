import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
  AccessibilityRole,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  iconName: string;
  onPress: () => void;
  variant?: 'primary' | 'danger';
  /** Edit mode: show drag handle and delete icon */
  editMode?: boolean;
  onDelete?: () => void;
  accessibilityLabel?: string;
}

export default function NavButton({
  label,
  iconName,
  onPress,
  variant = 'primary',
  editMode = false,
  onDelete,
  accessibilityLabel,
}: Props) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const isPrimary = variant === 'primary';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole={'button' as AccessibilityRole}
        style={[styles.button, isPrimary ? styles.primary : styles.danger]}
      >
        {/* Left: drag handle in edit mode, otherwise icon */}
        {editMode ? (
          <Ionicons name="reorder-three-outline" size={22} color="#888" style={styles.dragHandle} />
        ) : (
          <Ionicons
            name={iconName as any}
            size={20}
            color={isPrimary ? '#2C2C2C' : '#FFFFFF'}
            style={styles.icon}
          />
        )}

        <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelDanger]}>
          {label}
        </Text>

        {/* Right: delete icon in edit mode */}
        {editMode && (
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={`Eliminar ${label}`}
            style={styles.deleteBtn}
          >
            <Ionicons name="close-circle" size={20} color="#E63946" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  primary: {
    backgroundColor: '#F5C842',
  },
  danger: {
    backgroundColor: '#E63946',
    shadowColor: '#E63946',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 6,
  },
  icon: {
    marginRight: 12,
  },
  dragHandle: {
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  labelPrimary: {
    color: '#2C2C2C',
  },
  labelDanger: {
    color: '#FFFFFF',
  },
  deleteBtn: {
    marginLeft: 8,
  },
});
