import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, FONT_SIZE, SPACING } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: any;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', loading, disabled, fullWidth, style }: ButtonProps) {
  const height = size === 'sm' ? 36 : size === 'lg' ? 56 : 48;
  const fontSize = size === 'sm' ? FONT_SIZE.md : size === 'lg' ? FONT_SIZE.lg : FONT_SIZE.md;

  const bg = disabled
    ? COLORS.border
    : variant === 'primary'
    ? COLORS.primary
    : variant === 'secondary'
    ? COLORS.secondary
    : variant === 'outline'
    ? 'transparent'
    : 'transparent';

  const color = disabled
    ? COLORS.textLight
    : variant === 'outline' || variant === 'ghost'
    ? COLORS.primary
    : COLORS.white;

  const borderW = variant === 'outline' ? 1.5 : 0;
  const borderC = variant === 'outline' ? COLORS.primary : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.btn,
        { height, backgroundColor: bg, borderColor: borderC, borderWidth: borderW },
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} size="small" />
      ) : (
        <Text style={[styles.text, { fontSize, color }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
}

export function Input({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize, icon, error, multiline, numberOfLines, style }: InputProps) {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrap, error && styles.inputError, multiline && { height: 100, alignItems: 'flex-start' }]}>
        {icon && (
          <Ionicons name={icon} size={20} color={COLORS.textLight} style={styles.inputIcon} />
        )}
        <TextInput
          style={[styles.input, multiline && { height: 100, textAlignVertical: 'top' }, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  text: {
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    height: 52,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textDark,
    padding: 0,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});
