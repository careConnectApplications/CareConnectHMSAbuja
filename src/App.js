
import './App.css';
import IndexRoutes from './Routes/Index';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './Utils/Theme';
import { ThemeProvider, ThemeContext } from './Context/ThemeContext';
import { useContext } from 'react';

function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

function MainApp() {
  const { theme: appTheme } = useContext(ThemeContext);

  return (
    <div className={`${appTheme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
        <ChakraProvider theme={theme}>
          <IndexRoutes />
        </ChakraProvider>
      </div>
    </div>
  );
}

export default App;
