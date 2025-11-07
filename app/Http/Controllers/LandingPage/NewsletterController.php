<?php

namespace App\Http\Controllers\LandingPage;

use App\Mail\WaitlistEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Newsletter;

class NewsletterController extends Controller
{
    public function index(Request $request)
    {
        $query = Newsletter::orderBy('created_at', 'desc');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('email', 'like', "%{$search}%");
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $newsletters = $query->paginate(15)->withQueryString();

        return Inertia::render('landing-page/newsletters/index', [
            'newsletters' => $newsletters,
            'filters' => $request->only(['search', 'status']),
            'stats' => [
                'total' => Newsletter::count(),
                'active' => Newsletter::active()->count(),
                'unsubscribed' => Newsletter::unsubscribed()->count(),
            ]
        ]);
    }

    public function show(Newsletter $newsletter)
    {
        return Inertia::render('landing-page/newsletters/show', [
            'newsletter' => $newsletter
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletters,email'
        ]);

        Newsletter::create([
            'email' => $request->email,
            'status' => 'active',
            'subscribed_at' => now()
        ]);

        return back()->with('success', __('Newsletter subscription added successfully!'));
    }

    public function update(Request $request, Newsletter $newsletter)
    {
        $request->validate([
            'status' => 'required|in:active,unsubscribed'
        ]);

        $updateData = ['status' => $request->status];
        
        if ($request->status === 'unsubscribed' && $newsletter->status === 'active') {
            $updateData['unsubscribed_at'] = now();
        } elseif ($request->status === 'active' && $newsletter->status === 'unsubscribed') {
            $updateData['subscribed_at'] = now();
            $updateData['unsubscribed_at'] = null;
        }

        $newsletter->update($updateData);

        return back()->with('success', __('Newsletter subscription updated successfully!'));
    }

    public function destroy(Newsletter $newsletter)
    {
        $newsletter->delete();

        return back()->with('success', __('Newsletter subscription deleted successfully!'));
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:delete,activate,unsubscribe',
            'ids' => 'required|array',
            'ids.*' => 'exists:newsletters,id'
        ]);

        $newsletters = Newsletter::whereIn('id', $request->ids);

        switch ($request->action) {
            case 'delete':
                $newsletters->delete();
                $message = __('Selected subscriptions deleted successfully!');
                break;
            case 'activate':
                $newsletters->update([
                    'status' => 'active',
                    'subscribed_at' => now(),
                    'unsubscribed_at' => null
                ]);
                $message = __('Selected subscriptions activated successfully!');
                break;
            case 'unsubscribe':
                $newsletters->update([
                    'status' => 'unsubscribed',
                    'unsubscribed_at' => now()
                ]);
                $message = __('Selected subscriptions unsubscribed successfully!');
                break;
        }

        return back()->with('success', $message);
    }

    public function sendEmail(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'subscriber_ids' => 'nullable|array',
            'subscriber_ids.*' => 'exists:newsletters,id'
        ]);

        $subject = $request->subject;
        $message = $request->message;

        $query = Newsletter::active();

        if ($request->filled('subscriber_ids')) {
            $query->whereIn('id', $request->subscriber_ids);
        }

        $subscribers = $query->get();

        if ($subscribers->isEmpty()) {
            return back()->with('error', __('No active subscribers found.'));
        }

        // Send emails
        $sent = 0;
        $failed = 0;

        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email)->send(new WaitlistEmail($subject, $message));
                $sent++;
            } catch (\Exception $e) {
                $failed++;
                // Log error or handle failure
            }
        }

        $message = __('Emails sent successfully! Sent: :sent, Failed: :failed', ['sent' => $sent, 'failed' => $failed]);

        return back()->with('success', $message);
    }
}