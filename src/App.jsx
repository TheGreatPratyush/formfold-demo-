import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Playground from './components/Playground';
import ObjectComparison from './components/ObjectComparison';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Limitations from './components/Limitations';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Hero />
        <Playground />
        <ObjectComparison />
        <Features />
        <HowItWorks />
        <Limitations />
      </main>
      <Footer />
    </div>
  );
}
