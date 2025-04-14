"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Improved function to get profile image URL
  const getProfileImage = (url) => {
    if (!url) return null;
    
    // Handle Google profile images with specific parameter adjustments
    if (url.includes('googleusercontent.com')) {
      // Remove size limitation and ensure HTTPS
      return url.replace(/=s\d+-c/, '=s200-c').replace('http://', 'https://');
    }
    
    // For other URLs, just ensure HTTPS
    return url.replace('http://', 'https://');
  };

  useEffect(() => {
    const checkUserAuth = () => {
      const credential = localStorage.getItem('googleCredential');
      if (credential) {
        try {
          const { email, picture, name } = JSON.parse(credential);
          const profileImage = getProfileImage(picture);
          
          setUser({
            email,
            imageUrl: profileImage,
            name
          });
          setImageError(false);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    checkUserAuth();
    window.addEventListener('storage', checkUserAuth);
    return () => window.removeEventListener('storage', checkUserAuth);
  }, []);

  // Handle clicks outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    try {
      // Add console logs to debug
      console.log("Logout function triggered");
      
      // Clear the credential
      localStorage.removeItem('googleCredential');
      console.log("Credentials removed from localStorage");
      
      // Reset state
      setUser(null);
      setShowDropdown(false);
      setImageError(false);
      
      // Force navigation with window.location instead of router
      console.log("Navigating to home page");
      window.location.href = '/';
      
      // The router approach as backup
      // router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Create a User Avatar component
  const UserAvatar = ({ className }) => {
    if (!user) return null;

    return (
      <div className={className}>
        {imageError || !user.imageUrl ? (
          <div className="h-10 w-10 rounded-full bg-[#9340FF]/20 flex items-center justify-center text-white font-medium">
            {user.name?.charAt(0).toUpperCase() || '?'}
          </div>
        ) : (
          <img
            className="h-10 w-10 rounded-full ring-2 ring-[#9340FF] transition-all duration-300 hover:ring-4"
            src={user.imageUrl}
            alt={user.name}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={(e) => {
              console.log('Failed to load image:', user.imageUrl);
              setImageError(true);
            }}
          />
        )}
      </div>
    );
  };

  return (
    <nav className="bg-[#150627] shadow-xl border-b border-[#9340FF]/40 backdrop-blur-md bg-opacity-90 relative z-[999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex items-center hover:opacity-75 transition-opacity cursor-pointer">
              <span className="ml-2 text-xl font-bold text-white">NEBULA</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {user && (
              <>
                <button className="text-gray-400 hover:text-[#9340FF] relative transition-colors duration-200">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#9340FF] rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                <div 
                  ref={dropdownRef}
                  className="relative"
                  style={{ position: 'relative', zIndex: 9999 }}
                >
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center focus:outline-none"
                  >
                    <UserAvatar className="flex items-center" />
                  </button>

                  {showDropdown && (
                    <div 
                      className="fixed right-4 mt-2 w-48 bg-[#1a0933]/90 backdrop-blur-lg rounded-lg shadow-2xl border border-[#9340FF]/50 py-2 nav-dropdown"
                      style={{ zIndex: 9999, position: 'absolute' }}
                    >
                      <div className="px-4 py-2 border-b border-[#9340FF]/20">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#9340FF]/20 transition-colors duration-200 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span className="w-full text-left">Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-[#9340FF] p-2 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden" style={{ position: 'relative', zIndex: 9999 }}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-[#1a0933]/90 backdrop-blur-lg">
            {user && (
              <div className="p-3 border-t border-[#9340FF]/20">
                <div className="flex items-center space-x-3 mb-4">
                  <UserAvatar className="flex items-center" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{user.name}</span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#9340FF]/20 transition-colors duration-200 rounded-md cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="w-full text-left">Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Add this style for global z-index fixes */}
      <style jsx global>{`
        /* Force the dropdown to be on top of everything */
        .nav-dropdown {
          box-shadow: 0 0 15px rgba(147, 64, 255, 0.3);
          z-index: 9999 !important;
        }
        
        /* This targets the main content div that might be causing problems */
        #__next > *, main, div[role="main"] {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;