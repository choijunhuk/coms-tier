import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CreateTierPage } from "./routes/CreateTierPage";
import { EditTierPage } from "./routes/EditTierPage";
import { HomePage } from "./routes/HomePage";
import { ResultPage } from "./routes/ResultPage";
import { StatsPage } from "./routes/StatsPage";

export default function App() {
  return (
    <BrowserRouter basename="/tier">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateTierPage />} />
          <Route path="/edit/:id" element={<EditTierPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          <Route path="/stats/:id" element={<StatsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
