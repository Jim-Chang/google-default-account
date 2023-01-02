type UrlPatcher = (defaultAcct: string, currUrl: string) => string;

enum Service {
  Meet = 'Meet',
  Photo = 'Photo',
  Mail = 'Mail',
  Drive = 'Drive',
}

const svcUrlFilter: { [key in Service]: chrome.events.UrlFilter } = {
  [Service.Meet]: { hostEquals: 'meet.google.com' },
  [Service.Photo]: { urlMatches: 'photos.google.com/$' },
  [Service.Mail]: { urlMatches: 'mail.google.com/$' },
  [Service.Drive]: { urlMatches: 'drive.google.com/$' },
};

const svcUrlPatcherMap: { [key in Service]: UrlPatcher } = {
  [Service.Meet]: (defaultAcct: string, currUrl: string) =>
    `${currUrl}${currUrl.match('\\?') ? '&' : '?'}authuser=${defaultAcct}`,
  [Service.Photo]: (defaultAcct: string, currUrl: string) => `${currUrl}u/${defaultAcct}/`,
  [Service.Mail]: (defaultAcct: string, currUrl: string) => `${currUrl}mail/u/${defaultAcct}/`,
  [Service.Drive]: (defaultAcct: string, currUrl: string) => `${currUrl}drive/u/${defaultAcct}/`,
};

async function getDefaultUserAcct(type: Service): Promise<string> {
  const cfg = await chrome.storage.local.get(type);
  return cfg[type] ?? '0';
}

async function getActiveTab(): Promise<chrome.tabs.Tab> {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab;
}

async function redirectTabTo(url: string): Promise<chrome.tabs.Tab> {
  const tab = await getActiveTab();
  return chrome.tabs.update(tab.id, { url: url });
}

// Google Meet
chrome.webNavigation.onBeforeNavigate.addListener(
  async ({ url: currentUrl }) => {
    // https://meet.google.com/xxx-xxx-xxx?authuser=1
    const r = /authuser=\d/;
    if (!r.test(currentUrl)) {
      const defaultAcct = await getDefaultUserAcct(Service.Meet);
      const destUrl = svcUrlPatcherMap[Service.Meet](defaultAcct, currentUrl);
      console.info(`Redirected from ${currentUrl} to ${destUrl}`);
      redirectTabTo(destUrl);
    }
  },
  { url: [svcUrlFilter[Service.Meet]] },
);

// Google Photo, Gmail, Drive
[Service.Photo, Service.Mail, Service.Drive].forEach((svc) => {
  chrome.webNavigation.onBeforeNavigate.addListener(
    async ({ url: currentUrl }) => {
      const defaultAcct = await getDefaultUserAcct(svc);
      const destUrl = svcUrlPatcherMap[svc](defaultAcct, currentUrl);
      console.info(`Redirected from ${currentUrl} to ${destUrl}`);
      redirectTabTo(destUrl);
    },
    { url: [svcUrlFilter[svc]] },
  );
});
