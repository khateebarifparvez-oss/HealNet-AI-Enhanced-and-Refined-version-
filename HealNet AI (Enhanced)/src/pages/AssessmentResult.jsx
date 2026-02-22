import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Heart, Send, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AssessmentResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const assessmentId = urlParams.get('id');
    
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your AI Health Assistant. I've analyzed your assessment and I'm here to answer any questions about your results." }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isSending, setIsSending] = useState(false);

    const { data: assessment, isLoading } = useQuery({
        queryKey: ['assessment', assessmentId],
        queryFn: async () => {
            const assessments = await base44.entities.HealthAssessment.list();
            return assessments.find(a => a.id === assessmentId);
        },
        enabled: !!assessmentId
    });

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'low': return 'bg-green-100 text-green-800 border-green-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'high': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getRiskIcon = (risk) => {
        switch (risk) {
            case 'low': return <CheckCircle className="w-16 h-16 text-green-600" />;
            case 'medium': return <AlertTriangle className="w-16 h-16 text-yellow-600" />;
            case 'high': return <AlertTriangle className="w-16 h-16 text-red-600" />;
            default: return <Heart className="w-16 h-16 text-gray-600" />;
        }
    };

    const handleSendMessage = async () => {
        if (!userInput.trim() || isSending) return;

        const newUserMessage = { role: 'user', content: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsSending(true);

        try {
            const context = `Assessment context:
Risk Level: ${assessment.risk_level}
Age: ${assessment.age}, Gender: ${assessment.gender}
Symptoms: ${assessment.symptoms?.join(', ') || 'None'}
AI Analysis: ${assessment.ai_analysis}

User question: ${userInput}`;

            const response = await base44.integrations.Core.InvokeLLM({
                prompt: context
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-96">
                    <CardContent className="pt-6 text-center">
                        <p className="mb-4">Assessment not found</p>
                        <Link to={createPageUrl("Dashboard")}>
                            <Button>Go to Dashboard</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-2">Your Health Assessment Results</h1>
                    <p className="text-gray-600">Completed on {format(new Date(assessment.created_date), 'MMMM d, yyyy')}</p>
                </div>

                {/* Risk Level Card */}
                <Card className="mb-8 border-2">
                    <CardContent className="pt-8 text-center">
                        <div className="flex justify-center mb-4">
                            {getRiskIcon(assessment.risk_level)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-3">Overall Risk Level</h3>
                        <Badge className={`text-2xl px-8 py-2 ${getRiskColor(assessment.risk_level)}`}>
                            {assessment.risk_level?.toUpperCase()}
                        </Badge>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* AI Analysis */}
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">{assessment.ai_analysis}</p>
                        </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {assessment.recommendations?.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-700">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Chat Assistant */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ask Your AI Health Assistant</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${
                                        msg.role === 'user' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-100 text-gray-900'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isSending && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 p-3 rounded-lg">
                                        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Input 
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about your results..."
                                disabled={isSending}
                            />
                            <Button onClick={handleSendMessage} disabled={isSending}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 flex justify-center gap-4">
                    <Link to={createPageUrl("Dashboard")}>
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                    <Link to={createPageUrl("Assessment")}>
                        <Button>New Assessment</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}