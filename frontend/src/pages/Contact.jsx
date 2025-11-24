import React from 'react';

const Contact = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50 to-rose-50 flex items-center justify-center py-8 px-2">
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/90 rounded-2xl shadow-xl p-10 animate-fade-in">
        <h1 className="text-4xl font-extrabold mb-6 text-slate-800 drop-shadow-lg tracking-tight text-center">
          <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-rose-400 bg-clip-text text-transparent">Contact Us</span>
        </h1>
        <p className="text-lg text-gray-700 mb-4 text-center">
          Have questions, feedback, or want to get in touch? We'd love to hear from you!
        </p>
        <ul className="text-gray-700 mb-4 list-disc list-inside text-center">
          <li>Email: <a href="mailto:support@vlogsite.com" className="text-emerald-500 hover:underline">support@vlogsite.com</a></li>
          <li>Twitter: <a href="https://twitter.com/" className="text-emerald-500 hover:underline" target="_blank" rel="noopener noreferrer">@vlogsite</a></li>
        </ul>
        <p className="text-gray-700 text-center">We aim to respond within 1–2 business days.</p>
      </div>
    </div>
  </div>
);

export default Contact;
