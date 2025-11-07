<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>We&rsquo;ll be right back</title>
        <style>
            :root {
                color-scheme: light dark;
                font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }

            body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: radial-gradient(circle at top, #195ba9 0%, #0b1f3a 60%, #050d1a 100%);
                color: #f1f5f9;
            }

            .card {
                background: rgba(15, 23, 42, 0.85);
                border-radius: 18px;
                padding: clamp(2.5rem, 4vw, 3.5rem);
                max-width: min(520px, 88vw);
                box-shadow: 0 20px 40px rgba(15, 23, 42, 0.35);
                backdrop-filter: blur(16px);
            }

            h1 {
                margin: 0 0 1rem;
                font-size: clamp(2.25rem, 4vw, 3rem);
                line-height: 1.1;
                letter-spacing: -0.02em;
            }

            p {
                margin: 0.75rem 0;
                color: rgba(226, 232, 240, 0.9);
                line-height: 1.6;
            }

            .notice {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.65rem 1rem;
                border-radius: 999px;
                background: rgba(59, 130, 246, 0.15);
                color: #93c5fd;
                font-size: 0.92rem;
                text-transform: uppercase;
                letter-spacing: 0.14em;
                font-weight: 600;
            }

            .scheduler {
                margin-top: 1.75rem;
                border-top: 1px solid rgba(148, 163, 184, 0.2);
                padding-top: 1.5rem;
                font-size: 0.95rem;
                color: rgba(148, 163, 184, 0.9);
                display: flex;
                flex-direction: column;
                gap: 0.65rem;
            }

            .contact {
                display: inline-flex;
                gap: 0.5rem;
                align-items: center;
                background: rgba(59, 130, 246, 0.2);
                color: #bfdbfe;
                padding: 0.5rem 0.85rem;
                border-radius: 999px;
                font-size: 0.85rem;
            }

            @media (max-width: 420px) {
                .card {
                    padding: 2.15rem;
                }
            }
        </style>
    </head>
    <body>
        <main class="card">
            <div class="notice">Scheduled maintenance</div>
            <h1>We&rsquo;re refreshing the experience</h1>
            <p>
                We&rsquo;re currently upgrading the application to roll out new improvements.
                Everything will be back online shortly. Thanks for your patience!
            </p>
            @php($message = isset($exception) ? trim($exception->getMessage()) : null)
            @if($message)
                <p><strong>Update:</strong> {{ $message }}</p>
            @endif
            <section class="scheduler">
                <div>
                    Estimated resume time:<br />
                    <strong>{{ now()->addMinutes(30)->format('M j, H:i T') }}</strong>
                </div>
                <div>
                    Need assistance?
                    <span class="contact">Please reach out to support.</span>
                </div>
            </section>
        </main>
    </body>
</html>
