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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { format } from 'date-fns';

interface Interview {
  id: number;
  candidateId: number;
  candidateName: string;
  interviewerId: number;
  interviewerName: string;
  date: string;
  time: string;
  type: 'TECHNICAL' | 'HR' | 'MANAGERIAL';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

const validationSchema = yup.object({
  candidateId: yup.number().required('Candidate is required'),
  interviewerId: yup.number().required('Interviewer is required'),
  date: yup.string().required('Date is required'),
  time: yup.string().required('Time is required'),
  type: yup.string().required('Interview type is required'),
});

const Interviews = () => {
  const [open, setOpen] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: 1,
      candidateId: 1,
      candidateName: 'John Doe',
      interviewerId: 1,
      interviewerName: 'Sarah Wilson',
      date: '2024-04-20',
      time: '10:00',
      type: 'TECHNICAL',
      status: 'SCHEDULED',
    },
    // Add more mock data as needed
  ]);

  // Mock data for candidates and interviewers
  const candidates = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ];

  const interviewers = [
    { id: 1, name: 'Sarah Wilson' },
    { id: 2, name: 'Mike Johnson' },
  ];

  const formik = useFormik({
    initialValues: {
      candidateId: '',
      interviewerId: '',
      date: '',
      time: '',
      type: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const candidate = candidates.find(c => c.id === Number(values.candidateId));
      const interviewer = interviewers.find(i => i.id === Number(values.interviewerId));
      
      const newInterview: Interview = {
        id: interviews.length + 1,
        candidateId: Number(values.candidateId),
        candidateName: candidate?.name || '',
        interviewerId: Number(values.interviewerId),
        interviewerName: interviewer?.name || '',
        date: values.date,
        time: values.time,
        type: values.type as Interview['type'],
        status: 'SCHEDULED',
      };
      
      setInterviews([...interviews, newInterview]);
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

  const getStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'SCHEDULED':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: Interview['type']) => {
    switch (type) {
      case 'TECHNICAL':
        return 'primary';
      case 'HR':
        return 'secondary';
      case 'MANAGERIAL':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Interviews</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Schedule Interview
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } }}>
        {interviews.map((interview) => (
          <Box key={interview.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {interview.candidateName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Interviewer: {interview.interviewerName}
                </Typography>
                <Typography variant="body2">
                  Date: {format(new Date(interview.date), 'PPP')}
                </Typography>
                <Typography variant="body2">
                  Time: {interview.time}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={interview.type}
                    color={getTypeColor(interview.type)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={interview.status}
                    color={getStatusColor(interview.status)}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Edit
                </Button>
                <Button size="small" color="error">
                  Cancel
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Schedule New Interview</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Candidate</InputLabel>
              <Select
                id="candidateId"
                name="candidateId"
                value={formik.values.candidateId}
                onChange={formik.handleChange}
                error={formik.touched.candidateId && Boolean(formik.errors.candidateId)}
              >
                {candidates.map((candidate) => (
                  <MenuItem key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Interviewer</InputLabel>
              <Select
                id="interviewerId"
                name="interviewerId"
                value={formik.values.interviewerId}
                onChange={formik.handleChange}
                error={formik.touched.interviewerId && Boolean(formik.errors.interviewerId)}
              >
                {interviewers.map((interviewer) => (
                  <MenuItem key={interviewer.id} value={interviewer.id}>
                    {interviewer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              id="date"
              name="date"
              label="Date"
              type="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              id="time"
              name="time"
              label="Time"
              type="time"
              value={formik.values.time}
              onChange={formik.handleChange}
              error={formik.touched.time && Boolean(formik.errors.time)}
              helperText={formik.touched.time && formik.errors.time}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Interview Type</InputLabel>
              <Select
                id="type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                <MenuItem value="TECHNICAL">Technical</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="MANAGERIAL">Managerial</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Schedule
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Interviews; 