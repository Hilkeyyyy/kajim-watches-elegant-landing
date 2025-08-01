import { useState, useCallback } from "react";

interface ButtonStates {
  [key: string]: boolean;
}

export const useButtonStates = () => {
  const [buttonStates, setButtonStates] = useState<ButtonStates>({});

  const setButtonState = useCallback((buttonId: string, state: boolean, duration?: number) => {
    setButtonStates(prev => ({ ...prev, [buttonId]: state }));
    
    if (duration) {
      setTimeout(() => {
        setButtonStates(prev => ({ ...prev, [buttonId]: false }));
      }, duration);
    }
  }, []);

  const getButtonState = useCallback((buttonId: string) => {
    return buttonStates[buttonId] || false;
  }, [buttonStates]);

  const triggerButtonFeedback = useCallback((buttonId: string, duration: number = 1500) => {
    setButtonState(buttonId, true, duration);
  }, [setButtonState]);

  return {
    getButtonState,
    setButtonState,
    triggerButtonFeedback
  };
};