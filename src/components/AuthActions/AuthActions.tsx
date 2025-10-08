import React from 'react';
import { View } from 'react-native';
import Button from '../Button';
import Link from '../Link';
import { AuthActionsProps } from './AuthActions.types';

// AuthActions composes of the button and the link.
const AuthActions: React.FC<AuthActionsProps> = ({ onGetStarted, onLogin }) => {
  return (
    <View className="absolute bottom-24 left-0 right-0 items-center">
      <Button title="Get Started" onPress={onGetStarted} />
      <Link
        promptText="Already have an account?"
        actionText="Log In"
        onPress={onLogin}
      />
    </View>
  );
};

export default AuthActions;