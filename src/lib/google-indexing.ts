import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Load credentials based on environment variables
let credentialsEnv: any = null;

try {
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        credentialsEnv = {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            // Replace literal \n with actual newlines in private key
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };
    } else {
        console.warn('[Google Indexing API] GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY is missing in .env');
    }
} catch (error) {
    console.error('[Google Indexing API] Failed to load credentials from env:', error);
}

// Initialize the Google Auth client
const jwtClient = credentialsEnv
    ? new google.auth.JWT({
          email: credentialsEnv.client_email,
          key: credentialsEnv.private_key,
          scopes: ['https://www.googleapis.com/auth/indexing'],
      })
    : null;

export type NotificationType = 'URL_UPDATED' | 'URL_DELETED';

export async function notifySearchEngine(url: string, type: NotificationType) {
    if (!jwtClient) {
        console.warn('[Google Indexing API] Skipping indexing notification: Credentials not found.');
        return;
    }

    try {
        // Authorize client
        await jwtClient.authorize();

        // Call the Indexing API
        const indexing = google.indexing({
            version: 'v3',
            auth: jwtClient,
        });

        const response = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: type,
            },
        });

        console.log(`[Google Indexing API] Successfully notified ${type} for ${url}`);
        return response.data;
    } catch (error) {
        console.error(`[Google Indexing API] Error notifying ${url}:`, error);
    }
}
