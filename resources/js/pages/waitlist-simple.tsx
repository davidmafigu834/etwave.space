import React from 'react';
import { Head } from '@inertiajs/react';

export default function Waitlist() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#9333ea', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Head title="Join Our Waitlist" />
            <div style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Waitlist Page Works!
                </h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                    Something amazing is coming soon. Join the waitlist!
                </p>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', color: '#333' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Join the Waitlist</h3>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
                    />
                    <button
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                    >
                        Get Early Access
                    </button>
                </div>
            </div>
        </div>
    );
}
