import './App.css';
import Grap1 from './components/Grap1';
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

function App() {
  const client = new ApolloClient({
    uri: "http://localhost:8000/graphql",
    cache: new InMemoryCache(),
  });
  return (
   <>
   <ApolloProvider client={client}>
      <Grap1 />
   </ApolloProvider>
   </>
  );
}

export default App;
