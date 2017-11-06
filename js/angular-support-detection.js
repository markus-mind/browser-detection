/*
 * Browser-Detection for Angular-support
 *
 */

var ANGULAR_SUPPORTED_BROWSER_VERSIONS = {
  'chrome'      :       '',
  'firefox'     :       '',
  'safari'      :       '7',
  'edge'        :       '13',
  'opera'       :       '15',
  'ie'          :       '9',
  'ios'         :       '7',
  'crios'       :       '', // chrome on iOS
  'fxios'       :       '', // firefox on iOS
  'android'     :       '4.1',
  'ie_mobile'   :       '11',
}

var BROWSER_DOWNLOAD_LINKS = {
  'chrome'      :       'https://www.google.de/chrome/browser/desktop/index.html',
  'firefox'     :       'https://www.mozilla.org/de/firefox/',
  'safari'      :       'https://www.apple.com/de/safari/',
  'edge'        :       'https://www.microsoft.com/de-de/windows/microsoft-edge',
  'opera'       :       'http://www.opera.com/de',
  'ie'          :       'https://support.microsoft.com/de-de/help/17621/internet-explorer-downloads',
  'ios'         :       '',
  'crios'       :       '',
  'fxios'       :       '',
  'android'     :       '',
  'ie_mobile'   :       '',
}

var STATUS_MESSAGES = {
  'supported'   :       'Yeah! Dein Browser %name% mit der Version %version% unterstützt Angular!',
  'outdated'    :       'Tut uns leid, Dein Browser ist zu alt! Lad Dir hier die neueste Version von %name% runter!',
  'unknown'     :       'Unser System wird von Deinem Browser nicht unterstützt, wir empfehlen Dir, die neueste Version von Chrome zu installieren.',
  'os_outdated' :       'Dein Betriebssystem ist zu alt. Bitte aktualisiere es auf die neueste Version.'
}

var status;
var name, version;

/*
 * Initialize variables
 */
if (typeof browser() != "undefined") {
  b = getBrowserInfo(browser());
  name = b[0];
  version = b[1];
  mobile = b[2];
  status = getSupportStatus(name, version, mobile);
} else {
  // no support for browser-detection
  status = 'unknown';
}

/*
 * Checks for individual browsers and sets browser's name and version
 */
function getBrowserInfo(b) {

  var bName, bVersion;
  // IEMobile check
  if (getIndividualBrowserVersion('IEMobile') != false) {
    bName = 'ie_mobile';
    bVersion = getIndividualBrowserVersion('IEMobile');
  }
  // iOS firefox check
  else if (getIndividualBrowserVersion('FxiOS') != false) {
    bName = 'fxios';
    bVersion = getIndividualBrowserVersion('FxiOS');
  }
  // default
  else {
    bName = b['name'];
    bVersion = b['versionNumber'];
  }
  return [bName, bVersion, b['mobile']];
}

/*
 * Extra check for individual browsers
 */
function getIndividualBrowserVersion(browserName) {
  var indexStart = navigator.userAgent.indexOf(browserName);

  if (indexStart != -1) {
    var version  = navigator.userAgent.substring(indexStart+browserName.length+1);
    var indexEnd1 = version.indexOf(";");
    var indexEnd2 = version.indexOf(" ");

    if (indexEnd1 != -1)
      version = version.substring(0,indexEnd1);
    if (indexEnd2 != -1)
      version = version.substring(0,indexEnd2);

    return parseFloat(version);
  }
  return false;
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
      if (mobile && (name === 'ios' || name === 'android')) {
        // browser is dependant on OS-Version
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
 * onload
 */
window.onload = function () {
  alert(name+version);
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
