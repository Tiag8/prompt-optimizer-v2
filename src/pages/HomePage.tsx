import React from 'react';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Animated background shapes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: Math.random() * 400 + 100,
            height: Math.random() * 400 + 100,
          }}
          animate={{
            x: [Math.random() * 1000 - 500, Math.random() * 1000 - 500],
            y: [Math.random() * 1000 - 500, Math.random() * 1000 - 500],
            scale: [1, Math.random() + 0.5],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}

      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 'bold',
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              PROMPT OPTIMIZER
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              Optimize your prompts with real-time analysis and multiple LLM support
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/optimizer')}
              sx={{
                fontSize: '1.2rem',
                py: 2,
                px: 4,
                borderRadius: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              ENTER NOW
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;