// src/pages/LoginPage.tsx
import React, { useState } from 'react'; // <-- FIX: Added useState
import { signInWithEmailAndPassword } from 'firebase/auth'; // <-- FIX: Added firebase import
import { auth } from '../firebase'; // <-- FIX: Added auth import
import { Container, Box, Typography, TextField, Button, Alert, Link } from '@mui/material';

interface LoginPageProps {
  onTogglePage: () => void;
}

const LoginPage = ({ onTogglePage }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Failed to log in. Please check your email and password.');
      console.error("Login Error:", err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Agent Sign In</Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
          <Link href="#" variant="body2" onClick={onTogglePage}>
            {"Don't have an account? Sign Up"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;