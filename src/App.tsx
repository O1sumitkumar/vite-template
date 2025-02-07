import { Route, Routes } from "react-router-dom";

import LampDemo from "./components/ui/lamp";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import RegisterPage from "@/pages/auth/Register";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<RegisterPage />} path="/auth/register" />
      <Route element={<LampDemo />} path="/auth/login" />
    </Routes>
  );
}

export default App;
