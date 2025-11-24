import React from 'react';

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50 to-rose-50 flex items-center justify-center py-8 px-2">
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/90 rounded-2xl shadow-xl p-10 animate-fade-in">
        <h1 className="text-4xl font-extrabold mb-6 text-slate-800 drop-shadow-lg tracking-tight text-center">
          <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-rose-400 bg-clip-text text-transparent">About VlogSite</span>
        </h1>
        <p className="text-lg text-gray-700 mb-4 text-center">
          VlogSite is a modern blogging platform designed for creators, readers, and everyone who loves to share and discover stories. Our mission is to empower voices, foster community, and make publishing accessible to all.
        </p>
        <p className="text-lg text-gray-700 mb-2 text-center">
          Whether you want to write, read, or connect, VlogSite provides a clean, elegant, and user-friendly experience. Join us and be part of a vibrant community of storytellers.
        </p>
      </div>
    </div>
  </div>
);

export default About;
