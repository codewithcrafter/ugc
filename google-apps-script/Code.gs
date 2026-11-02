/**
 * MyUGC Video — Google Sheets Lead Ingestion Backend
 * ===================================================
 * Target Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1FDxnW-CNYCcDajFRlQl5ZPyCGSU8ytkAnB2rRsAVkZ4/edit
 *
 * Headers in user's sheet (gid=0):
 * Column A: Timestamp
 * Column B: Name
 * Column C: Email
 * Column D: Phone
 * Column E: Message
 * Column F: Source
 */

// Explicit Spreadsheet ID from user's URL:
var SPREADSHEET_ID = '1FDxnW-CNYCcDajFRlQl5ZPyCGSU8ytkAnB2rRsAVkZ4';

// Standard 6 headers matching user's sheet
var HEADERS = [
  'Timestamp',
  'Name',
  'Email',
  'Phone',
  'Message',
  'Source'
];

/**
 * Handle incoming POST requests from website forms
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  
  // Wait up to 30 seconds for concurrent requests to clear
  try {
    lock.waitLock(30000);
  } catch (lockError) {
    return createJsonResponse({
      status: 'error',
      message: 'Server is busy processing other inquiries. Please try again momentarily.'
    });
  }

  try {
    // 1. Verify and parse request payload
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    if (!payload || Object.keys(payload).length === 0) {
      return createJsonResponse({
        status: 'error',
        message: 'Empty or missing request payload.'
      });
    }

    // 2. Honeypot Anti-Spam Check
    var honeypot = (payload.honeypot || payload._hp_website || payload.hp || '').toString().trim();
    if (honeypot.length > 0) {
      return createJsonResponse({
        status: 'success',
        message: 'Inquiry received successfully.',
        leadId: 'MYUGC-HP-' + new Date().getTime().toString(36).toUpperCase()
      });
    }

    // 3. Extract and normalize field values
    var fullName = (payload.fullName || payload.name || '').toString().trim();
    var email = (payload.email || payload.emailAddress || '').toString().trim();
    var phone = (payload.phone || payload.phoneNumber || '').toString().trim();
    var message = (payload.message || payload.details || '').toString().trim();
    var formSource = (payload.formSource || payload.source || 'Hero Form').toString().trim();
    var pageUrl = (payload.pageUrl || payload.sourceUrl || '').toString().trim();

    // 4. Server-Side Validation
    if (!fullName || fullName.length < 2) {
      return createJsonResponse({
        status: 'error',
        message: 'Validation failed: Full Name is required (minimum 2 characters).'
      });
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return createJsonResponse({
        status: 'error',
        message: 'Validation failed: A valid email address is required.'
      });
    }

    var phoneDigits = phone.replace(/\D/g, '');
    if (!phone || phoneDigits.length < 7 || phoneDigits.length > 15) {
      return createJsonResponse({
        status: 'error',
        message: 'Validation failed: A valid contact phone number (7 to 15 digits) is required.'
      });
    }

    // 5. Connect to Google Spreadsheet (First tab / Sheet1 / gid=0)
    var sheet = getTargetSheet();
    if (!sheet) {
      throw new Error('Unable to access spreadsheet. Please verify the spreadsheet ID.');
    }

    // 6. Ensure Header Row Exists if sheet is empty
    ensureHeaders(sheet);

    // 7. Auto-Generate Timestamp in IST
    var tz = Session.getScriptTimeZone() || 'Asia/Kolkata';
    var formattedTimestamp = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd HH:mm:ss");

    // 8. Build row values to match sheet headers dynamically
    var rowData = [];
    if (sheet.getLastColumn() > 0) {
      var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      for (var i = 0; i < headerRow.length; i++) {
        var h = (headerRow[i] || '').toString().trim().toLowerCase();
        if (/timestamp|time|date/i.test(h)) {
          rowData.push(formattedTimestamp);
        } else if (/name/i.test(h)) {
          rowData.push(sanitizeCell(fullName));
        } else if (/email/i.test(h)) {
          rowData.push(sanitizeCell(email));
        } else if (/phone|contact|mobile/i.test(h)) {
          rowData.push(sanitizeCell(phone));
        } else if (/message|detail|note/i.test(h)) {
          rowData.push(sanitizeCell(message));
        } else if (/source/i.test(h)) {
          rowData.push(sanitizeCell(formSource));
        } else if (/url|page/i.test(h)) {
          rowData.push(sanitizeCell(pageUrl));
        } else {
          rowData.push('');
        }
      }
    }

    // Fallback if header row could not be read
    if (rowData.length === 0) {
      rowData = [
        formattedTimestamp,
        sanitizeCell(fullName),
        sanitizeCell(email),
        sanitizeCell(phone),
        sanitizeCell(message),
        sanitizeCell(formSource)
      ];
    }

    // 9. Append Row directly to user's sheet
    sheet.appendRow(rowData);

    // Generate unique confirmation reference ID
    var leadId = 'MYUGC-' + new Date().getTime().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 899 + 100);

    return createJsonResponse({
      status: 'success',
      message: 'Inquiry successfully recorded in Google Sheets.',
      leadId: leadId,
      timestamp: formattedTimestamp
    });

  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: 'Server error: ' + (err.message || 'Failed to process inquiry.')
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle GET requests — useful for status health-checks in browser
 */
function doGet(e) {
  return createJsonResponse({
    status: 'online',
    service: 'MyUGC Video Google Sheets Ingestion API',
    spreadsheetId: SPREADSHEET_ID,
    timestamp: new Date().toISOString(),
    expectedMethod: 'POST',
    fields: ['fullName', 'email', 'phone', 'message', 'formSource']
  });
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Resolves the user's Google Spreadsheet directly by ID
 * and targets the first sheet tab (gid=0) where the user has their headers.
 */
function getTargetSheet() {
  var ss;
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } catch (openErr) {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }

  if (!ss) {
    throw new Error('Unable to open spreadsheet. Please verify SPREADSHEET_ID in Code.gs.');
  }

  // Always target the primary sheet tab (gid=0 / Sheet1 where headers are placed)
  var allSheets = ss.getSheets();
  if (allSheets && allSheets.length > 0) {
    return allSheets[0];
  }

  return ss.getActiveSheet();
}

/**
 * Ensures the sheet has column headers if completely blank
 */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
}

/**
 * Neutralizes potential formula injection characters (=, +, -, @, \t, \r)
 */
function sanitizeCell(value) {
  if (value === null || value === undefined) return '';
  var str = String(value).trim();
  if (str.length === 0) return '';
  
  var dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousPrefixes.indexOf(str.charAt(0)) !== -1) {
    return "'" + str;
  }
  return str;
}

/**
 * Creates a JSON response with proper ContentService mime-type
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
