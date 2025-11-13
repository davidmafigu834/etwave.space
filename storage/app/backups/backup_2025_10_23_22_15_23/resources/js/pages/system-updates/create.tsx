import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/Layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

export default function Create({ currentVersion }) {
    const { data, setData, post, processing, errors } = useForm({
        version: '',
        name: '',
        description: '',
        changelog: '',
        update_file: null
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('system-updates.store'));
    };

    return (
        <AppLayout>
            <Head title="Upload Update" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href={route('system-updates.index')}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Upload System Update
                        </h2>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Upload New Update</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Current version: {currentVersion}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <Label htmlFor="version">Version *</Label>
                                    <Input
                                        id="version"
                                        type="text"
                                        value={data.version}
                                        onChange={(e) => setData('version', e.target.value)}
                                        placeholder="e.g., 1.0.1"
                                        required
                                    />
                                    {errors.version && (
                                        <p className="text-red-500 text-sm mt-1">{errors.version}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Update name"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Brief description of the update"
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="changelog">Changelog</Label>
                                    <Textarea
                                        id="changelog"
                                        value={data.changelog}
                                        onChange={(e) => setData('changelog', e.target.value)}
                                        placeholder="Detailed changelog"
                                        rows={5}
                                    />
                                    {errors.changelog && (
                                        <p className="text-red-500 text-sm mt-1">{errors.changelog}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="update_file">Update File (ZIP) *</Label>
                                    <Input
                                        id="update_file"
                                        type="file"
                                        accept=".zip"
                                        onChange={(e) => setData('update_file', e.target.files[0])}
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Upload a ZIP file containing the update files (max 100MB)
                                    </p>
                                    {errors.update_file && (
                                        <p className="text-red-500 text-sm mt-1">{errors.update_file}</p>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Uploading...' : 'Upload Update'}
                                    </Button>
                                    <Link href={route('system-updates.index')}>
                                        <Button variant="outline" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
