import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Heart, Home, Activity, FileText, LogOut, Menu, X } from "lucide-react";

export default function Layout({ children, currentPageName }) {
    const [user, setUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        base44.auth.isAuthenticated().then(isAuth => {
            if (isAuth) {
                base44.auth.me().then(setUser).catch(() => {});
            }
        });
    }, []);

    const handleLogout = async () => {
        await base44.auth.logout();
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center h-20">
                        <Link to={createPageUrl("Home")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">
                                H
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900">HealNet</h1>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">AI Health Assistant</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-2">
                            <Link to={createPageUrl("Home")}>
                                <Button variant={currentPageName === "Home" ? "default" : "ghost"}>
                                    <Home className="w-4 h-4 mr-2" />
                                    Home
                                </Button>
                            </Link>
                            {user && (
                                <>
                                    <Link to={createPageUrl("Dashboard")}>
                                        <Button variant={currentPageName === "Dashboard" ? "default" : "ghost"}>
                                            <Activity className="w-4 h-4 mr-2" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link to={createPageUrl("Assessment")}>
                                        <Button variant={currentPageName === "Assessment" ? "default" : "ghost"}>
                                            <FileText className="w-4 h-4 mr-2" />
                                            Assessment
                                        </Button>
                                    </Link>
                                    <Link to={createPageUrl("Tracker")}>
                                        <Button variant={currentPageName === "Tracker" ? "default" : "ghost"}>
                                            <Heart className="w-4 h-4 mr-2" />
                                            Tracker
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </Button>
                                </>
                            )}
                            {!user && (
                                <Button onClick={() => base44.auth.redirectToLogin()}>
                                    Login / Sign Up
                                </Button>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <nav className="md:hidden pb-4 space-y-2">
                            <Link to={createPageUrl("Home")} onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                    <Home className="w-4 h-4 mr-2" />
                                    Home
                                </Button>
                            </Link>
                            {user && (
                                <>
                                    <Link to={createPageUrl("Dashboard")} onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Activity className="w-4 h-4 mr-2" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link to={createPageUrl("Assessment")} onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Assessment
                                        </Button>
                                    </Link>
                                    <Link to={createPageUrl("Tracker")} onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Heart className="w-4 h-4 mr-2" />
                                            Tracker
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </Button>
                                </>
                            )}
                            {!user && (
                                <Button className="w-full" onClick={() => base44.auth.redirectToLogin()}>
                                    Login / Sign Up
                                </Button>
                            )}
                        </nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}