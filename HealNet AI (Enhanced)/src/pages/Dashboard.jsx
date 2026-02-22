import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Heart, AlertTriangle, Calendar, TrendingUp, Plus, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        base44.auth.me().then(setUser).catch(() => {
            base44.auth.redirectToLogin();
        });
    }, []);

    const { data: assessments = [], isLoading: assessmentsLoading } = useQuery({
        queryKey: ['assessments'],
        queryFn: () => base44.entities.HealthAssessment.list('-created_date', 10),
    });

    const { data: trackerData = [], isLoading: trackerLoading } = useQuery({
        queryKey: ['tracker'],
        queryFn: () => base44.entities.HealthTracker.list('-date', 7),
    });

    const latestAssessment = assessments[0];
    const latestTracker = trackerData[0];

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'low': return 'bg-green-100 text-green-800 border-green-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'high': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
                <div className="container mx-auto px-6 py-12">
                    <h1 className="text-4xl font-black mb-2">Health Dashboard</h1>
                    <p className="text-blue-100">Welcome back, {user.full_name || user.email}</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <Link to={createPageUrl("Assessment")}>
                        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-300">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">New Assessment</h3>
                                    <p className="text-sm text-gray-600">Start a health evaluation</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link to={createPageUrl("Tracker")}>
                        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-teal-300">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Track Health</h3>
                                    <p className="text-sm text-gray-600">Log daily health metrics</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Health Overview */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Latest Risk Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {latestAssessment ? (
                                <div>
                                    <Badge className={`text-lg px-4 py-1 ${getRiskColor(latestAssessment.risk_level)}`}>
                                        {latestAssessment.risk_level?.toUpperCase() || 'N/A'}
                                    </Badge>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {format(new Date(latestAssessment.created_date), 'MMM d, yyyy')}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500">No assessments yet</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Assessments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{assessments.length}</div>
                            <p className="text-xs text-gray-500 mt-1">Health evaluations completed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Tracking Days</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{trackerData.length}</div>
                            <p className="text-xs text-gray-500 mt-1">Days of health data logged</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Recent Assessments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="w-5 h-5" />
                                Recent Assessments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {assessmentsLoading ? (
                                <div className="text-center py-8 text-gray-500">Loading...</div>
                            ) : assessments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="mb-4">No assessments yet</p>
                                    <Link to={createPageUrl("Assessment")}>
                                        <Button>Start Your First Assessment</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {assessments.slice(0, 5).map((assessment) => (
                                        <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <Badge className={getRiskColor(assessment.risk_level)}>
                                                    {assessment.risk_level}
                                                </Badge>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {format(new Date(assessment.created_date), 'MMM d, yyyy')}
                                                </p>
                                            </div>
                                            <Link to={createPageUrl("AssessmentDetails") + `?id=${assessment.id}`}>
                                                <Button variant="ghost" size="sm">View</Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Tracker Entries */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Recent Health Logs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {trackerLoading ? (
                                <div className="text-center py-8 text-gray-500">Loading...</div>
                            ) : trackerData.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="mb-4">No health data logged yet</p>
                                    <Link to={createPageUrl("Tracker")}>
                                        <Button>Start Tracking</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {trackerData.slice(0, 5).map((entry) => (
                                        <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-medium">{format(new Date(entry.date), 'MMM d, yyyy')}</p>
                                                {entry.mood && (
                                                    <Badge variant="outline">{entry.mood}</Badge>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                                {entry.weight && <p>Weight: {entry.weight} kg</p>}
                                                {entry.heart_rate && <p>HR: {entry.heart_rate} bpm</p>}
                                                {entry.sleep_hours && <p>Sleep: {entry.sleep_hours}h</p>}
                                                {entry.exercise_minutes && <p>Exercise: {entry.exercise_minutes}m</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}