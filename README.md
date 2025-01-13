# weibo-comment-helper

A Chrome extension that helps automate likes, comments, and replies on Weibo posts.

## Features

- Auto-like up to 20 comments
- Auto-post 25 comments
- Auto-reply with 25 nested comments
- Uses existing comments as content
- Customizable intervals between actions

## Installation

1. Download the source code
2. Open Chrome/360 Browser extension management page
   - Chrome: chrome://extensions/
   - 360 Browser: chrome://extensions/
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the folder containing the source code

## Project Structure

weibo-comment-helper/
├── manifest.json # Extension configuration
├── popup.html # Extension popup interface
├── popup.js # Main functionality
└── content.js # Page interaction scripts


## Usage

### Auto-Like Comments
1. Open any Weibo post with comments
2. Click the extension icon
3. Click "给20条评论点赞"
4. The extension will automatically like up to 20 comments
5. Already liked comments will be skipped

### Auto-Post Comments
1. Open any Weibo post
2. Click the extension icon
3. Click "自动发送25条评论"
4. The extension will:
   - Collect existing comments as content
   - Post 25 comments automatically
   - Wait 5 seconds between each comment

### Auto-Reply to Comments
1. Open any Weibo post
2. Click the extension icon
3. Click "添加25条楼中楼回复"
4. Click the reply button on any comment
5. The extension will:
   - Use existing comments as reply content
   - Post 25 replies automatically
   - Wait 5 seconds between each reply

## Requirements

- Chrome/360 Browser with Developer mode enabled
- Active Weibo login session
- Sufficient comments on the page for content collection

## Notes

- Please use responsibly
- Avoid excessive automation
- Follow Weibo's platform rules
- The extension requires manual activation for each session

## Development

To modify the extension:
1. Clone this repository
2. Make your changes
3. Load the updated version in Chrome/360 Browser
4. Test thoroughly before deployment

## License

MIT License

## Disclaimer

This extension is for educational purposes only. Users are responsible for compliance with Weibo's terms of service.
