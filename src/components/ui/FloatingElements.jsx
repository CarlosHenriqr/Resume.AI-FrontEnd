export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Círculos flutuantes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full floating-animation"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-white/5 rounded-full floating-animation-delayed"></div>
      <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-white/15 rounded-full floating-animation"></div>
      <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/8 rounded-full floating-animation-delayed"></div>
      
      {/* Formas geométricas */}
      <div className="absolute top-1/3 left-1/2 w-8 h-8 bg-white/10 rotate-45 floating-animation"></div>
      <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-white/12 rotate-12 floating-animation-delayed"></div>
      
      {/* Gradientes sutis */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
    </div>
  );
};

