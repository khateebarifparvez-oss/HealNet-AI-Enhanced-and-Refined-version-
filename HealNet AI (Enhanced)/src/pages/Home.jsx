import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Activity, Brain, Heart, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                            <Heart className="w-4 h-4" />
                            AI-Powered Health Insights
                        </div>
                        
                        <h1 className="text-6xl font-black text-gray-900 mb-6 leading-tight">
                            Early Diagnosis Can<br />Save Lives
                        </h1>
                        
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            HealNet uses advanced AI to analyze your symptoms and medical history to predict potential health risks before they become serious problems.
                        </p>
                        
                        <div className="flex gap-4 justify-center">
                            <Link to={createPageUrl("Assessment")}>
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8">
                                    Start Health Assessment
                                    <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to={createPageUrl("Dashboard")}>
                                <Button size="lg" variant="outline" className="text-lg px-8">
                                    View Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-black text-center text-gray-900 mb-16">
                        How HealNet Works
                    </h2>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <Card className="border-2 hover:border-blue-300 hover:shadow-xl transition-all">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6">
                                    1
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Comprehensive Assessment</h3>
                                <p className="text-gray-600">
                                    We analyze your symptoms, medical history, lifestyle, and environmental factors.
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-2 hover:border-teal-300 hover:shadow-xl transition-all">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6">
                                    <Brain className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">AI-Powered Analysis</h3>
                                <p className="text-gray-600">
                                    Our advanced algorithms identify patterns and potential health risks.
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-2 hover:border-purple-300 hover:shadow-xl transition-all">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Personalized Insights</h3>
                                <p className="text-gray-600">
                                    Get tailored health recommendations and early warnings for potential issues.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-black text-white mb-6">
                        Ready to Take Control of Your Health?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of users who are proactively managing their health with HealNet AI.
                    </p>
                    <Link to={createPageUrl("Assessment")}>
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10">
                            Get Started Now
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-6 text-center">
                    <p className="mb-2">&copy; 2024 HealNet - Team Code Cortex. All rights reserved.</p>
                    <p className="text-sm">Assistance for your better health</p>
                </div>
            </footer>
        </div>
    );
}