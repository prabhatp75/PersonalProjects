import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  // Mock data - in a real app, this would come from an API
  const stats = {
    totalCandidates: 25,
    upcomingInterviews: 8,
    totalInterviewers: 12,
    hiredCandidates: 5,
  };

  const upcomingInterviews = [
    { id: 1, candidate: 'John Doe', date: '2024-04-20', time: '10:00 AM', type: 'Technical' },
    { id: 2, candidate: 'Jane Smith', date: '2024-04-21', time: '2:00 PM', type: 'HR' },
    { id: 3, candidate: 'Mike Johnson', date: '2024-04-22', time: '11:00 AM', type: 'Technical' },
  ];

  const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' } }}>
        <Box>
          <StatCard
            title="Total Candidates"
            value={stats.totalCandidates}
            icon={<PeopleIcon color="primary" />}
          />
        </Box>
        <Box>
          <StatCard
            title="Upcoming Interviews"
            value={stats.upcomingInterviews}
            icon={<EventIcon color="secondary" />}
          />
        </Box>
        <Box>
          <StatCard
            title="Total Interviewers"
            value={stats.totalInterviewers}
            icon={<PersonIcon color="success" />}
          />
        </Box>
        <Box>
          <StatCard
            title="Hired Candidates"
            value={stats.hiredCandidates}
            icon={<CheckCircleIcon color="info" />}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Upcoming Interviews
          </Typography>
          <List>
            {upcomingInterviews.map((interview, index) => (
              <React.Fragment key={interview.id}>
                <ListItem>
                  <ListItemText
                    primary={interview.candidate}
                    secondary={`${interview.date} at ${interview.time} - ${interview.type}`}
                  />
                </ListItem>
                {index < upcomingInterviews.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="New candidate added"
                secondary="Sarah Wilson - Frontend Developer"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Interview completed"
                secondary="Technical interview with John Doe"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Candidate hired"
                secondary="Mike Johnson - Backend Developer"
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard; 