import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Typography } from '../components/Typography';
import { login } from '../services/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await login({ username: email, password });
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Typography variant="h2" className="mt-6 text-center font-bold tracking-tight text-gray-900">
            Sign in to your account
          </Typography>
        </div>
        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              required
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography variant="body-sm" color="error" className="text-center">
                {error}
              </Typography>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button type="submit" className="group relative flex w-full justify-center">
                Sign in
              </Button>
            </div>
          </form>
        </Card>
        <Typography variant="body" className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default LoginPage; 