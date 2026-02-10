import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MarketIndices } from './pages/MarketIndices';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MarketIndices />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
