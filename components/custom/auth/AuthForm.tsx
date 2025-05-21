'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormMode = 'login' | 'signup';

interface FormField {
    id: string;
    label: string;
    type: string;
    autoComplete: string;
    value: string;
    onChange: (value: string) => void;
}

export default function AuthForm() {
    const [mode, setMode] = useState<FormMode>('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirm: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateField = (field: keyof typeof formData) => (
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
            setError(null);
        }
    );

    const commonFields: FormField[] = [
        {
            id: 'auth-email',
            label: 'Email',
            type: 'email',
            autoComplete: 'email',
            value: formData.email,
            onChange: (value) => setFormData(prev => ({ ...prev, email: value }))
        },
        {
            id: 'auth-password',
            label: 'Password',
            type: 'password',
            autoComplete: mode === 'login' ? 'current-password' : 'new-password',
            value: formData.password,
            onChange: (value) => setFormData(prev => ({ ...prev, password: value }))
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (mode === 'signup' && formData.password !== formData.confirm) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/auth/${mode}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });            const data = await res.json();
            if (res.ok) {
                // Store the JWT token
                localStorage.setItem('authToken', data.token);
                // Set the authorization header for future requests
                window.location.href = "/search";
            } else {
                setError(data.message || `${mode === 'login' ? 'Login' : 'Signup'} failed`);
            }
        } catch (err) {
            console.log(`Error while login/signup: ${err}`);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode: FormMode) => {
        setMode(newMode);
        setFormData({ email: '', password: '', confirm: '' });
        setError(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-center space-x-4 mb-6">
                {(['login', 'signup'] as const).map((buttonMode) => (
                    <Button
                        key={buttonMode}
                        type="button"
                        variant={mode === buttonMode ? "default" : "outline"}
                        onClick={() => switchMode(buttonMode)}
                    >
                        {buttonMode === 'login' ? 'Login' : 'Sign Up'}
                    </Button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">            {commonFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                        <Label 
                            htmlFor={field.id} 
                            className="text-sm font-semibold text-gray-700 "
                        >
                            {field.label}
                        </Label>
                        <Input
                            id={field.id}
                            type={field.type}
                            autoComplete={field.autoComplete}
                            required
                            value={field.value}
                            onChange={e => field.onChange(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                ))}

                {mode === 'signup' && (
                    <div className="space-y-2">
                        <Label 
                            htmlFor="auth-confirm" 
                            className="text-sm font-semibold text-gray-700"
                        >
                            Confirm Password
                        </Label>
                        <Input
                            id="auth-confirm"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={formData.confirm}
                            onChange={updateField('confirm')}
                            className="mt-1"
                        />
                    </div>
                )}

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading
                        ? `${mode === 'login' ? 'Logging in' : 'Signing up'}...`
                        : mode === 'login' ? 'Login' : 'Sign Up'
                    }
                </Button>
            </form>
        </div>
    );
}
