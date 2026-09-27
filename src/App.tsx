import { About } from "./components/About";
import { Activity } from "./components/Activity";
import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="flex-1">
        <Hero />
        <About />
        <Skills />
        <Activity />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}