import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav style={{ backgroundColor: 'transparent' }} className="sticky top-0 z-50 w-full bg-transparent border-b border-black">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2 text-text-light dark:text-text-dark cursor-pointer" onClick={() => { setMobileOpen(false); navigate('/'); }}>
                    <div className="size-6 text-primary">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21.738 12 12 21.738 2.262 12 12 2.262 21.738 12zM7.121 10.5h9.758L12 5.621 7.121 10.5z"></path>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold">VlogSite</h2>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6">
                    <Link className="text-lg font-semibold hover:text-primary dark:hover:text-primary transition-colors" to="/">Home</Link>
                    <Link className="text-lg font-semibold text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors" to="/ourstory">Our Story</Link>
                    {location.pathname !== '/' && (
                        <Link className="text-lg font-semibold text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors" to="/posts">Articles</Link>
                    )}
                    <Link className="text-lg font-semibold text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors" to="/login">Write</Link>

                    {/* Auth Buttons */}
                    {!user ? (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                style={{ backgroundColor: 'transparent' }}
                                className="px-4 py-2 rounded-lg bg-transparent border border-primary/20 text-primary text-sm font-semibold hover:bg-white/5 dark:hover:bg-black/10 transition"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-4 py-2 rounded-lg bg-[#FFD84D] text-slate-900 text-sm font-bold hover:scale-105 transition-transform"
                            >
                                Get Started
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link className="text-lg font-semibold text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors" to="/profile">Profile</Link>
                            <button
                                onClick={handleLogout}
                                style={{ backgroundColor: 'transparent' }}
                                className="px-4 py-2 rounded-lg bg-transparent border border-red-500 text-red-500 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/10 transition"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMobileOpen((s) => !s)}
                        style={{ backgroundColor: 'transparent' }}
                        className="p-2 rounded-md bg-transparent hover:bg-white/5 dark:hover:bg-black/10"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {mobileOpen && (
                <div className="md:hidden">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-3">
                        <Link onClick={() => setMobileOpen(false)} className="text-base font-medium" to="/">Home</Link>
                        <Link onClick={() => setMobileOpen(false)} className="text-base font-medium" to="/ourstory">Our Story</Link>
                        {location.pathname !== '/' && (
                            <Link onClick={() => setMobileOpen(false)} className="text-base font-medium" to="/posts">Articles</Link>
                        )}
                        <Link onClick={() => setMobileOpen(false)} className="text-base font-medium" to="/login">Write</Link>
                        {!user ? (
                            <>
                                <Link onClick={() => setMobileOpen(false)} className="text-base font-medium" to="/login">Sign In</Link>
                                <Link onClick={() => setMobileOpen(false)} className="text-base font-medium text-[#FFD84D]" to="/signup">Get Started</Link>
                            </>
                        ) : (
                            <>
                                <Link onClick={() => setMobileOpen(false)} className="text-base font-medium" to="/profile">Profile</Link>
                                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-base font-medium text-left text-red-500">Logout</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
