"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Input = ({ label, type, placeholder, value, onChange, error }) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-white mb-1">{label}</label>
        <input
            type={type}
            className={`w-full px-3 sm:px-4 py-2 rounded-lg border bg-[#120521]/60 backdrop-blur-sm ${
                error ? 'border-red-500' : 'border-[#9340FF]/50'
            } focus:outline-none focus:ring-2 focus:ring-[#9340FF] focus:border-transparent text-sm sm:text-base text-white placeholder-gray-400`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
);

// components/Button.js
const Button = ({ children, variant = "primary", onClick, type = "button", disabled = false }) => {
    const baseStyles = "w-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-300 flex items-center justify-center shadow-md";
    const variants = {
        primary: "bg-[#9340FF] text-white hover:bg-[#7d35d9] disabled:opacity-70 hover:shadow-[0_0_15px_rgba(147,64,255,0.5)]",
        google: "bg-[#120521]/60 backdrop-blur-sm text-white border border-[#9340FF]/50 hover:bg-[#1a0933]/80 hover:border-[#9340FF]/70"
    };
    
    return (
        <button 
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]}`}
        >
            {children}
        </button>
    );
};

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(true);

    useEffect(() => {
        const loadGoogleScript = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleSignIn;
            document.body.appendChild(script);
        };

        loadGoogleScript();
    }, []);

    const initializeGoogleSignIn = () => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: handleGoogleSignIn,
            });
            window.google.accounts.id.renderButton(
                document.getElementById('googleSignInDiv'),
                { theme: 'outline', size: 'large', width: '100%' }
            );
            setIsGoogleLoading(false);
        }
    };

    const handleGoogleSignIn = async (response) => {
        try {
            const credential = response.credential;
            const payload = JSON.parse(atob(credential.split('.')[1]));
            
            // Ensure we get a valid picture URL
            const pictureUrl = payload.picture?.replace('=s96-c', '=s100-c');
            
            localStorage.setItem('googleCredential', JSON.stringify({
                email: payload.email,
                name: payload.name,
                picture: pictureUrl
            }));
            const result = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: credential,
                }),
            });
    
            if (result.ok) {
                router.push('/main');
            } else {
                throw new Error('Failed to sign in with Google');
            }
        } catch (error) {
            setErrors({ google: 'Failed to sign in with Google' });
            localStorage.removeItem('googleCredential'); // Clean up if auth fails
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            router.push('/main');
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: error.message || 'Login failed. Please try again.'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden py-44 sm:py-12 bg-dark-purple">
            {/* Dark purple background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="/images/login_ui.jpg"
                    alt="Background"
                    className="w-full h-full object-cover mix-blend-overlay opacity-50"
                />
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="max-w-md mx-auto backdrop-blur-xl bg-[#1a0933]/80 p-6 sm:p-8 rounded-2xl shadow-2xl border-2 border-[#9340FF] relative overflow-hidden login-container">
                    {/* Glow effect only on border */}
                    
                    <div className="relative">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-[#9340FF]">Welcome Back</h2>
                        
                        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                            <Input
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                error={errors.email}
                            />
                            
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                error={errors.password}
                            />

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>

                            <div className="relative my-4 sm:my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#9340FF]/30"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-transparent text-gray-300">Or continue with</span>
                                </div>
                            </div>

                            <div id="googleSignInDiv" className="w-full backdrop-blur-sm bg-[#120521]/60 p-2 rounded-lg"></div>
                            {errors.google && (
                                <p className="mt-1 text-sm text-red-400 text-center">{errors.google}</p>
                            )}

                            {errors.submit && (
                                <p className="text-sm text-red-400 text-center">{errors.submit}</p>
                            )}
                        </form>
                        
                        <p className="mt-6 text-center text-sm text-gray-300">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-medium text-[#9340FF] hover:text-[#a668ff] hover:underline transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Add this style for animations */}
            <style jsx global>{`
                @keyframes borderGlow {
                    0%, 100% { box-shadow: 0 0 10px rgba(147, 64, 255, 0.5); }
                    50% { box-shadow: 0 0 20px rgba(147, 64, 255, 0.8); }
                }
                .login-container {
                    animation: borderGlow 2s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}