import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Typography } from '../components/Typography';
import { signup } from '../services/auth';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    try {
      await signup({ name, username: email, password });
      navigate('/dashboard');
    } catch (err) {
      setError('Signup failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Typography variant="h2" className="mt-6 text-center font-bold tracking-tight text-gray-900">
            Create your account
          </Typography>
        </div>
        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="name"
              name="name"
              type="text"
              required
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && (
              <Typography variant="body-sm" color="error" className="text-center">
                {error}
              </Typography>
            )}
            
            <div>
              <Button type="submit" className="group relative flex w-full justify-center">
                Sign up
              </Button>
            </div>
          </form>
        </Card>
        <Typography variant="body" className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default SignUpPage; 