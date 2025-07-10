import React from 'react';
import { Button } from '../components/Button';
import { Typography } from '../components/Typography';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between pb-4 border-b">
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="ghost">
          Logout
        </Button>
      </div>
      <div className="mt-8">
        <Typography variant="body-lg">
          Welcome to your dashboard.
        </Typography>
        <Typography variant="body" color="muted" className="mt-2">
          Here you can manage your workflows, files, and API keys.
        </Typography>
      </div>
    </div>
  );
};

export default DashboardPage; 