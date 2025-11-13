import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function UpgradeIndex({ uploadedFile: initialUploadedFile }: { uploadedFile?: string }) {
    const [uploading, setUploading] = useState(false);
    const [applying, setApplying] = useState(false);

    const { flash, errors: pageErrors } = usePage().props as any;
    const { data, setData, post, processing, errors, reset } = useForm({
        upgrade_file: null,
    });

    // Handle flash messages after redirect
    useEffect(() => {
        if (flash?.success) {
            let message = flash.success;
            if (flash.debug) {
                message += '\n\nDebug: ' + flash.debug;
            }
            alert(message);
        }
        
        // Handle errors
        if (flash?.error || pageErrors?.upgrade || pageErrors?.file_path) {
            const errorMsg = flash?.error || pageErrors?.upgrade || pageErrors?.file_path;
            if (errorMsg) {
                alert('Error: ' + errorMsg);
            }
        }
    }, [flash, pageErrors]); // Remove initialUploadedFile from dependency to avoid loops

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setData('upgrade_file', file);
        }
    };

    const handleUpload = (e: any) => {
        e.preventDefault();

        if (!data.upgrade_file) {
            alert('Please select a file to upload');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('upgrade_file', data.upgrade_file);

        router.post(route('upgrade.upload'), formData, {
            preserveState: false, // Don't preserve state, reload the page
            preserveScroll: true,
            onSuccess: (page: any) => {
                setUploading(false);
                // The page will be reloaded with new props
            },
            onError: (errors: any) => {
                setUploading(false);
                if (errors.response?.data?.message) {
                    alert('Upload failed: ' + errors.response.data.message);
                } else {
                    alert('Upload failed!');
                }
            }
        });
    };

    const handleApply = () => {
        if (!initialUploadedFile) {
            alert('Please upload a file first');
            return;
        }

        if (!confirm('Are you sure you want to apply this upgrade? This will overwrite files and may break the system if the zip is invalid.')) {
            return;
        }

        setApplying(true);

        router.post(route('upgrade.apply'), {
            file_path: initialUploadedFile
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page: any) => {
                setApplying(false);
                // The page will be re-rendered with flash data
            },
            onError: (errors: any) => {
                setApplying(false);
                if (errors.response?.data?.message) {
                    alert('Apply failed: ' + errors.response.data.message);
                } else {
                    alert('Apply failed!');
                }
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">System Upgrade</h1>
                    <p className="text-gray-600 mt-2">
                        Upload and apply system upgrades to update your application.
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* Upload Section */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Upgrade Package</h2>
                        <p className="text-gray-600 mb-4">
                            Select a ZIP file containing the updated files for your system upgrade.
                        </p>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <input
                                    type="file"
                                    accept=".zip"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    disabled={uploading}
                                />
                                {errors.upgrade_file && (
                                    <p className="text-red-500 text-sm mt-1">{errors.upgrade_file}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!data.upgrade_file || uploading}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Upload File'}
                            </button>
                        </form>
                    </div>

                    {/* Apply Section */}
                    {initialUploadedFile && (
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply Upgrade</h2>
                            <p className="text-gray-600 mb-4">
                                Apply the uploaded upgrade package to update your system.
                            </p>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start gap-2">
                                    <div className="text-red-600 mt-0.5">⚠️</div>
                                    <div>
                                        <h3 className="font-medium text-red-900 mb-1">Warning</h3>
                                        <p className="text-red-800 text-sm">
                                            Applying this upgrade will overwrite existing files. Make sure you have a backup before proceeding.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="text-sm font-medium text-gray-900">Uploaded File:</p>
                                <p className="text-sm text-gray-600">{initialUploadedFile}</p>
                            </div>

                            <button
                                onClick={handleApply}
                                disabled={applying}
                                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {applying ? 'Applying Upgrade...' : 'Apply Upgrade'}
                            </button>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Create Upgrade Packages</h2>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                            <li>Make your updates to the local codebase</li>
                            <li>Test the changes thoroughly</li>
                            <li>Create a ZIP file containing the updated files (maintain the same directory structure as your Laravel app)</li>
                            <li>Upload the ZIP file using the form above</li>
                            <li>Apply the upgrade to update your system</li>
                        </ol>
                        <p className="text-xs text-red-600 mt-4">
                            <strong>Note:</strong> Only upload trusted upgrade packages. Malicious files can damage your system.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
