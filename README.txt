Click Sender for WhatsApp (manual) — local Chrome extension
===========================================================

What it is
----------
A Chrome side panel to prepare personalised WhatsApp messages and open each chat
with one click. YOU press Send in WhatsApp each time. It does not send by itself.

It does NOT auto-send. There is no script that fires messages for you, on purpose:
automating sending through WhatsApp Web breaks WhatsApp's rules and gets numbers
banned (RocketSend users reported 24-hour blocks after 65-70 messages). For real
automatic bulk sending, use the official WhatsApp Cloud API version instead.

How to install (one time)
-------------------------
1. Open Chrome and go to:  chrome://extensions
2. Turn ON "Developer mode" (top-right toggle).
3. Click "Load unpacked".
4. Choose this folder:  D:\New folder\Rocket\extension
5. The "Click Sender" icon appears in the toolbar. Pin it if you like
   (puzzle-piece icon > pin).

How to use
----------
0. Recommended: install "WhatsApp for Windows" (free) so chats open with no
   reload - whatsapp.com/download or the Microsoft Store. Log in to it once.
1. Or, if you prefer the browser: open and log in to WhatsApp Web in Chrome.
2. Click the Click Sender toolbar icon -> the panel opens on the right.
3. Contacts: upload a CSV or paste numbers. (From Excel: File > Save As > CSV.)
   Pick the phone column and the country code for numbers without a +.
4. Message: write it. Use {{name}} to personalise, {{name|Customer}} for blanks.
5. Send: for each person click "Open WhatsApp" -> the chat opens with the message
   already written in the box. Press Send there, come back, tap "Mark sent" ->
   the panel jumps to the next person and focuses its button, so you can just
   press Enter for the next one. Wait a few seconds between people.
   Or use "Open next unsent" to go in order.

   "Open chats in" (toggle in the panel):
     * WhatsApp app (no reload)  <-- DEFAULT, recommended
       Uses WhatsApp's whatsapp:// link, so the WhatsApp Desktop app jumps
       straight to the chat. Nothing reloads. Needs "WhatsApp for Windows"
       installed (free, from the Microsoft Store or whatsapp.com/download).
       The first time, Chrome asks for permission - tick "Always allow".
     * Browser (reloads)
       Uses your open WhatsApp Web tab. Works without the desktop app, but
       WhatsApp Web reloads for a second or two on each contact.
6. Opt-outs tab: add anyone who replies STOP / band / unsubscribe. They are skipped.
7. Download a CSV report when done.

All data stays only in this browser on your computer. No server, no account.

Updating
--------
If files change, go to chrome://extensions and click the refresh/reload icon on
this extension's card. (Do this now after the latest update - it added permission
to reuse your open WhatsApp Web tab.)
