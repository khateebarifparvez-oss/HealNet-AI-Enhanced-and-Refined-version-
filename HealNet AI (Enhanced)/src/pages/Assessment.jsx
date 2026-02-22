import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

export default function Assessment() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        location: '',
        profession: '',
        symptoms: [],
        symptom_notes: '',
        smoking: 'never',
        alcohol: 'never',
        activity: 'sedentary',
        sleep: '7-8',
        night_shift: 'no',
        screen_time: '',
        diet: '',
        past_conditions: [],
        family_history: []
    });

    useEffect(() => {
        base44.auth.me().then(setUser).catch(() => {
            base44.auth.redirectToLogin();
        });
    }, []);

    const symptoms = [
        { category: "General", items: ["fatigue", "fever", "weight_loss", "weight_gain", "night_sweats"] },
        { category: "Cardiac & Respiratory", items: ["chest_pain", "shortness_breath", "palpitations", "cough", "wheezing"] },
        { category: "Digestive", items: ["abdominal_pain", "nausea", "diarrhea", "constipation", "blood_stool"] },
        { category: "Neurological", items: ["headache", "dizziness", "numbness", "vision_changes", "memory_problems"] },
        { category: "Mental Health", items: ["anxiety", "depression", "insomnia", "mood_swings", "stress"] },
        { category: "Other", items: ["skin_changes", "joint_pain", "frequent_infections", "swelling"] }
    ];

    const conditions = ["diabetes", "hypertension", "heart_disease", "thyroid", "asthma", "cancer", "kidney_disease", "liver_disease", "mental_health"];

    const createAssessment = useMutation({
        mutationFn: async (data) => {
            setIsAnalyzing(true);
            
            // AI Analysis
            const prompt = `Analyze this health assessment and provide:
1. Risk level (low/medium/high)
2. Potential health concerns
3. Specific recommendations

Patient Info:
- Age: ${data.age}, Gender: ${data.gender}
- Symptoms: ${data.symptoms.join(', ') || 'None'}
- Lifestyle: Smoking: ${data.smoking}, Alcohol: ${data.alcohol}, Activity: ${data.activity}, Sleep: ${data.sleep}
- Past conditions: ${data.past_conditions.join(', ') || 'None'}
- Family history: ${data.family_history.join(', ') || 'None'}

Provide a detailed but concise medical assessment.`;

            const aiResult = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        risk_level: { type: "string", enum: ["low", "medium", "high"] },
                        analysis: { type: "string" },
                        concerns: { type: "array", items: { type: "string" } },
                        recommendations: { type: "array", items: { type: "string" } }
                    }
                }
            });

            const assessment = await base44.entities.HealthAssessment.create({
                ...data,
                risk_level: aiResult.risk_level,
                ai_analysis: aiResult.analysis,
                recommendations: aiResult.recommendations
            });

            return { assessment, aiResult };
        },
        onSuccess: (result) => {
            setIsAnalyzing(false);
            navigate(createPageUrl("AssessmentResult") + `?id=${result.assessment.id}`);
        },
    });

    const handleSymptomToggle = (symptom) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...prev.symptoms, symptom]
        }));
    };

    const handleConditionToggle = (condition, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(condition)
                ? prev[field].filter(c => c !== condition)
                : [...prev[field], condition]
        }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleSubmit = () => {
        createAssessment.mutate(formData);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isAnalyzing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-96">
                    <CardContent className="pt-6 text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold mb-2">Analyzing Your Health Data</h3>
                        <p className="text-sm text-gray-600">Our AI is processing your information...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const steps = [
        {
            title: "Basic Information",
            content: (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Age</Label>
                        <Input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="City, State" />
                    </div>
                    <div className="space-y-2">
                        <Label>Profession</Label>
                        <Input value={formData.profession} onChange={(e) => setFormData({...formData, profession: e.target.value})} />
                    </div>
                </div>
            )
        },
        {
            title: "Symptoms & Lifestyle",
            content: (
                <div className="space-y-6">
                    <div>
                        <Label className="text-lg mb-3 block">Current Symptoms</Label>
                        <div className="grid md:grid-cols-2 gap-4">
                            {symptoms.map(group => (
                                <div key={group.category} className="space-y-2">
                                    <h4 className="font-semibold text-sm text-gray-700">{group.category}</h4>
                                    {group.items.map(item => (
                                        <label key={item} className="flex items-center gap-2 text-sm">
                                            <Checkbox 
                                                checked={formData.symptoms.includes(item)}
                                                onCheckedChange={() => handleSymptomToggle(item)}
                                            />
                                            {item.replace(/_/g, ' ')}
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Additional Symptom Details</Label>
                        <Textarea value={formData.symptom_notes} onChange={(e) => setFormData({...formData, symptom_notes: e.target.value})} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Smoking</Label>
                            <RadioGroup value={formData.smoking} onValueChange={(v) => setFormData({...formData, smoking: v})}>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="never" id="smoke-never" />
                                    <Label htmlFor="smoke-never">Never</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="former" id="smoke-former" />
                                    <Label htmlFor="smoke-former">Former</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="current" id="smoke-current" />
                                    <Label htmlFor="smoke-current">Current</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label>Alcohol</Label>
                            <RadioGroup value={formData.alcohol} onValueChange={(v) => setFormData({...formData, alcohol: v})}>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="never" id="alc-never" />
                                    <Label htmlFor="alc-never">Never</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="occasional" id="alc-occ" />
                                    <Label htmlFor="alc-occ">Occasional</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="regular" id="alc-reg" />
                                    <Label htmlFor="alc-reg">Regular</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Health History",
            content: (
                <div className="space-y-6">
                    <div>
                        <Label className="text-lg mb-3 block">Past Medical Conditions</Label>
                        <div className="grid md:grid-cols-2 gap-2">
                            {conditions.map(condition => (
                                <label key={condition} className="flex items-center gap-2 text-sm">
                                    <Checkbox 
                                        checked={formData.past_conditions.includes(condition)}
                                        onCheckedChange={() => handleConditionToggle(condition, 'past_conditions')}
                                    />
                                    {condition.replace(/_/g, ' ')}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label className="text-lg mb-3 block">Family Medical History</Label>
                        <div className="grid md:grid-cols-2 gap-2">
                            {conditions.map(condition => (
                                <label key={condition} className="flex items-center gap-2 text-sm">
                                    <Checkbox 
                                        checked={formData.family_history.includes(condition)}
                                        onCheckedChange={() => handleConditionToggle(condition, 'family_history')}
                                    />
                                    {condition.replace(/_/g, ' ')}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Review & Submit",
            content: (
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Basic Information</h4>
                        <p className="text-sm">Age: {formData.age}, Gender: {formData.gender}</p>
                        <p className="text-sm">Location: {formData.location}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Symptoms</h4>
                        <p className="text-sm">{formData.symptoms.length} symptoms selected</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Medical History</h4>
                        <p className="text-sm">Past conditions: {formData.past_conditions.length}</p>
                        <p className="text-sm">Family history: {formData.family_history.length}</p>
                    </div>
                    <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                        <strong>Disclaimer:</strong> This assessment is for informational purposes only and is not a substitute for professional medical advice.
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-2">Health Assessment</h1>
                    <p className="text-gray-600">Complete your comprehensive health evaluation</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {steps.map((step, i) => (
                            <span key={i} className={`text-sm font-medium ${i <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                                {step.title}
                            </span>
                        ))}
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-teal-600 transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{steps[currentStep].title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {steps[currentStep].content}

                        <div className="flex justify-between mt-8">
                            <Button 
                                variant="outline" 
                                onClick={prevStep} 
                                disabled={currentStep === 0}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>
                            {currentStep < steps.length - 1 ? (
                                <Button onClick={nextStep}>
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit} disabled={createAssessment.isPending}>
                                    {createAssessment.isPending ? 'Submitting...' : 'Submit Assessment'}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}