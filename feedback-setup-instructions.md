# Feedback Collection Setup Instructions

This guide will help you set up the feedback collection system to store user feedback in Google Sheets using Google Apps Script.

## Overview

The feedback modal collects:
- **Rating**: 1-5 star rating (required)
- **Feedback Text**: Optional text comments
- **Timestamp**: Automatically recorded
- **User Agent**: Browser information
- **URL**: Page URL where feedback was submitted

## Step-by-Step Setup

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "PanelWizard Feedback"
4. In the first row (A1, B1, C1, D1, E1), add these column headers:
   - **A1**: `Timestamp`
   - **B1**: `Rating`
   - **C1**: `Feedback`
   - **D1**: `User Agent`
   - **E1**: `URL`

### Step 2: Create a Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code in the editor
3. Copy and paste the following code:

```javascript
function doPost(e) {
  try {
    // Parse the form data from the request (URL-encoded format)
    // This avoids CORS preflight issues that occur with JSON requests
    const data = e.parameter;
    
    Logger.log('Received data: ' + JSON.stringify(data));
    
    // Get the active spreadsheet (the one this script is attached to)
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Verify sheet exists
    if (!sheet) {
      Logger.log('Error: No active sheet found');
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'No active sheet found'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Append the data as a new row
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.rating || '',
      data.feedback || '',
      data.userAgent || '',
      data.url || ''
    ]);
    
    Logger.log('Data appended successfully');
    
    // Return a success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    // Return an error response
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (💾 icon) or press `Ctrl+S` / `Cmd+S`
5. Name your project (e.g., "PanelWizard Feedback Handler")

### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the ⚙️ (gear icon) next to "Select type" → choose **Web app**
3. Configure the deployment:
   - **Description**: "PanelWizard Feedback Collection" (or any description)
   - **Execute as**: "Me" (your account)
   - **Who has access**: "Anyone" (this is required for the web app to accept requests from your website)
4. Click **Deploy**
5. **Important**: You may see an authorization screen. Click **Authorize access** and allow the necessary permissions
6. After authorization, you'll see a **Web app URL**. Copy this URL - you'll need it in the next step!

### Step 4: Configure the Endpoint URL

1. Open `script.js` in your project
2. Find the line that says:
   ```javascript
   const FEEDBACK_ENDPOINT_URL = ''; // TODO: Replace with your Google Apps Script web app URL
   ```
3. Replace the empty string with your Web app URL from Step 3, for example:
   ```javascript
   const FEEDBACK_ENDPOINT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
4. Save the file

### Step 5: Test the Setup

1. Open your PanelWizard application
2. Complete the wizard
3. Click the "Celebrate!" button
4. The feedback modal should appear
5. Fill in a rating and optional feedback
6. Click "Submit Feedback"
7. Check your Google Sheet - you should see a new row with your test feedback!

## Troubleshooting

### Feedback submissions are not appearing in the sheet

1. **Check the endpoint URL**: Make sure it's correctly set in `script.js`
2. **Check browser console**: Open Developer Tools (F12) and look for any error messages. You should see "Feedback submitted successfully" if the request worked.
3. **Verify script permissions**: Make sure you authorized the script when deploying
4. **Check script execution logs**:
   - In Google Apps Script editor, go to **Executions** (clock icon in left sidebar)
   - Look for recent executions of your `doPost` function
   - Click on an execution to see if it succeeded or failed
   - Check the logs by clicking **View logs** to see the Logger.log() output
5. **Verify the sheet**: Make sure you're looking at the correct Google Sheet and the correct tab
6. **Check column headers**: Ensure your sheet has the correct headers in row 1 (Timestamp, Rating, Feedback, User Agent, URL)

### "Script error" or permission errors

1. Make sure the script is deployed as a **Web app** (not an API executable)
2. Verify "Who has access" is set to **"Anyone"** (not just "Only myself")
3. Try redeploying the script with a new version

### CORS errors in browser console

- **Note**: The current implementation uses URL-encoded form data (not JSON) specifically to avoid CORS preflight issues
- This approach doesn't trigger CORS preflight requests, making it more reliable with Google Apps Script
- If you see CORS errors, make sure you're using the updated Google Apps Script code that uses `e.parameter` (not `JSON.parse`)
- Make sure you redeployed the script as a new version after updating the code

### The modal doesn't appear

1. Check browser console for JavaScript errors
2. Verify that the `showFeedbackModal()` function is being called
3. Check that the CSS file is loaded correctly

## Security Notes

- The Google Apps Script endpoint is publicly accessible, but it only accepts POST requests
- Consider adding rate limiting if you expect high traffic
- For additional security, you could add a simple API key check in the Apps Script code
- User feedback is stored in your Google Sheet, which follows Google's privacy policies

## Optional: Add API Key Protection

If you want to add basic protection, you can modify the Apps Script code:

```javascript
const API_KEY = 'your-secret-key-here'; // Change this to a random string

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Optional: Check API key if provided
    if (data.apiKey && data.apiKey !== API_KEY) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'Unauthorized'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ... rest of the code stays the same
  } catch (error) {
    // ... error handling
  }
}
```

Then update `script.js` to include the API key:
```javascript
const data = {
    rating: rating,
    feedback: feedbackText || '',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    apiKey: 'your-secret-key-here' // Add this
};
```

## Data Format

Each feedback submission creates a row in your Google Sheet with the following format:

| Timestamp | Rating | Feedback | User Agent | URL |
|-----------|--------|----------|------------|-----|
| 2024-01-15T10:30:00.000Z | 5 | "Great tool!" | Mozilla/5.0... | https://wizard.hea.com |

## Support

For issues with Google Apps Script, refer to the [Google Apps Script Documentation](https://developers.google.com/apps-script).

For issues with the feedback modal implementation, check the browser console for error messages.

