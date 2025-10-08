import { ThemedPressable } from '@/components/ThemedPressable/ThemedPressable';
import React from 'react';
import { View } from 'react-native';
import Link from '../Link';
import { AuthActionsProps } from './AuthActions.types';

// AuthActions composes of the button and the link.
const AuthActions: React.FC<AuthActionsProps> = ({ onGetStarted, onLogin }) => {
  return (
    <View className="absolute bottom-24 left-0 right-0 items-center">
      <ThemedPressable
                  label="Register"
                  onPress={onGetStarted}
                  loading={false}
                  disabled={false}
                  className="mt-18 w-80 self-center bg-brand"
                />
      {/* <Button title="Get Started" onPress={onGetStarted} /> */}
      <Link
        promptText="Already have an account? "
        actionText="Log In"
        onPress={onLogin}
      />
    </View>
  );
};

export default AuthActions;