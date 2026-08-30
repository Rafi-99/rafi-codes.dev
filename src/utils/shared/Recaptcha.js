import 'server-only';

const FETCH_TIMEOUT_MS = 5000;

export async function callRecaptchaAssessment(token, expectedAction = 'submit') {
    const response = await fetch(
        `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.RECAPTCHA_PROJECT_ID}/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: {
                    token,
                    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
                    expectedAction
                }
            }),
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
        }
    );

    if (!response.ok) {
        return null;
    }
    
    return response.json();
}
