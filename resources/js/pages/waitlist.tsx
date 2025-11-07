import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Sparkles, Zap, ArrowRight, Mail, Star, Search, Globe, Target, Building2, TrendingUp, Phone, BarChart3, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Waitlist() {
    const { t } = useTranslation();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('landing-page.subscribe'), {
            onSuccess: () => {
                setIsSubmitted(true);
                setIsLoading(false);
                reset();
            },
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
                <Head title="Welcome to the etwave.space Waitlist!" />

                <Card className="max-w-lg w-full text-center bg-white/95 backdrop-blur-sm shadow-2xl border-0">
                    <CardContent className="p-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            🎉 You're on the Waitlist!
                        </h1>

                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
                            <p className="text-gray-700 text-lg font-medium mb-2">
                                Thank you for joining etwave.space
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We'll notify you as soon as we launch on November 27, 2025. You'll be among the first to create your professional online presence and join Africa's growing digital business community.
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                <Mail className="w-5 h-5 text-purple-600" />
                                <span>Updates will be sent to <strong>{data.email}</strong></span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 text-sm">
                                <div className="flex items-center gap-3 bg-blue-50 text-blue-800 rounded-lg p-3">
                                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <span><strong>Early access</strong> to platform features</span>
                                </div>
                                <div className="flex items-center gap-3 bg-purple-50 text-purple-800 rounded-lg p-3">
                                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                    <span><strong>Launch notifications</strong> and updates</span>
                                </div>
                                <div className="flex items-center gap-3 bg-green-50 text-green-800 rounded-lg p-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <span><strong>$3.99/month plan</strong> access from launch</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">🚀 What to Expect</h3>
                            <div className="space-y-3 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-yellow-400 text-black text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Platform Launch - Nov 27, 2025</div>
                                        <div className="text-sm text-gray-600">Get instant access when we go live</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-yellow-400 text-black text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Create Your Presence</div>
                                        <div className="text-sm text-gray-600">Build professional pages and join the directory</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-yellow-400 text-black text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Start Growing</div>
                                        <div className="text-sm text-gray-600">Watch as customers discover and contact you</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <p className="text-gray-500 text-sm mb-4">
                                Know someone who could benefit from etwave.space?
                            </p>
                            <Button
                                onClick={() => setIsSubmitted(false)}
                                variant="outline"
                                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                            >
                                Add Another Email
                            </Button>
                        </div>

                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-400">
                                🔥 Join <strong>15,000+ African entrepreneurs</strong> waiting to go digital
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
            <Head title="Join the Digital Transformation - etwave.space Waitlist" />

            {/* Header */}
            <div className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center">
                        {/* Badge */}
                        <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Africa's Digital Business Platform
                        </Badge>

                        {/* Main Headline */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Ready to Be
                            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                                {' '}Found Online?{' '}
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                            Join thousands of African businesses discovering the power of professional online presence. Get notified when etwave.space launches on November 27, 2025 and start building your digital business for just $3.99/month.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mb-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">15K+</div>
                                <div className="text-white/70">Businesses Waiting</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">Nov 27</div>
                                <div className="text-white/70">Platform Launch</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">$3.99</div>
                                <div className="text-white/70">Starting Price</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Benefits Section */}
            <div className="relative -mt-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">

                        {/* Left Column - Why etwave.space */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-6">
                                    Why African Businesses Need Online Presence
                                </h2>

                                <div className="space-y-6">
                                    {/* The Reality */}
                                    <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-400/30">
                                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold">!</span>
                                            </div>
                                            The Current Reality
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                "Most African businesses are invisible online",
                                                "Customers struggle to find local services",
                                                "Businesses miss opportunities from online searches",
                                                "No way to track marketing performance"
                                            ].map((issue, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="text-white/90">{issue}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* The Solution */}
                                    <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
                                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            How etwave.space Solves This
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                "Professional online presence for every business",
                                                "Listed in Africa's premier business directory",
                                                "Customers can easily find and contact you",
                                                "Complete analytics and performance tracking"
                                            ].map((solution, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="text-white/90">{solution}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* What You'll Get */}
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6">
                                    What etwave.space Provides
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { icon: Building2, text: "Professional business pages that convert visitors to customers", color: "from-blue-400 to-purple-500" },
                                        { icon: Search, text: "Be discoverable on Google, AI search, and our business directory", color: "from-green-400 to-teal-500" },
                                        { icon: Phone, text: "Direct WhatsApp integration for instant customer communication", color: "from-purple-400 to-pink-500" },
                                        { icon: BarChart3, text: "Complete analytics to track performance and ROI", color: "from-orange-400 to-red-500" }
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                            <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                                                <feature.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-white/90 text-lg">{feature.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Proof */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                                                <span className="text-xs font-bold text-white">{String.fromCharCode(65 + i)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-white/90">
                                        <div className="font-semibold text-lg">15,000+ African businesses</div>
                                        <div className="text-sm">ready to join Africa's digital transformation</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-white">85%</div>
                                        <div className="text-sm text-white/70">More Visibility</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">3x</div>
                                        <div className="text-sm text-white/70">More Inquiries</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">24/7</div>
                                        <div className="text-sm text-white/70">Online Presence</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Signup Form */}
                        <div>
                            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
                                <CardContent className="p-8">
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Mail className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            Join the Waitlist
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Be among the first to know when etwave.space launches. Get early access, priority support, and join Africa's digital business revolution.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <Input
                                                type="email"
                                                placeholder="Enter your business email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full h-12 text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing || isLoading}
                                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Joining Waitlist...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <span>Join the Waitlist</span>
                                                    <ArrowRight className="w-5 h-5" />
                                                </div>
                                            )}
                                        </Button>
                                    </form>

                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-gray-500">
                                            No spam, ever. Only launch updates and platform news.
                                        </p>
                                    </div>

                                    {/* Benefits */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="grid grid-cols-1 gap-3 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-gray-600">Early platform access</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-gray-600">Priority business directory listing</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-gray-600">$3.99/month starting plan</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-gray-600">Launch celebration invite</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Success Stories Preview */}
                    <div className="text-center mb-16">
                        <h3 className="text-2xl font-bold text-white mb-8">
                            What Early Users Are Saying
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    quote: "Finally, a platform that understands African businesses need online presence that actually works.",
                                    author: "Sarah M., Retail Store Owner",
                                    location: "Nairobi, Kenya"
                                },
                                {
                                    quote: "Customers can now find me online instead of just calling randomly. My business inquiries have tripled.",
                                    author: "Ahmed K., Service Provider",
                                    location: "Lagos, Nigeria"
                                },
                                {
                                    quote: "The analytics show exactly where my customers come from. I can finally measure my marketing ROI.",
                                    author: "Grace T., Consulting Firm",
                                    location: "Cape Town, South Africa"
                                }
                            ].map((testimonial, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <div className="text-white/90 text-lg mb-4 italic">"{testimonial.quote}"</div>
                                    <div className="text-white font-semibold">{testimonial.author}</div>
                                    <div className="text-white/70 text-sm">{testimonial.location}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative mt-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="text-center">
                        <p className="text-white/70 text-lg">
                            Questions about etwave.space? {' '}
                            <a href="mailto:hello@etwave.space" className="text-white hover:text-yellow-300 underline">
                                Contact us
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
