# Google Default Account

This extension is designed for users who work with multiple Google accounts and want to set a default account for these services, specifically for Google Meet.
Whether the primary Google account you are logged in to, this extension allows you to pick a default account to use for Google Meet, Gmail, Google Drive and Google Photos.
With this extension, you can easily switch between your personal and work accounts without annoying switching every time.

You can install from [Chrome Extension Store](https://chrome.google.com/webstore/detail/njbmhlokbhcncpcjakgkacnlfkimomka).

## How to develop

Switch to project root directory and enter following commands in console:

```bash
npm install
npm run watch
```

After the library is installed and built, go to Chrome extension settings page and click `Load unpacked` in top left corner. In dialog box, select `dist` folder in project root directory.

## How to compile for production

In project root directory, run following command:

```bash
npm run build
```

The compiled result for production environment can be found in `dist` folder.
