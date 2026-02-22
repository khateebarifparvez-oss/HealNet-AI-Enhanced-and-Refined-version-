import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Heart, Moon, Droplet, Plus, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Tracker() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        heart_rate: '',
        blood_sugar: '',
        sleep_hours: '',
        exercise_minutes: '',
        water_intake: '',
        mood: 'good',
        notes: ''
    });

    const queryClient = useQueryClient();

    const { data: entries = [], isLoading } = useQuery({
        queryKey: ['tracker'],
        queryFn: () => base44.entities.HealthTracker.list('-date'),
    });

    const createEntry = useMutation({
        mutationFn: (data) => base44.entities.HealthTracker.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tracker'] });
            setShowForm(false);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                weight: '',
                blood_pressure_systolic: '',
                blood_pressure_diastolic: '',
                heart_rate: '',
                blood_sugar: '',
                sleep_hours: '',
                exercise_minutes: '',
                water_intake: '',
                mood: 'good',
                notes: ''
            });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {};
        Object.keys(formData).forEach(key => {
            if (formData[key] !== '' && formData[key] !== null) {
                if (['weight', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate', 'blood_sugar', 'sleep_hours', 'exercise_minutes', 'water_intake'].includes(key)) {
                    submitData[key] = parseFloat(formData[key]);
                } else {
                    submitData[key] = formData[key];
                }
            }
        });
        createEntry.mutate(submitData);
    };

    const getMoodColor = (mood) => {
        switch (mood) {
            case 'excellent': return 'bg-green-100 text-green-800';
            case 'good': return 'bg-blue-100 text-blue-800';
            case 'okay': return 'bg-yellow-100 text-yellow-800';
            case 'poor': return 'bg-orange-100 text-orange-800';
            case 'very_poor': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
                <div className="container mx-auto px-6 py-12">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-black mb-2">Health Tracker</h1>
                            <p className="text-teal-100">Log your daily health metrics</p>
                        </div>
                        <Button 
                            onClick={() => setShowForm(!showForm)}
                            className="bg-white text-teal-600 hover:bg-gray-100"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Entry
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {showForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>New Health Entry</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mood">Mood</Label>
                                        <Select value={formData.mood} onValueChange={(value) => setFormData({...formData, mood: value})}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="excellent">Excellent</SelectItem>
                                                <SelectItem value="good">Good</SelectItem>
                                                <SelectItem value="okay">Okay</SelectItem>
                                                <SelectItem value="poor">Poor</SelectItem>
                                                <SelectItem value="very_poor">Very Poor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Weight (kg)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            step="0.1"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                            placeholder="70.5"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
                                        <Input
                                            id="heart_rate"
                                            type="number"
                                            value={formData.heart_rate}
                                            onChange={(e) => setFormData({...formData, heart_rate: e.target.value})}
                                            placeholder="72"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Blood Pressure (Systolic)</Label>
                                        <Input
                                            type="number"
                                            value={formData.blood_pressure_systolic}
                                            onChange={(e) => setFormData({...formData, blood_pressure_systolic: e.target.value})}
                                            placeholder="120"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Blood Pressure (Diastolic)</Label>
                                        <Input
                                            type="number"
                                            value={formData.blood_pressure_diastolic}
                                            onChange={(e) => setFormData({...formData, blood_pressure_diastolic: e.target.value})}
                                            placeholder="80"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="blood_sugar">Blood Sugar (mg/dL)</Label>
                                        <Input
                                            id="blood_sugar"
                                            type="number"
                                            value={formData.blood_sugar}
                                            onChange={(e) => setFormData({...formData, blood_sugar: e.target.value})}
                                            placeholder="100"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sleep_hours">Sleep (hours)</Label>
                                        <Input
                                            id="sleep_hours"
                                            type="number"
                                            step="0.5"
                                            value={formData.sleep_hours}
                                            onChange={(e) => setFormData({...formData, sleep_hours: e.target.value})}
                                            placeholder="7.5"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="exercise_minutes">Exercise (minutes)</Label>
                                        <Input
                                            id="exercise_minutes"
                                            type="number"
                                            value={formData.exercise_minutes}
                                            onChange={(e) => setFormData({...formData, exercise_minutes: e.target.value})}
                                            placeholder="30"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="water_intake">Water Intake (glasses)</Label>
                                        <Input
                                            id="water_intake"
                                            type="number"
                                            value={formData.water_intake}
                                            onChange={(e) => setFormData({...formData, water_intake: e.target.value})}
                                            placeholder="8"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        placeholder="Any additional notes..."
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" disabled={createEntry.isPending}>
                                        {createEntry.isPending ? 'Saving...' : 'Save Entry'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Your Health History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-gray-500">Loading...</div>
                        ) : entries.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium mb-2">No entries yet</p>
                                <p className="mb-4">Start tracking your health today!</p>
                                <Button onClick={() => setShowForm(true)}>Add Your First Entry</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {entries.map((entry) => (
                                    <div key={entry.id} className="p-4 border-2 rounded-lg hover:border-teal-300 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-gray-400" />
                                                <span className="font-bold text-lg">{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                                            </div>
                                            {entry.mood && (
                                                <Badge className={getMoodColor(entry.mood)}>
                                                    {entry.mood.replace('_', ' ')}
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                            {entry.weight && (
                                                <div className="flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-blue-500" />
                                                    <span className="text-gray-600">Weight:</span>
                                                    <span className="font-medium">{entry.weight} kg</span>
                                                </div>
                                            )}
                                            {entry.heart_rate && (
                                                <div className="flex items-center gap-2">
                                                    <Heart className="w-4 h-4 text-red-500" />
                                                    <span className="text-gray-600">HR:</span>
                                                    <span className="font-medium">{entry.heart_rate} bpm</span>
                                                </div>
                                            )}
                                            {entry.blood_pressure_systolic && entry.blood_pressure_diastolic && (
                                                <div className="flex items-center gap-2">
                                                    <Heart className="w-4 h-4 text-purple-500" />
                                                    <span className="text-gray-600">BP:</span>
                                                    <span className="font-medium">{entry.blood_pressure_systolic}/{entry.blood_pressure_diastolic}</span>
                                                </div>
                                            )}
                                            {entry.blood_sugar && (
                                                <div className="flex items-center gap-2">
                                                    <Droplet className="w-4 h-4 text-orange-500" />
                                                    <span className="text-gray-600">Sugar:</span>
                                                    <span className="font-medium">{entry.blood_sugar} mg/dL</span>
                                                </div>
                                            )}
                                            {entry.sleep_hours && (
                                                <div className="flex items-center gap-2">
                                                    <Moon className="w-4 h-4 text-indigo-500" />
                                                    <span className="text-gray-600">Sleep:</span>
                                                    <span className="font-medium">{entry.sleep_hours}h</span>
                                                </div>
                                            )}
                                            {entry.exercise_minutes && (
                                                <div className="flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-green-500" />
                                                    <span className="text-gray-600">Exercise:</span>
                                                    <span className="font-medium">{entry.exercise_minutes}m</span>
                                                </div>
                                            )}
                                            {entry.water_intake && (
                                                <div className="flex items-center gap-2">
                                                    <Droplet className="w-4 h-4 text-cyan-500" />
                                                    <span className="text-gray-600">Water:</span>
                                                    <span className="font-medium">{entry.water_intake} glasses</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {entry.notes && (
                                            <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                                {entry.notes}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}