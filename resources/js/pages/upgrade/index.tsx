import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, RefreshCw, CheckCircle, XCircle, AlertTriangle, FileText, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UpgradeProps {
    uploadedFile?: string;
    healthStatus?: {
        database: boolean;
        storage: boolean;
        cache: boolean;
        permissions: boolean;
    };
    availableBackups?: Array<{
        id: string;
        path: string;
        created_at: number;
        size: number;
    }>;
}

export default function UpgradeIndex({ uploadedFile, healthStatus, availableBackups }: UpgradeProps) {
    const { t } = useTranslation();
    const [isUploading, setIsUploading] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [isRollingBack, setIsRollingBack] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'applying' | 'completed' | 'failed'>('idle');
    const [currentStep, setCurrentStep] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRollback = (backupId: string) => {
        if (!confirm('Are you sure you want to rollback to this backup? This action cannot be undone.')) {
            return;
        }

        setIsRollingBack(true);
        setStatus('applying');
        setCurrentStep('Rolling back to previous version...');
        setProgress(0);

        post(route('upgrade.rollback'), {
            data: { backup_id: backupId },
            onSuccess: () => {
                setIsRollingBack(false);
                setStatus('completed');
                setProgress(100);
                setCurrentStep('Rollback completed successfully!');
                // Reload page to reflect changes
                setTimeout(() => router.reload(), 2000);
            },
            onError: () => {
                setIsRollingBack(false);
                setStatus('failed');
                setProgress(0);
                setCurrentStep('Rollback failed');
            }
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        upgrade_file: null as File | null,
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setData('upgrade_file', file);
            setStatus('idle');
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.upgrade_file) {
            return;
        }

        setIsUploading(true);
        setStatus('uploading');
        setProgress(0);

        post(route('upgrade.upload'), {
            onSuccess: () => {
                setIsUploading(false);
                setStatus('uploaded');
                setProgress(100);
            },
            onError: () => {
                setIsUploading(false);
                setStatus('failed');
                setProgress(0);
            },
            onProgress: (progress) => {
                setProgress(progress);
            }
        });
    };

    const handleApply = () => {
        if (!uploadedFile) return;

        setIsApplying(true);
        setStatus('applying');
        setProgress(0);
        setCurrentStep('Creating backup...');

        // Simulate progress for different steps
        const steps = [
            { step: 'Creating backup...', duration: 2000 },
            { step: 'Extracting files...', duration: 3000 },
            { step: 'Applying changes...', duration: 4000 },
            { step: 'Running migrations...', duration: 2000 },
            { step: 'Clearing caches...', duration: 1000 },
            { step: 'Finalizing upgrade...', duration: 1000 },
        ];

        let currentProgress = 0;
        steps.forEach((stepInfo, index) => {
            setTimeout(() => {
                setCurrentStep(stepInfo.step);
                currentProgress += (100 / steps.length);
                setProgress(Math.min(currentProgress, 95));
            }, steps.slice(0, index + 1).reduce((acc, s) => acc + s.duration, 0));
        });

        post(route('upgrade.apply'), {
            data: { file_path: uploadedFile },
            onSuccess: () => {
                setIsApplying(false);
                setStatus('completed');
                setProgress(100);
                setCurrentStep('Upgrade completed successfully!');
            },
            onError: () => {
                setIsApplying(false);
                setStatus('failed');
                setProgress(0);
                setCurrentStep('Upgrade failed');
            }
        });
    };

    const handleReset = () => {
        setStatus('idle');
        setProgress(0);
        setCurrentStep('');
        setData('upgrade_file', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        router.reload();
    };

    const getStatusBadge = () => {
        switch (status) {
            case 'uploading':
            case 'applying':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
            case 'uploaded':
                return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Ready to Apply</Badge>;
            case 'completed':
                return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
            case 'failed':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
            default:
                return <Badge variant="outline">Idle</Badge>;
        }
    };

    return (
        <>
            <Head title="System Upgrade" />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">System Upgrade</h1>
                        <p className="text-gray-600 mt-2">
                            Upload and apply system upgrades to keep your application updated with the latest features and security patches.
                        </p>
                    </div>

                    {/* Status Overview */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Upgrade Status
                                    </CardTitle>
                                    <CardDescription>Current upgrade status and progress</CardDescription>
                                </div>
                                {getStatusBadge()}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {status !== 'idle' && (
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>{currentStep || 'Processing...'}</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <Progress value={progress} className="w-full" />
                                    </div>
                                </div>
                            )}

                            {uploadedFile && status === 'uploaded' && (
                                <Alert className="mt-4">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Upgrade file uploaded successfully. Click "Apply Upgrade" to proceed.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {status === 'completed' && (
                                <Alert className="mt-4">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Upgrade completed successfully! Your system has been updated.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {status === 'failed' && (
                                <Alert variant="destructive" className="mt-4">
                                    <XCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Upgrade failed. Please check the logs and try again.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* System Health Check */}
                    {healthStatus && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    System Health Status
                                </CardTitle>
                                <CardDescription>Check if your system is ready for upgrade</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-2">
                                        {healthStatus.database ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className="text-sm">Database</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {healthStatus.storage ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className="text-sm">Storage</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {healthStatus.cache ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className="text-sm">Cache</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {healthStatus.permissions ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className="text-sm">Permissions</span>
                                    </div>
                                </div>

                                {(!healthStatus.database || !healthStatus.storage) && (
                                    <Alert variant="destructive" className="mt-4">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>
                                            System health check failed. Please resolve the issues before attempting an upgrade.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Available Backups */}
                    {availableBackups && availableBackups.length > 0 && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Available Backups
                                </CardTitle>
                                <CardDescription>Previous system backups for rollback if needed</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {availableBackups.map((backup) => (
                                        <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <div className="font-medium">{backup.id}</div>
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(backup.created_at)} • {formatFileSize(backup.size)}
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRollback(backup.id)}
                                                disabled={isApplying || isRollingBack}
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Rollback
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* File Upload Section */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                Upload Upgrade File
                            </CardTitle>
                            <CardDescription>
                                Upload a ZIP file containing the upgrade files. Make sure it's a valid upgrade package.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpload}>
                                <div className="space-y-4">
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".zip"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="upgrade-file"
                                        />
                                        <label
                                            htmlFor="upgrade-file"
                                            className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                                        >
                                            <div className="text-center">
                                                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                <p className="text-sm text-gray-500">
                                                    {data.upgrade_file ? data.upgrade_file.name : 'Click to select upgrade ZIP file'}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Maximum file size: 100MB
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    {errors.upgrade_file && (
                                        <Alert variant="destructive">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertDescription>{errors.upgrade_file}</AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="flex gap-3">
                                        <Button
                                            type="submit"
                                            disabled={!data.upgrade_file || isUploading || isApplying}
                                            className="flex-1"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Upload File
                                                </>
                                            )}
                                        </Button>

                                        {(uploadedFile || status === 'completed' || status === 'failed') && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleReset}
                                                disabled={isApplying}
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Reset
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Apply Upgrade Section */}
                    {uploadedFile && status === 'uploaded' && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Apply Upgrade
                                </CardTitle>
                                <CardDescription>
                                    Apply the uploaded upgrade to your system. This process will:
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Create a backup of essential files</li>
                                        <li>Extract and apply the upgrade files</li>
                                        <li>Run database migrations if needed</li>
                                        <li>Clear system caches</li>
                                        <li>Verify the upgrade was successful</li>
                                    </ul>

                                    <Alert>
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>
                                            <strong>Important:</strong> This action cannot be undone. Make sure you have a recent backup.
                                        </AlertDescription>
                                    </Alert>

                                    <Button
                                        onClick={handleApply}
                                        disabled={isApplying}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isApplying ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                Applying Upgrade...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4 mr-2" />
                                                Apply Upgrade
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Information Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Important Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Before Upgrading:</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>Create a full backup of your database and files</li>
                                    <li>Test the upgrade on a staging environment first</li>
                                    <li>Ensure you have sufficient disk space</li>
                                    <li>Check that all required PHP extensions are installed</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">During Upgrade:</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>Do not interrupt the upgrade process</li>
                                    <li>Keep the page open until completion</li>
                                    <li>Monitor the progress and status messages</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">After Upgrade:</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>Clear browser cache and cookies</li>
                                    <li>Test all major functionality</li>
                                    <li>Check that user data is intact</li>
                                    <li>Monitor system logs for any errors</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
