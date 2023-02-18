// import React from 'react';
import { THEME } from "../types";

const getInitialTheme = () => {

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark');
        return 'dark';
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light');
        return 'light';
      }
      
      // Whenever the user explicitly chooses light mode
    //   localStorage.theme = 'light'
      
      // Whenever the user explicitly chooses dark mode
    //   localStorage.theme = 'dark'
      
      // Whenever the user explicitly chooses to respect the OS preference
    //   localStorage.removeItem('theme')
  };

  const initialState = {
    theme: getInitialTheme(),
  };

  export const setTheme = (theme) => ({
    type: 'THEME',
    theme,
  });

  
  export default function darkModeReducer(state = initialState, action) {
    switch (action.type) {
      case THEME:
        const { theme } = action;
        const root = window.document.documentElement;
        const isDark = theme === 'dark';
  
        root.classList.remove(isDark ? 'light' : 'dark');
        root.classList.add(theme);
  
        localStorage.setItem('theme', theme);
  
        return { ...state, theme };
      default:
        return state;
    }
  }