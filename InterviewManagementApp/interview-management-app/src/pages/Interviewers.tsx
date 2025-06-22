import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface Interviewer {
  id: number;
  name: string;
  email: string;
  expertise: string[];
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  totalInterviews: number;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  expertise: yup.string().required('Expertise is required'),
});

const Interviewers = () => {
  const [open, setOpen] = useState(false);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([
    {
      id: 1,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      expertise: ['Frontend', 'React', 'TypeScript'],
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      ],
      totalInterviews: 15,
    },
    // Add more mock data as needed
  ]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      expertise: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const newInterviewer: Interviewer = {
        id: interviewers.length + 1,
        name: values.name,
        email: values.email,
        expertise: values.expertise.split(',').map(skill => skill.trim()),
        availability: [],
        totalInterviews: 0,
      };
      setInterviewers([...interviewers, newInterviewer]);
      handleClose();
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Interviewers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Interviewer
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } }}>
        {interviewers.map((interviewer) => (
          <Box key={interviewer.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {interviewer.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {interviewer.email}
                </Typography>
                <Box sx={{ mt: 2, mb: 2 }}>
                  {interviewer.expertise.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Total Interviews: {interviewer.totalInterviews}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Availability:
                </Typography>
                {interviewer.availability.map((slot, index) => (
                  <Typography key={index} variant="body2">
                    {slot.day}: {slot.startTime} - {slot.endTime}
                  </Typography>
                ))}
              </CardContent>
              <CardActions>
                <IconButton size="small" color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Add New Interviewer</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
            />
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
            />
            <TextField
              fullWidth
              id="expertise"
              name="expertise"
              label="Expertise (comma-separated)"
              value={formik.values.expertise}
              onChange={formik.handleChange}
              error={formik.touched.expertise && Boolean(formik.errors.expertise)}
              helperText={formik.touched.expertise && formik.errors.expertise}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Interviewers; 