import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { Button, Input } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen({ navigation }: any) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});

  const handleSignUp = async () => {
    const newErrors: typeof errors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await signUp(name, email, password);
      navigation.replace('Main');
    } catch (e: any) {
      Alert.alert('Sign Up Failed', e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="heart" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us in making the world better</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={(text) => { setName(text); setErrors({ ...errors, name: undefined }); }}
            placeholder="Enter your full name"
            icon="person-outline"
            error={errors.name}
          />
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: undefined }); }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            error={errors.email}
          />

          <View style={styles.passwordWrap}>
            <Input
              label="Password"
              value={password}
              onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: undefined }); }}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              icon="lock-closed-outline"
              error={errors.password}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text); setErrors({ ...errors, confirmPassword: undefined }); }}
            placeholder="Re-enter your password"
            secureTextEntry={!showPassword}
            icon="lock-closed-outline"
            error={errors.confirmPassword}
          />

          <Button title="Sign Up" onPress={handleSignUp} loading={loading} fullWidth size="lg" />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>Login</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xxl,
  },
  backBtn: {
    marginTop: SPACING.xxl,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textMedium,
    marginTop: SPACING.xs,
  },
  form: {
    marginTop: SPACING.sm,
  },
  passwordWrap: {
    position: 'relative',
  },
  eyeBtn: {
    position: 'absolute',
    right: SPACING.lg,
    top: 38,
    zIndex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  footerText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textMedium,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
