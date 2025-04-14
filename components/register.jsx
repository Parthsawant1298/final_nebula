"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            router.push('/login');
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: error.message || 'Registration failed. Please try again.'
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
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-[#9340FF]">Create Account</h2>
                    
                    <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            error={errors.name}
                        />
                        
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
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            error={errors.password}
                        />
                        
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            error={errors.confirmPassword}
                        />

                        {errors.submit && (
                            <p className="text-sm text-red-400 text-center">
                                {errors.submit}
                            </p>
                        )}

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>
                    
                    <p className="mt-6 text-center text-sm text-gray-300">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-[#9340FF] hover:text-[#a668ff] hover:underline transition-colors">
                            Sign in
                        </Link>
                    </p>
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