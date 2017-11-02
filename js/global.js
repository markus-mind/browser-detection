 /* NOT WORKING:
  * safari on windows hat andere Versionen
  * safari iphone 7
  * chrome / firefox auf iOS
  */

var ANGULAR_SUPPORTED_BROWSER_VERSIONS = {
  'chrome'      :       '',
  'firefox'     :       '',
  'safari'      :       '7',
  'edge'        :       '13',
  'ie'          :       '9',
  'ios'         :       '7',
  'android'     :       '4.1',
  'ie_mobile'   :       '11'
}

var BROWSER_DOWNLOAD_LINKS = {
  'chrome'      :       'https://www.google.de/chrome/browser/desktop/index.html',
  'firefox'     :       'https://www.mozilla.org/de/firefox/',
  'safari'      :       'https://www.apple.com/de/safari/',
  'edge'        :       'https://www.microsoft.com/de-de/windows/microsoft-edge',
  'ie'          :       'https://support.microsoft.com/de-de/help/17621/internet-explorer-downloads',
  'ios'         :       '',
  'android'     :       '',
  'ie_mobile'   :       ''
}

var STATUS_MESSAGES = {
  'supported'   :       'Yeah! Dein Browser %name% mit der Version %version% unterstützt Angular!',
  'outdated'    :       'Tut uns leid, Dein Browser ist zu alt! Lad Dir hier die neueste Version von %name% runter!',
  'unknown'     :       'Unser System wird von Deinem Browser nicht unterstützt, wir empfehlen Dir, die neueste Version von Chrome zu installieren.',
  'os_outdated' :       'Dein Betriebssystem ist zu alt. Bitte aktualisiere es auf die neueste Version.'
}

var status;
var b, name, version;

/*
 * Initialize variables
 */
if (typeof browser() != "undefined") {
  b = browser();
  name = b['name'];
  version = b['versionNumber'];
  mobile = b['mobile'];

  // IEMobile check
  if (getIEMobile() != false) {
    name = 'ie_mobile';
    version = getIEMobile();
  }

  status = getSupportStatus(name, version, mobile);
} else {
  // no support for browser-detection
  status = 'unknown';
}

/*
 * Validate Status
 */
function getSupportStatus(name, version, mobile) {
  if (ANGULAR_SUPPORTED_BROWSER_VERSIONS[name] !== undefined && !isNaN(version) ) {
    // browser known
    if (version >= ANGULAR_SUPPORTED_BROWSER_VERSIONS[name]) {
      // supported
      return 'supported';
    } else {
      // too old
      if (mobile) {
        return 'os_outdated';
      }
      return 'outdated';
    }
  } else {
    // browser not even known for support
    return 'unknown';
  }
}

/*
 * Extra check for IEMobile-Browser
 */
function getIEMobile() {
  var n = 'IEMobile';
  if ((indexStart = navigator.userAgent.indexOf(n)) != -1) {
    var version  = navigator.userAgent.substring(indexStart+n.length+1);

    if ((indexEnd = version.indexOf(";")) != -1)
      version = version.substring(0,indexEnd);
    if ((indexEnd = version.indexOf(" ")) != -1)
      version = version.substring(0,indexEnd);

    var versionNumber = parseFloat(version);
    return versionNumber;
  }
  return false;
}

/*
 * onload
 */
window.onload = function () {
  var msg;
  var dlink;
  var linkTxt;

  switch (status) {
    case 'supported':
      msg = STATUS_MESSAGES[status].replace("%name%", name).replace("%version%", version);
      break;
    case 'outdated':
      msg = STATUS_MESSAGES[status].replace("%name%", name);
      dlink = BROWSER_DOWNLOAD_LINKS[name];
      linkTxt = name.charAt(0).toUpperCase() + name.slice(1);
      break;
    case 'os_outdated':
      msg = STATUS_MESSAGES[status];
      dlink = BROWSER_DOWNLOAD_LINKS[name];
      linkTxt = name.charAt(0).toUpperCase() + name.slice(1);
      break;
    case 'unknown':
      msg = STATUS_MESSAGES[status];
      dlink = BROWSER_DOWNLOAD_LINKS['chrome'];
      linkTxt = 'Chrome';
      break;
    default:
      break;
  }
  document.body.innerHTML += '<h1>' + msg + '</h1>';

  if (status !== 'supported' && dlink !== '')
    document.body.innerHTML += '<a href="' + dlink + '">Download ' + linkTxt + '</a>';
}
