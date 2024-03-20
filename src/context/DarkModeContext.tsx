import { createContext, useEffect } from 'react';
import { useLocalStorageState } from '~/hooks/useLocalStorageState';

type DarkModeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | null>(null);

function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
    'darkMode'
  );

  function toggleDarkMode() {
    setIsDarkMode((prev) => !prev);
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export { DarkModeContext, DarkModeProvider };
