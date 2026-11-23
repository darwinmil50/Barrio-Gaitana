import { Layout } from './components/Layout/Layout';
import { PageView } from './components/Layout/PageView';
import { TerritoryProvider } from './context/TerritoryContext';
import { useHashRoute } from './hooks/useHashRoute';

export default function App() {
  const [page] = useHashRoute();
  return (
    <TerritoryProvider>
      <Layout current={page}>
        <PageView page={page} />
      </Layout>
    </TerritoryProvider>
  );
}
