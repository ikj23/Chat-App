// src/pages/SignUpPage.tsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Import setDoc and doc
import { auth, db } from '../firebase'; // Import db
import { Container, Box, Typography, TextField, Button, Alert, Link, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';

interface SignUpPageProps {
  onTogglePage: () => void;
}

const SignUpPage = ({ onTogglePage }: SignUpPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState<'agent' | 'viewer'>('agent');

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      // 1. Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create a document in the 'users' collection with the user's UID
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: role // Use the role from our state
      });
      // Success! The listener in App.tsx will handle the rest.
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
      console.error("Sign Up Error:", err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleSignUp} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <FormControl component="fieldset" sx={{ mt: 2, mb: 1 }}>
            <FormLabel component="legend">Select Your Role</FormLabel>
            <RadioGroup row value={role} onChange={(e) => setRole(e.target.value as 'agent' | 'viewer')}>
              <FormControlLabel value="agent" control={<Radio />} label="Agent" />
              <FormControlLabel value="viewer" control={<Radio />} label="Viewer" />
            </RadioGroup>
          </FormControl>

          {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
            Sign Up
          </Button>
          <Link href="#" variant="body2" onClick={onTogglePage}>
            {"Already have an account? Sign In"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpPage;