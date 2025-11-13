import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/Layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Trash2, CheckCircle } from 'lucide-react';

export default function Index({ updates, currentVersion, canManageUpdates }) {
    console.log('System Updates Index component rendering', { updates, currentVersion, canManageUpdates });
    return (
        <AppLayout>
            <Head title="System Updates" />
            <div>Debug: System Updates Index component loaded</div>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            System Updates
                        </h2>
                        {canManageUpdates && (
                            <Link href={route('system-updates.create')}>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Upload Update
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="mb-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Version</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{currentVersion}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="space-y-4">
                                {updates.map((update) => (
                                    <Card key={update.id}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold">
                                                            {update.name} (v{update.version})
                                                        </h3>
                                                        <Badge
                                                            variant={
                                                                update.status === 'applied' ? 'default' :
                                                                update.status === 'pending' ? 'secondary' :
                                                                'destructive'
                                                            }
                                                        >
                                                            {update.status_text}
                                                        </Badge>
                                                    </div>

                                                    {update.description && (
                                                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                                                            {update.description}
                                                        </p>
                                                    )}

                                                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                                        <p>File Size: {update.file_size}</p>
                                                        <p>Created: {update.created_at} by {update.creator}</p>
                                                        {update.applied_at && (
                                                            <p>Applied: {update.applied_at} by {update.applier}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 ml-4">
                                                    <Link href={route('system-updates.download', update.id)}>
                                                        <Button variant="outline" size="sm">
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </Link>

                                                    {canManageUpdates && update.can_apply && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to apply this update?')) {
                                                                    // Handle apply
                                                                }
                                                            }}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Apply
                                                        </Button>
                                                    )}

                                                    {canManageUpdates && update.can_delete && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this update?')) {
                                                                    // Handle delete
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {updates.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No system updates found.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
