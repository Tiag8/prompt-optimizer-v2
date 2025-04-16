import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Typography,
  Alert,
  Tooltip,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { llmPricingService } from '../services/llmPricingService';
import { LLMService } from '../services/llmService';

interface LLMConfig {
  id: string;
  name: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  baseUrl?: string;
}

const ApiConfigPage: React.FC = () => {
  const [llms, setLlms] = useState<LLMConfig[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState<LLMConfig | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [prices, setPrices] = useState<Map<string, { inputPrice: number; outputPrice: number }>>(new Map());

  useEffect(() => {
    const loadedLLMs = LLMService.getInstance().getConfigurations();
    setLlms(loadedLLMs);
    
    // Load pricing information
    const pricingMap = llmPricingService.getAllPrices();
    const simplifiedPrices = new Map();
    pricingMap.forEach((pricing, model) => {
      simplifiedPrices.set(model, {
        inputPrice: pricing.inputPrice,
        outputPrice: pricing.outputPrice
      });
    });
    setPrices(simplifiedPrices);

    // Update prices if needed
    llmPricingService.updatePrices();
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newLLM: LLMConfig = {
      id: selectedLLM?.id || Date.now().toString(),
      name: formData.get('name') as string,
      apiKey: formData.get('apiKey') as string,
      model: formData.get('model') as string,
      maxTokens: parseInt(formData.get('maxTokens') as string),
      temperature: parseFloat(formData.get('temperature') as string),
      baseUrl: formData.get('baseUrl') as string,
    };

    try {
      // Test connection before saving
      await LLMService.getInstance().testConnection(newLLM);
      
      if (selectedLLM) {
        LLMService.getInstance().updateConfiguration(newLLM);
      } else {
        LLMService.getInstance().addConfiguration(newLLM);
      }
      
      setLlms(LLMService.getInstance().getConfigurations());
      setOpenDialog(false);
      setSnackbar({ open: true, message: 'LLM configuration saved successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: `Failed to save LLM configuration: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        severity: 'error' 
      });
    }
  };

  const handleDelete = (id: string) => {
    LLMService.getInstance().deleteConfiguration(id);
    setLlms(LLMService.getInstance().getConfigurations());
    setSnackbar({ open: true, message: 'LLM configuration deleted successfully!', severity: 'success' });
  };

  const handleEdit = (llm: LLMConfig) => {
    setSelectedLLM(llm);
    setOpenDialog(true);
  };

  const getPriceInfo = (model: string) => {
    const pricing = llmPricingService.getPricing(model);
    if (!pricing) return 'Pricing not available';
    return `Input: $${pricing.inputPrice}/1k tokens | Output: $${pricing.outputPrice}/1k tokens`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          API Configuration
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedLLM(null);
            setOpenDialog(true);
          }}
        >
          Add New LLM
        </Button>
      </Box>

      <Grid container spacing={3}>
        {llms.map((llm) => (
          <Grid item xs={12} md={6} lg={4} key={llm.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {llm.name}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleEdit(llm)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(llm.id)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography color="textSecondary" gutterBottom>
                  Model: {llm.model}
                </Typography>

                <Paper sx={{ p: 1, mt: 1, bgcolor: 'background.default' }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Current pricing information">
                      <InfoIcon sx={{ mr: 1, fontSize: '1rem' }} />
                    </Tooltip>
                    {getPriceInfo(llm.model)}
                  </Typography>
                </Paper>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Max Tokens: {llm.maxTokens}
                </Typography>
                <Typography variant="body2">
                  Temperature: {llm.temperature}
                </Typography>
                {llm.baseUrl && (
                  <Typography variant="body2">
                    Base URL: {llm.baseUrl}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSave}>
          <DialogTitle>{selectedLLM ? 'Edit LLM Configuration' : 'Add New LLM Configuration'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              name="name"
              defaultValue={selectedLLM?.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="API Key"
              name="apiKey"
              type="password"
              defaultValue={selectedLLM?.apiKey}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Model"
              name="model"
              defaultValue={selectedLLM?.model}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Max Tokens"
              name="maxTokens"
              type="number"
              defaultValue={selectedLLM?.maxTokens}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Temperature"
              name="temperature"
              type="number"
              inputProps={{ step: 0.1, min: 0, max: 2 }}
              defaultValue={selectedLLM?.temperature}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Base URL (Optional)"
              name="baseUrl"
              defaultValue={selectedLLM?.baseUrl}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApiConfigPage;