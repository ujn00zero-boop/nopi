import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';

const Auth: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <LoginForm 
      onToggleMode={() => setIsRegister(!isRegister)} 
      isRegister={isRegister} 
    />
  );
};

export default Auth;