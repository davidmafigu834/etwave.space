import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle,
    Users,
    Sparkles,
    Zap,
    ArrowRight,
    Mail,
    Star,
    Globe,
    Link as LinkIcon,
    MessageCircle,
    BarChart3,
    Search,
    Building2,
    Rocket,
    Target,
    Phone,
    Eye,
    Shield,
    Clock,
    Menu,
    X,
    Monitor,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    MapPin,
    ShoppingCart,
    TrendingUp,
    User,
    Heart
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLogo from '@/components/app-logo';

export default function EtwaveLandingPage() {
    const { t } = useTranslation();
    const { auth } = usePage().props as { auth: { user?: any } };
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                <Head title="You're In! Early Access to Africa's Digital Future" />

                <Card className="max-w-lg w-full text-center bg-white/95 backdrop-blur-sm shadow-2xl border-0">
                    <CardContent className="p-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Rocket className="w-12 h-12 text-white" />
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            🎉 You're In! Welcome to the Future
                        </h1>

                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
                            <p className="text-gray-700 text-lg font-medium mb-2">
                                Congratulations! You're now part of Africa's digital revolution.
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                As one of our founding members, you'll be among the first to experience how etwave.space transforms invisible businesses into discoverable success stories.
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                <Mail className="w-5 h-5 text-purple-600" />
                                <span>Exclusive updates coming to <strong>{data.email}</strong></span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 text-sm">
                                <div className="flex items-center gap-3 bg-green-50 text-green-800 rounded-lg p-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <span><strong>Lifetime FREE access</strong> to basic plan</span>
                                </div>
                                <div className="flex items-center gap-3 bg-blue-50 text-blue-800 rounded-lg p-3">
                                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <span><strong>Early access</strong> to new features before everyone else</span>
                                </div>
                                <div className="flex items-center gap-3 bg-purple-50 text-purple-800 rounded-lg p-3">
                                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                    <span><strong>Priority support</strong> from our founding team</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">🚀 What Happens Next?</h3>
                            <div className="space-y-3 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-yellow-400 text-black text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Platform Launch (Coming Soon)</div>
                                        <div className="text-sm text-gray-600">Get notified when your digital space goes live</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-yellow-400 text-black text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Business Directory Priority</div>
                                        <div className="text-sm text-gray-600">Your business featured prominently in Africa's premier directory</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-yellow-400 text-black text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Success Stories Begin</div>
                                        <div className="text-sm text-gray-600">Watch as businesses like yours become discoverable and profitable</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <p className="text-gray-500 text-sm mb-4">
                                Ready to bring another business into Africa's digital future?
                            </p>
                            <Button
                                onClick={() => setIsSubmitted(false)}
                                variant="outline"
                                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                            >
                                Add Another Business
                            </Button>
                        </div>

                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-400">
                                🔥 <strong>Only {Math.floor(Math.random() * 500) + 100} spots left</strong> for founding members
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
            <Head title="etwave.space - Your Digital Presence Platform">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="theme-color" content="#7c3aed" />
                <meta name="description" content="Create professional digital business cards and landing pages. Get listed in Africa's premier business directory." />
                <meta name="keywords" content="digital business cards, landing pages, business directory, Africa, etwave" />
                <link rel="canonical" href="https://yourdomain.com" />
            </Head>

            {/* Navigation Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className={`transition-colors ${isScrolled ? 'text-black hover:text-purple-600' : 'text-white hover:text-yellow-300'}`}>
                                <AppLogo
                                    iconClassName={isScrolled ? 'size-6 fill-current text-black' : 'size-6 fill-current text-white'}
                                    textClassName={`text-lg font-bold ${isScrolled ? 'text-black' : 'text-white'}`}
                                    containerClassName={isScrolled ? 'bg-gray-100 text-black' : 'bg-white/20 text-white'}
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
                            <a
                                href="#features"
                                className={`${isScrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'} text-sm font-medium transition-colors relative group`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Features
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isScrolled ? 'bg-purple-600' : 'bg-white'} transition-all group-hover:w-full`}></span>
                            </a>
                            <a
                                href={route('directory.index')}
                                className={`${isScrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'} text-sm font-medium transition-colors relative group`}
                            >
                                Business Directory
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isScrolled ? 'bg-purple-600' : 'bg-white'} transition-all group-hover:w-full`}></span>
                            </a>
                            <a
                                href="#screenshots"
                                className={`${isScrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'} text-sm font-medium transition-colors relative group`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('screenshots')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Screenshots
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isScrolled ? 'bg-purple-600' : 'bg-white'} transition-all group-hover:w-full`}></span>
                            </a>
                        </nav>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            {(auth as any)?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className={`${isScrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'} text-sm font-medium transition-colors`}
                                    >
                                        Login
                                    </Link>
                                    <Button
                                        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                        onClick={() => document.getElementById('email-input')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        Get Started Free
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`p-2 ${isScrolled ? 'text-gray-700 hover:text-purple-600 hover:bg-gray-100' : 'text-white/90 hover:text-white hover:bg-white/10'} rounded-lg transition-colors`}
                                aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                                aria-expanded={isMenuOpen}
                                aria-controls="mobile-menu"
                            >
                                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50" id="mobile-menu">
                            <div className="px-4 py-6 space-y-4">
                                <a
                                    href="#features"
                                    className="block text-gray-600 hover:text-purple-600 text-base font-medium transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    Features
                                </a>
                                <Link
                                    href={route('directory.index')}
                                    className="block text-gray-600 hover:text-purple-600 text-base font-medium transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Business Directory
                                </Link>
                                <a
                                    href="#screenshots"
                                    className="block text-gray-600 hover:text-purple-600 text-base font-medium transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        document.getElementById('screenshots')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    Screenshots
                                </a>
                                <div className="pt-4 space-y-3 border-t border-gray-200">
                                    {(auth as any)?.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-lg"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="block w-full text-center text-gray-600 py-2.5 text-sm font-medium transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Login
                                            </Link>
                                            <Button
                                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-lg"
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    document.getElementById('email-input')?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                Get Started Free
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

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
                            Africa's Premier Digital Presence Platform
                        </Badge>

                        {/* Main Headline */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Every Business
                            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                                {' '}Deserves{' '}
                            </span>
                            to be Found Online
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                            etwave.space is a modern digital platform that helps businesses, entrepreneurs, and professionals create their own digital space — a place to be discovered, trusted, and grow.
                        </p>

                        {/* Value Proposition */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-5xl mx-auto border border-white/20">
                            <p className="text-lg text-white/90 leading-relaxed">
                                We make it easy to build beautiful landing pages, connect them to your ads and WhatsApp campaigns, list your business in our directory network, and track real performance results — all in one platform.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mb-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">10K+</div>
                                <div className="text-white/70">Businesses Listed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">50K+</div>
                                <div className="text-white/70">Pages Created</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">FREE</div>
                                <div className="text-white/70">Basic Plan</div>
                            </div>
                        </div>

                        {/* Hero Content with Signup */}
                        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
                            {/* Left Column - Social Proof */}
                            <div className="space-y-8">
                                {/* Social Proof Widget */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">{String.fromCharCode(65 + i)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-white/90">
                                            <div className="font-semibold text-lg">1,247 businesses</div>
                                            <div className="text-sm">joined this week</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-white">95%</div>
                                            <div className="text-sm text-white/70">Lead Increase</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-white">4.8/5</div>
                                            <div className="text-sm text-white/70">User Rating</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-white">24/7</div>
                                            <div className="text-sm text-white/70">Support</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Trust Indicators */}
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h3 className="text-xl font-semibold text-white mb-4 text-center">Why Businesses Choose etwave.space</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                            <span className="text-white/90 text-sm">Professional pages that convert visitors to customers</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                            <span className="text-white/90 text-sm">Complete analytics and performance tracking</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                            <span className="text-white/90 text-sm">Business directory that customers actually use</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                            <span className="text-white/90 text-sm">Measurable results from every marketing dollar</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Signup Form */}
                            <div className="space-y-6">
                                {!(auth as any)?.user ? (
                                    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
                                        <CardContent className="p-8">
                                            <div className="text-center mb-6">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                    Start Your Digital Presence Today
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    Join thousands of African businesses building their online presence
                                                </p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div>
                                                    <Input
                                                        id="email-input"
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
                                                            <span>Creating Your Account...</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <span>Get Started Free</span>
                                                            <ArrowRight className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </Button>
                                            </form>

                                            <div className="mt-4 text-center">
                                                <p className="text-xs text-gray-500">
                                                    No credit card required • Start building your digital presence today
                                                </p>
                                            </div>

                                            {/* Trust Indicators */}
                                            <div className="mt-6 pt-4 border-t border-gray-200">
                                                <div className="flex justify-center space-x-4 text-xs text-gray-500">
                                                    <div className="flex items-center space-x-1">
                                                        <Shield className="w-3 h-3 text-green-500" />
                                                        <span>Secure</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-3 h-3 text-green-500" />
                                                        <span>Quick Setup</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                                        <span>Growth Focused</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    /* Welcome Back Card for Authenticated Users */
                                    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
                                        <CardContent className="p-8">
                                            <div className="text-center mb-6">
                                                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <CheckCircle className="w-8 h-8 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                    Welcome Back!
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    You're already part of the etwave.space community
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <Link
                                                    href={route('dashboard')}
                                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-block text-center"
                                                >
                                                    Go to Dashboard
                                                </Link>
                                                <Link
                                                    href={route('directory.index')}
                                                    className="w-full bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-block text-center"
                                                >
                                                    Explore Business Directory
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Mission Section */}
            <div className="relative py-20 bg-white/5">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <Target className="w-4 h-4" />
                            Our Mission
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Empowering Africa's Digital Future
                        </h2>
                        <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                            To empower every person and every business with a digital space that allows them to be found, contacted, and grow online. We aim to solve one of Africa's biggest digital challenges — visibility.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                <Search className="w-12 h-12 text-white mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-4">Be Discovered Everywhere</h3>
                                <p className="text-white/90 leading-relaxed">
                                    When someone searches on Google, AI search, or social media, your business should appear — professional, ready, and discoverable. No more relying on luck or random WhatsApp messages.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                <Globe className="w-12 h-12 text-white mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-4">Africa's Digital Challenge</h3>
                                <p className="text-white/90 leading-relaxed">
                                    We're solving Africa's biggest digital challenge — visibility. Every business deserves to be found online, and we're making that happen, one business at a time.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                            <h3 className="text-2xl font-bold text-white mb-6 text-center">Why Visibility Matters</h3>
                            <div className="space-y-4">
                                {[
                                    "Customers search for services online first",
                                    "Professional presence builds trust instantly",
                                    "Digital visibility drives real business growth",
                                    "Every business deserves to be discoverable"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex-shrink-0"></div>
                                        <span className="text-white/90">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Mission Section */}
            <div className="relative py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Everything You Need to Succeed Online
                        </h2>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            From professional pages to business directory listings, we provide the complete toolkit for digital success.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Rocket,
                                title: "Quick Page Creation",
                                description: "Build professional landing pages in minutes with our intuitive editor. No coding required."
                            },
                            {
                                icon: Phone,
                                title: "WhatsApp Integration",
                                description: "Receive leads directly via WhatsApp. Turn visitors into customers instantly."
                            },
                            {
                                icon: Eye,
                                title: "Increased Visibility",
                                description: "Be discoverable on Google, AI search engines, and within our growing business network."
                            },
                            {
                                icon: BarChart3,
                                title: "Analytics & Insights",
                                description: "Track visitor engagement, understand your audience, and optimize for better results."
                            },
                            {
                                icon: Building2,
                                title: "Business Directory",
                                description: "Get listed in our comprehensive directory where customers discover and connect with businesses."
                            },
                            {
                                icon: Target,
                                title: "Ad Campaign Ready",
                                description: "Professional pages designed to convert ad traffic into real business results."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-white/90">{feature.description}</p>
                                {feature.title === "Business Directory" && (
                                    <Link
                                        href={route('directory.index')}
                                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
                                    >
                                        Explore Directory
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Who It's For Section */}
            <div className="relative py-20 bg-white/5">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <Users className="w-4 h-4" />
                            Who It's For
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Perfect For Every Business Type
                        </h2>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            From solo entrepreneurs to large corporations, etwave.space provides the digital tools every business needs to succeed online.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Businesses & Startups",
                                description: "Build an online presence that converts traffic into sales. Showcase your products, services, and grow your customer base.",
                                icon: Building2,
                                color: "from-blue-500 to-purple-600"
                            },
                            {
                                title: "Sales Teams & Agents",
                                description: "Share your digital pitch link to showcase your company, services, and projects professionally to prospects.",
                                icon: Users,
                                color: "from-green-500 to-teal-600"
                            },
                            {
                                title: "Marketers & Advertisers",
                                description: "Track WhatsApp and ad performance with detailed insights. Know exactly what drives results and ROI.",
                                icon: Target,
                                color: "from-orange-500 to-red-600"
                            },
                            {
                                title: "Entrepreneurs & Professionals",
                                description: "Be discoverable on Google, AI search, and the etwave business directory. Grow your personal brand online.",
                                icon: User,
                                color: "from-purple-500 to-pink-600"
                            }
                        ].map((audience, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center hover:bg-white/15 transition-all duration-300 group">
                                <div className={`w-16 h-16 bg-gradient-to-br ${audience.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <audience.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{audience.title}</h3>
                                <p className="text-white/90 text-sm leading-relaxed">{audience.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why etwave.space? Section */}
            <div className="relative py-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <CheckCircle className="w-4 h-4" />
                            Why etwave.space?
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-6">
                            More Than Just a Platform
                        </h2>
                        <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                            We're building Africa's digital ecosystem — where businesses can truly be discovered, trusted, and measured.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: "Run Ads with Confidence",
                                description: "Your page is ready to sell. Connect to Google, Facebook, or LinkedIn ads knowing every click converts.",
                                color: "from-green-500 to-emerald-600"
                            },
                            {
                                icon: Globe,
                                title: "Be Discoverable Anywhere",
                                description: "Appear on Google, AI search, and the etwave directory. No more invisible businesses.",
                                color: "from-blue-500 to-cyan-600"
                            },
                            {
                                icon: MessageCircle,
                                title: "Instant Lead Generation",
                                description: "Get leads via WhatsApp or email instantly. Turn website visitors into paying customers.",
                                color: "from-purple-500 to-indigo-600"
                            },
                            {
                                icon: BarChart3,
                                title: "Measure Everything",
                                description: "Track performance from ads, WhatsApp campaigns, and organic traffic. Know what drives results.",
                                color: "from-orange-500 to-red-600"
                            },
                            {
                                icon: Users,
                                title: "Perfect for Sales Presentations",
                                description: "Showcase services, projects, and achievements professionally. Impress prospects instantly.",
                                color: "from-pink-500 to-rose-600"
                            },
                            {
                                icon: ShoppingCart,
                                title: "Sell Directly Online",
                                description: "Turn your digital space into a sales machine with contact options and order forms.",
                                color: "from-teal-500 to-green-600"
                            }
                        ].map((benefit, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                                <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <benefit.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                                <p className="text-white/90 text-sm leading-relaxed">{benefit.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Key Benefits Summary */}
                    <div className="mt-16 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-4">Save Time & Money</h3>
                            <p className="text-white/90">No developers, no marketers, no expensive agencies needed.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div className="bg-white/5 rounded-2xl p-6">
                                <Clock className="w-8 h-8 text-white mx-auto mb-3" />
                                <h4 className="text-lg font-semibold text-white mb-2">Quick Setup</h4>
                                <p className="text-white/80 text-sm">Create professional pages in minutes</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6">
                                <Target className="w-8 h-8 text-white mx-auto mb-3" />
                                <h4 className="text-lg font-semibold text-white mb-2">Targeted Traffic</h4>
                                <p className="text-white/80 text-sm">Drive qualified leads from ads</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6">
                                <TrendingUp className="w-8 h-8 text-white mx-auto mb-3" />
                                <h4 className="text-lg font-semibold text-white mb-2">Measure Results</h4>
                                <p className="text-white/80 text-sm">Track ROI and optimize performance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Vision Section */}
            <div className="relative py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <Eye className="w-4 h-4" />
                            Our Vision
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Africa's Digital Future Starts Here
                        </h2>
                        <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
                            To make every business and professional in Africa discoverable online. We're building a future where businesses no longer rely on luck or random WhatsApp messages to grow — but on data, insights, and professional digital spaces that drive real results.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                            <h3 className="text-2xl font-bold text-white mb-6">The Problem We're Solving</h3>
                            <div className="space-y-4">
                                {[
                                    "Businesses invisible online despite having great products",
                                    "No way to track if marketing efforts actually work",
                                    "Customers can't find local businesses when searching",
                                    "Professional services hidden behind random WhatsApp numbers"
                                ].map((problem, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-white/90">{problem}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-3xl p-8 border border-green-400/30">
                            <h3 className="text-2xl font-bold text-white mb-6">Our Solution</h3>
                            <div className="space-y-4">
                                {[
                                    "Professional digital presence for every business",
                                    "Complete analytics and performance tracking",
                                    "Business directory that customers actually use",
                                    "Measurable results from every marketing dollar"
                                ].map((solution, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-white/90">{solution}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-green-500/20 rounded-2xl border border-green-400/30">
                                <p className="text-green-200 text-sm font-medium">
                                    "With etwave.space, we are helping Africa's digital economy evolve — one business at a time."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA Section */}
            <div className="relative py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <Rocket className="w-4 h-4" />
                            Start Your Digital Journey
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Your Digital Space Awaits
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Join the movement transforming Africa's digital landscape. Create your professional online presence today and be part of the businesses that customers actually find.
                        </p>

                        <div className="bg-white/5 rounded-2xl p-6 mb-8">
                            <p className="text-white/90 text-lg font-medium mb-4">
                                "etwave.space is not just a platform — it's your digital ecosystem. A place where your business can be seen, be trusted, and be measured."
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-white/70">
                                <Heart className="w-4 h-4 text-red-400" />
                                <span>Focus on growing your business — etwave.space makes sure the world can find it.</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                onClick={() => document.getElementById('email-input')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <span>Start Building Free</span>
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <div className="text-white/70 text-center">
                                <div className="font-semibold">No credit card required</div>
                                <div className="text-sm">Join thousands of successful businesses</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Screenshots Section */}
            <div className="relative py-20 bg-white" id="screenshots">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            See etwave.space in Action
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                            Explore our intuitive interface designed to streamline your digital networking experience and help you build a professional online presence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="aspect-video overflow-hidden bg-gray-100">
                                <img
                                    src="http://localhost/main-file/screenshots/hero.png"
                                    alt="Dashboard Overview"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => {
                                        console.error('Failed to load hero.png:', e);
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                                    <Monitor className="w-12 h-12" />
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Dashboard Overview
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Comprehensive dashboard with all your digital cards, analytics, and performance metrics at a glance.
                                </p>
                            </div>
                        </div>

                        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="aspect-video overflow-hidden bg-gray-100">
                                <img
                                    src="http://localhost/main-file/screenshots/vcard-builder.png"
                                    alt="VCard Builder Interface"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => {
                                        console.error('Failed to load vcard-builder.png:', e);
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                                    <Monitor className="w-12 h-12" />
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    VCard Builder
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Intuitive drag-and-drop builder for creating professional digital business cards with custom sections.
                                </p>
                            </div>
                        </div>

                        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="aspect-video overflow-hidden bg-gray-100">
                                <img
                                    src="http://localhost/main-file/screenshots/analytics.png"
                                    alt="Analytics Dashboard"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => {
                                        console.error('Failed to load analytics.png:', e);
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                                    <Monitor className="w-12 h-12" />
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Analytics & Insights
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Track visitor engagement, understand your audience, and optimize your digital presence for better results.
                                </p>
                            </div>
                        </div>

                        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="aspect-video overflow-hidden bg-gray-100">
                                <img
                                    src="http://localhost/main-file/screenshots/business-directory.png"
                                    alt="Business Directory"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => {
                                        console.error('Failed to load business-directory.png:', e);
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                                    <Monitor className="w-12 h-12" />
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Business Directory
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Get listed in our comprehensive business directory where customers discover and connect with businesses.
                                </p>
                            </div>
                        </div>

                        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="aspect-video overflow-hidden bg-gray-100">
                                <img
                                    src="http://localhost/main-file/screenshots/business-list.png"
                                    alt="Business Listings"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => {
                                        console.error('Failed to load business-list.png:', e);
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                                    <Monitor className="w-12 h-12" />
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Business Listings
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Browse and discover businesses in our curated directory with detailed profiles and contact information.
                                </p>
                            </div>
                        </div>

                        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="aspect-video overflow-hidden bg-gray-100">
                                <img
                                    src="http://localhost/main-file/screenshots/calendar.png"
                                    alt="Appointment Calendar"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => {
                                        console.error('Failed to load calendar.png:', e);
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                                    <Monitor className="w-12 h-12" />
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Appointment Calendar
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Manage appointments and bookings with our integrated calendar system for seamless customer scheduling.
                                </p>
                            </div>
                        </div>

                        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="aspect-video overflow-hidden bg-gray-100">
                                <img
                                    src="http://localhost/main-file/screenshots/nfccards.png"
                                    alt="NFC Business Cards"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => {
                                        console.error('Failed to load nfccards.png:', e);
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                                    <Monitor className="w-12 h-12" />
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    NFC Business Cards
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Digital business cards with NFC technology for instant contact sharing and professional networking.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium border-2 border-purple-200 text-purple-600 bg-purple-50">
                            ✨ And many more features to discover
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Main Footer Content */}
                    <div className="py-12 sm:py-16">
                        <div className="grid lg:grid-cols-6 gap-8 sm:gap-12">
                            {/* Company Info */}
                            <div className="lg:col-span-2">
                                <Link href="/" className="text-2xl font-bold text-white mb-6 block hover:text-gray-300 transition-colors">
                                    etwave.space
                                </Link>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Transforming Africa's digital landscape by making every business discoverable online. Professional landing pages, business directory, and complete digital presence solutions.
                                </p>

                                {/* Contact Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-400 text-sm">hello@etwave.space</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-400 text-sm">Africa & Global</span>
                                    </div>
                                </div>
                            </div>

                            {/* Product Links */}
                            <div>
                                <h3 className="text-white font-semibold mb-4">Product</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                            Features
                                        </a>
                                    </li>
                                    <li>
                                        <Link href={route('directory.index')} className="text-gray-400 hover:text-white transition-colors text-sm">
                                            Business Directory
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="#screenshots" className="text-gray-400 hover:text-white transition-colors text-sm" onClick={(e) => { e.preventDefault(); document.getElementById('screenshots')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                            Screenshots
                                        </a>
                                    </li>
                                    <li>
                                        <Link href={route('plans.index')} className="text-gray-400 hover:text-white transition-colors text-sm">
                                            Pricing
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Company Links */}
                            <div>
                                <h3 className="text-white font-semibold mb-4">Company</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href={route('dashboard')} className="text-gray-400 hover:text-white transition-colors text-sm">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route('login')} className="text-gray-400 hover:text-white transition-colors text-sm">
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route('register')} className="text-gray-400 hover:text-white transition-colors text-sm">
                                            Sign Up
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="mailto:hello@etwave.space" className="text-gray-400 hover:text-white transition-colors text-sm">
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Support Links */}
                            <div>
                                <h3 className="text-white font-semibold mb-4">Support</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="mailto:support@etwave.space" className="text-gray-400 hover:text-white transition-colors text-sm">
                                            Help Center
                                        </a>
                                    </li>
                                    <li>
                                        <a href="mailto:support@etwave.space" className="text-gray-400 hover:text-white transition-colors text-sm">
                                            Documentation
                                        </a>
                                    </li>
                                    <li>
                                        <a href="mailto:support@etwave.space" className="text-gray-400 hover:text-white transition-colors text-sm">
                                            API Support
                                        </a>
                                    </li>
                                    <li>
                                        <a href="mailto:support@etwave.space" className="text-gray-400 hover:text-white transition-colors text-sm">
                                            Status
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Legal Links */}
                            <div>
                                <h3 className="text-white font-semibold mb-4">Legal</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                            Terms of Service
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                            Cookie Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                            GDPR
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="border-t border-gray-800 py-8 sm:py-12">
                        <div className="text-center max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-white mb-4">
                                Stay Updated with Our Latest Features
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Join our newsletter for product updates and networking tips
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button className="text-white px-6 py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="border-t border-gray-800 py-4 sm:py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
                            {/* Copyright */}
                            <div className="text-gray-400 text-sm">
                                © {new Date().getFullYear()} etwave.space. Building Africa's digital future, making every business discoverable online.
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 text-sm">Follow us:</span>
                                <div className="flex gap-3">
                                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="Facebook">
                                        <Facebook className="w-4 h-4 text-gray-400" />
                                    </a>
                                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="Twitter">
                                        <Twitter className="w-4 h-4 text-gray-400" />
                                    </a>
                                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="LinkedIn">
                                        <Linkedin className="w-4 h-4 text-gray-400" />
                                    </a>
                                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="Instagram">
                                        <Instagram className="w-4 h-4 text-gray-400" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
