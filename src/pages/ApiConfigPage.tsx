import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface LLMConfig {
  id: string;
  name: string;
  apiKey: string;
  baseUrl?: string;
  model: string;
  maxTokens: number;
  temperature: number;
  costPer1kTokens: number;
}

const defaultLLMs: LLMConfig[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    apiKey: '',
    model: 'gpt-4',
    maxTokens: 8192,
    temperature: 0.7,
    costPer1kTokens: 0.03,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    maxTokens: 4096,
    temperature: 0.7,
    costPer1kTokens: 0.002,
  },
];

const ApiConfigPage: React.FC = () => {
  const theme = useTheme();
  const [llms, setLLMs] = useState<LLMConfig[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentLLM, setCurrentLLM] = useState<LLMConfig | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const savedLLMs = localStorage.getItem('llmConfigs');
    if (savedLLMs) {
      setLLMs(JSON.parse(savedLLMs));
    } else {
      setLLMs(defaultLLMs);
    }
  }, []);

  const handleSave = (llm: LLMConfig) => {
    const newLLMs = currentLLM
      ? llms.map((l) => (l.id === currentLLM.id ? llm : l))
      : [...llms, { ...llm, id: Date.now().toString() }];
    
    setLLMs(newLLMs);
    localStorage.setItem('llmConfigs', JSON.stringify(newLLMs));
    setOpenDialog(false);
    setSnackbar({
      open: true,
      message: `LLM ${currentLLM ? 'updated' : 'added'} successfully!`,
      severity: 'success',
    });
  };

  const handleDelete = (id: string) => {
    const newLLMs = llms.filter((llm) => llm.id !== id);
    setLLMs(newLLMs);
    localStorage.setItem('llmConfigs', JSON.stringify(newLLMs));
    setSnackbar({
      open: true,
      message: 'LLM removed successfully!',
      severity: 'success',
    });
  };

  const handleEdit = (llm: LLMConfig) => {
    setCurrentLLM(llm);
    setOpenDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            API Configuration
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setCurrentLLM(null);
              setOpenDialog(true);
            }}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            }}
          >
            Add New LLM
          </Button>
        </Box>

        <Grid container spacing={3}>
          {llms.map((llm) => (
            <Grid item xs={12} md={6} key={llm.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">{llm.name}</Typography>
                      <Box>
                        <IconButton onClick={() => handleEdit(llm)} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(llm.id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Model: {llm.model}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Max Tokens: {llm.maxTokens}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Temperature: {llm.temperature}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cost per 1k tokens: ${llm.costPer1kTokens}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={llm.apiKey ? 'API Key Set' : 'No API Key'}
                        color={llm.apiKey ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <LLMConfigDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSave={handleSave}
          initialData={currentLLM}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Box>
  );
};

interface LLMConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (llm: LLMConfig) => void;
  initialData: LLMConfig | null;
}

const LLMConfigDialog: React.FC<LLMConfigDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<LLMConfig>({
    id: '',
    name: '',
    apiKey: '',
    model: '',
    maxTokens: 2048,
    temperature: 0.7,
    costPer1kTokens: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: '',
        name: '',
        apiKey: '',
        model: '',
        maxTokens: 2048,
        temperature: 0.7,
        costPer1kTokens: 0,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initialData ? 'Edit LLM' : 'Add New LLM'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              label="API Key"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              required
              type="password"
            />
            <TextField
              label="Model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
            />
            <TextField
              label="Base URL (Optional)"
              value={formData.baseUrl}
              onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
            />
            <TextField
              label="Max Tokens"
              type="number"
              value={formData.maxTokens}
              onChange={(e) => setFormData({ ...formData, maxTokens: Number(e.target.value) })}
              required
            />
            <TextField
              label="Temperature"
              type="number"
              inputProps={{ step: 0.1, min: 0, max: 2 }}
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
              required
            />
            <TextField
              label="Cost per 1k tokens ($)"
              type="number"
              inputProps={{ step: 0.001 }}
              value={formData.costPer1kTokens}
              onChange={(e) => setFormData({ ...formData, costPer1kTokens: Number(e.target.value) })}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ApiConfigPage;