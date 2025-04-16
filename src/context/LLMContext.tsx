import React, { createContext, useContext, useState, useEffect } from 'react';
import { LLMConfig, llmService } from '../services/llmService';

interface LLMContextType {
  llms: LLMConfig[];
  selectedLLMs: string[];
  addLLM: (llm: LLMConfig) => void;
  updateLLM: (llm: LLMConfig) => void;
  deleteLLM: (id: string) => void;
  toggleLLMSelection: (id: string) => void;
  isLLMSelected: (id: string) => boolean;
}

const LLMContext = createContext<LLMContextType | undefined>(undefined);

export const useLLM = () => {
  const context = useContext(LLMContext);
  if (!context) {
    throw new Error('useLLM must be used within a LLMProvider');
  }
  return context;
};

interface LLMProviderProps {
  children: React.ReactNode;
}

export const LLMProvider: React.FC<LLMProviderProps> = ({ children }) => {
  const [llms, setLLMs] = useState<LLMConfig[]>([]);
  const [selectedLLMs, setSelectedLLMs] = useState<string[]>([]);

  useEffect(() => {
    // Load LLMs from service
    const loadedLLMs = llmService.getAllConfigs();
    setLLMs(loadedLLMs);

    // Load selected LLMs from localStorage
    const savedSelectedLLMs = localStorage.getItem('selectedLLMs');
    if (savedSelectedLLMs) {
      setSelectedLLMs(JSON.parse(savedSelectedLLMs));
    }
  }, []);

  const addLLM = (llm: LLMConfig) => {
    llmService.updateConfig(llm);
    setLLMs(llmService.getAllConfigs());
  };

  const updateLLM = (llm: LLMConfig) => {
    llmService.updateConfig(llm);
    setLLMs(llmService.getAllConfigs());
  };

  const deleteLLM = (id: string) => {
    llmService.deleteConfig(id);
    setLLMs(llmService.getAllConfigs());
    setSelectedLLMs(prev => prev.filter(llmId => llmId !== id));
  };

  const toggleLLMSelection = (id: string) => {
    setSelectedLLMs(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(llmId => llmId !== id)
        : [...prev, id];
      
      // Save to localStorage
      localStorage.setItem('selectedLLMs', JSON.stringify(newSelection));
      return newSelection;
    });
  };

  const isLLMSelected = (id: string) => selectedLLMs.includes(id);

  const value = {
    llms,
    selectedLLMs,
    addLLM,
    updateLLM,
    deleteLLM,
    toggleLLMSelection,
    isLLMSelected,
  };

  return <LLMContext.Provider value={value}>{children}</LLMContext.Provider>;
};