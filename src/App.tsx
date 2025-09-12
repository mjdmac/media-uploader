import React from 'react';
import FileUploader from './components/FileUploader';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-blue-400 to-slate-500 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        {/* Large floating flowers */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-20 left-20 w-16 h-16 bg-white rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-32 left-16 w-8 h-8 bg-white rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="absolute top-16 right-16 w-24 h-24 bg-white rounded-full opacity-35 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-28 right-28 w-12 h-12 bg-white rounded-full opacity-45 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="absolute bottom-20 left-24 w-20 h-20 bg-white rounded-full opacity-30 animate-bounce" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-32 left-32 w-10 h-10 bg-white rounded-full opacity-40 animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        <div className="absolute bottom-16 right-20 w-28 h-28 bg-white rounded-full opacity-25 animate-bounce" style={{ animationDelay: '3.5s' }}></div>
        <div className="absolute bottom-28 right-32 w-14 h-14 bg-white rounded-full opacity-35 animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Scattered petals */}
        <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-white rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-white rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-white rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute top-2/3 right-1/4 w-12 h-12 bg-white rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1.7s' }}></div>
        
        {/* Heart shapes using CSS */}
        <div className="absolute top-1/4 left-1/3 w-6 h-6 opacity-40 animate-pulse" style={{ animationDelay: '2.2s' }}>
          <div className="w-6 h-6 bg-white transform rotate-45 relative">
            <div className="w-6 h-6 bg-white rounded-full absolute -left-3 top-0"></div>
            <div className="w-6 h-6 bg-white rounded-full absolute left-0 -top-3"></div>
          </div>
        </div>
        
        <div className="absolute bottom-1/4 right-1/3 w-4 h-4 opacity-50 animate-bounce" style={{ animationDelay: '2.7s' }}>
          <div className="w-4 h-4 bg-white transform rotate-45 relative">
            <div className="w-4 h-4 bg-white rounded-full absolute -left-2 top-0"></div>
            <div className="w-4 h-4 bg-white rounded-full absolute left-0 -top-2"></div>
          </div>
        </div>
      </div>
      
      {/* Sparkle effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-blue-200 rounded-full opacity-80 animate-ping" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute top-1/3 right-1/5 w-1 h-1 bg-blue-300 rounded-full opacity-90 animate-ping" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-200 rounded-full opacity-70 animate-ping" style={{ animationDelay: '1.3s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-blue-300 rounded-full opacity-85 animate-ping" style={{ animationDelay: '1.8s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-200 rounded-full opacity-75 animate-ping" style={{ animationDelay: '2.3s' }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <FileUploader />
      </div>
    </div>
  );
}

export default App;