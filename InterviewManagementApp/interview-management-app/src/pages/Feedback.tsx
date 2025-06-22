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
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { format } from 'date-fns';

interface Feedback {
  id: number;
  interviewId: number;
  candidateName: string;
  interviewerName: string;
  date: string;
  technicalRating: number;
  communicationRating: number;
  problemSolvingRating: number;
  comments: string;
  decision: 'HIRE' | 'REJECT' | 'HOLD';
}

const validationSchema = yup.object({
  interviewId: yup.number().required('Interview is required'),
  technicalRating: yup.number().required('Technical rating is required'),
  communicationRating: yup.number().required('Communication rating is required'),
  problemSolvingRating: yup.number().required('Problem solving rating is required'),
  comments: yup.string().required('Comments are required'),
  decision: yup.string().required('Decision is required'),
});

const FeedbackPage = () => {
  const [open, setOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: 1,
      interviewId: 1,
      candidateName: 'John Doe',
      interviewerName: 'Sarah Wilson',
      date: '2024-04-20',
      technicalRating: 4,
      communicationRating: 5,
      problemSolvingRating: 4,
      comments: 'Strong technical skills and excellent communication. Shows great potential.',
      decision: 'HIRE',
    },
    // Add more mock data as needed
  ]);

  // Mock data for interviews
  const interviews = [
    { id: 1, candidateName: 'John Doe', date: '2024-04-20' },
    { id: 2, candidateName: 'Jane Smith', date: '2024-04-21' },
  ];

  const formik = useFormik({
    initialValues: {
      interviewId: '',
      technicalRating: 0,
      communicationRating: 0,
      problemSolvingRating: 0,
      comments: '',
      decision: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const interview = interviews.find(i => i.id === Number(values.interviewId));
      const newFeedback: Feedback = {
        id: feedbacks.length + 1,
        interviewId: Number(values.interviewId),
        candidateName: interview?.candidateName || '',
        interviewerName: 'Sarah Wilson', // In a real app, this would come from the logged-in user
        date: interview?.date || '',
        technicalRating: values.technicalRating,
        communicationRating: values.communicationRating,
        problemSolvingRating: values.problemSolvingRating,
        comments: values.comments,
        decision: values.decision as Feedback['decision'],
      };
      setFeedbacks([...feedbacks, newFeedback]);
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

  const getDecisionColor = (decision: Feedback['decision']) => {
    switch (decision) {
      case 'HIRE':
        return 'success';
      case 'REJECT':
        return 'error';
      case 'HOLD':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Interview Feedback</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Feedback
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        {feedbacks.map((feedback) => (
          <Box key={feedback.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {feedback.candidateName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Interviewer: {feedback.interviewerName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Date: {format(new Date(feedback.date), 'PPP')}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Technical Skills:</Typography>
                  <Rating value={feedback.technicalRating} readOnly />
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">Communication:</Typography>
                  <Rating value={feedback.communicationRating} readOnly />
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">Problem Solving:</Typography>
                  <Rating value={feedback.problemSolvingRating} readOnly />
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Comments:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {feedback.comments}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={feedback.decision}
                    color={getDecisionColor(feedback.decision)}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Add Interview Feedback</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Interview</InputLabel>
              <Select
                id="interviewId"
                name="interviewId"
                value={formik.values.interviewId}
                onChange={formik.handleChange}
                error={formik.touched.interviewId && Boolean(formik.errors.interviewId)}
              >
                {interviews.map((interview) => (
                  <MenuItem key={interview.id} value={interview.id}>
                    {interview.candidateName} - {format(new Date(interview.date), 'PPP')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">Technical Skills Rating</Typography>
              <Rating
                name="technicalRating"
                value={formik.values.technicalRating}
                onChange={(_, value) => {
                  formik.setFieldValue('technicalRating', value);
                }}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">Communication Rating</Typography>
              <Rating
                name="communicationRating"
                value={formik.values.communicationRating}
                onChange={(_, value) => {
                  formik.setFieldValue('communicationRating', value);
                }}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">Problem Solving Rating</Typography>
              <Rating
                name="problemSolvingRating"
                value={formik.values.problemSolvingRating}
                onChange={(_, value) => {
                  formik.setFieldValue('problemSolvingRating', value);
                }}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              id="comments"
              name="comments"
              label="Comments"
              value={formik.values.comments}
              onChange={formik.handleChange}
              error={formik.touched.comments && Boolean(formik.errors.comments)}
              helperText={formik.touched.comments && formik.errors.comments}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Decision</InputLabel>
              <Select
                id="decision"
                name="decision"
                value={formik.values.decision}
                onChange={formik.handleChange}
                error={formik.touched.decision && Boolean(formik.errors.decision)}
              >
                <MenuItem value="HIRE">Hire</MenuItem>
                <MenuItem value="REJECT">Reject</MenuItem>
                <MenuItem value="HOLD">Hold</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default FeedbackPage; 