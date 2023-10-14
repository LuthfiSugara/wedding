import logo from './logo.svg';
import './App.css';
import Router from './routes';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { Background } from './assets';
import { QueryClient, QueryClientProvider } from 'react-query';

function App() {
  const queryClient = new QueryClient();

  return (
    <Box
      Background={'black'}
    >
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Router/>
        </ChakraProvider>
    </  QueryClientProvider>
    </Box>
  );
}

export default App;
