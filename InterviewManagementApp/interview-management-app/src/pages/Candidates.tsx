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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  experience: number;
  skills: string[];
  status: 'NEW' | 'IN_PROCESS' | 'SELECTED' | 'REJECTED';
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  experience: yup.number().required('Experience is required'),
  skills: yup.string().required('Skills are required'),
});

const Candidates = () => {
  const [open, setOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      experience: 5,
      skills: ['React', 'TypeScript', 'Node.js'],
      status: 'IN_PROCESS',
    },
    // Add more mock data as needed
  ]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      experience: '',
      skills: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const newCandidate: Candidate = {
        id: candidates.length + 1,
        name: values.name,
        email: values.email,
        phone: values.phone,
        experience: Number(values.experience),
        skills: values.skills.split(',').map(skill => skill.trim()),
        status: 'NEW',
      };
      setCandidates([...candidates, newCandidate]);
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

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'NEW':
        return 'info';
      case 'IN_PROCESS':
        return 'warning';
      case 'SELECTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Candidates</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Candidate
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>{candidate.phone}</TableCell>
                <TableCell>{candidate.experience} years</TableCell>
                <TableCell>
                  {candidate.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Chip
                    label={candidate.status}
                    color={getStatusColor(candidate.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Add New Candidate</DialogTitle>
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
              id="phone"
              name="phone"
              label="Phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              margin="normal"
            />
            <TextField
              fullWidth
              id="experience"
              name="experience"
              label="Experience (years)"
              type="number"
              value={formik.values.experience}
              onChange={formik.handleChange}
              error={formik.touched.experience && Boolean(formik.errors.experience)}
              helperText={formik.touched.experience && formik.errors.experience}
              margin="normal"
            />
            <TextField
              fullWidth
              id="skills"
              name="skills"
              label="Skills (comma-separated)"
              value={formik.values.skills}
              onChange={formik.handleChange}
              error={formik.touched.skills && Boolean(formik.errors.skills)}
              helperText={formik.touched.skills && formik.errors.skills}
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

export default Candidates; 