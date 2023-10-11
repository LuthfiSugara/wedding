import logo from './logo.svg';
import './App.css';
import Router from './routes';
import { ChakraProvider } from '@chakra-ui/react';
import { Background } from './assets';
import { QueryClient, QueryClientProvider } from 'react-query';

function App() {
  const queryClient = new QueryClient();

  return (
    <div
      style={{
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        // backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh'
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Router/>
        </ChakraProvider>
    </  QueryClientProvider>
    </div>
  );
}

export default App;
