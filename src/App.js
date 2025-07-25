
import './App.css';
import IndexRoutes from './Routes/Index';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './Utils/Theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
    
       <IndexRoutes/>
    
    </ChakraProvider>
    
  );
}

export default App;
