/**
 *  Copyright (c) 2010 Marat Nepomnyashy    maratbn@gmail
 *  All rights reserved.
 *
 *  Module: FILEfox/components/nsFILEfox.js
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *      * Redistributions of source code must retain the above copyright
 *        notice, this list of conditions and the following disclaimer.
 *      * Redistributions in binary form must reproduce the above copyright
 *        notice, this list of conditions and the following disclaimer in the
 *        documentation and/or other materials provided with the distribution.
 *      * Neither the name of the <organization> nor the
 *        names of its contributors may be used to endorse or promote products
 *        derived from this software without specific prior written permission.
 * 
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 *  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 *  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 *
 *  The XPCOM component 'nsFILEfox' is declared here.
 */
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

nsFILEfoxTextFileReadOut_interfaces = [
                                    Components.interfaces.nsIFILEfoxTextFileReadOut,
                                    Components.interfaces.nsIFILEfoxTextFileRead,
                                    Components.interfaces.nsIFILEfoxTextFile,
                                    Components.interfaces.nsIClassInfo,
                                    Components.interfaces.nsISupports
                                ];

function nsFILEfoxTextFileReadOut() {
}

nsFILEfoxTextFileReadOut.prototype = {
    //  Interaface nsIClassInfo:
    classDescription:           "This XPCOM component is part of the FILEfox Firefox extension.",
    classID:                    Components.ID("{9d163612-2c51-430d-9460-62cb0f2ffe46}"),
    contractID:                 "@marat.nepomnyashy/ns_file_fox_text_file_read_out;1",
    flags:                      Components.interfaces.nsIClassInfo.DOM_OBJECT,
    implementationLanguage:     Components.interfaces.nsIProgrammingLanguage.JAVASCRIPT,

    getHelperForLanguage:       function(language) {
                                    return null;
                                },

    getInterfaces:              function(totalInterfaces) {
                                    totalInterfaces.value = nsFILEfoxTextFileReadOut_interfaces.length;
                                    return nsFILEfoxTextFileReadOut_interfaces;
                                },

    //  Interface nsISupports:
    QueryInterface:             XPCOMUtils.generateQI(nsFILEfoxTextFileReadOut_interfaces),

    // Interface nsIFILEfoxTextFile:
    /**
     *  The encoding with which this text file is encoded.
     */
    encoding:                   "",

    /**
     *  Total number of characters in the text file.
     */
    totalChars:                 0,

    /**
     *  Total number of lines in the text file.
     *
     *  Have to store the text file line by line rather than in a single string, as otherwise a huge file requiring to
     *  be accomodated in a huge string would overwhelm the browser's JavaScript engine.
     */
    totalLines:                 0,

    /**
     *  Returns a single line out of the text file, including the line termination carriage return character sequence.
     *
     *  @param  indexLine           Number                  0-based index of the line.
     */
    getLine:                    function(indexLine) {
                                    return this._arrLines && this._arrLines[indexLine];
                                },

    setData:                    function(strEncoding, totalChars, totalLines, arrLines) {
                                    this.encoding = strEncoding;
                                    this.totalChars = totalChars;
                                    this.totalLines = totalLines;
                                    this._arrLines = arrLines;
                                }
}


nsFILEfox_interfaces =          [
                                    Components.interfaces.nsIFILEfox,
                                    Components.interfaces.nsIClassInfo,
                                    Components.interfaces.nsISupports
                                ];

function nsFILEfox() {
}

nsFILEfox.prototype = {
    //  Interaface nsIClassInfo:
    classDescription:           "This XPCOM component is part of the FILEfox Firefox extension.",
    classID:                    Components.ID("{7faaf2e7-a039-4a86-89f7-1406110c908c}"),
    contractID:                 "@marat.nepomnyashy/ns_file_fox;1",
    flags:                      Components.interfaces.nsIClassInfo.DOM_OBJECT,
    implementationLanguage:     Components.interfaces.nsIProgrammingLanguage.JAVASCRIPT,

    getHelperForLanguage:       function(language) {
                                    return null;
                                },

    getInterfaces:              function(totalInterfaces) {
                                    totalInterfaces.value = nsFILEfox_interfaces.length;
                                    return nsFILEfox_interfaces;
                                },

    _xpcom_categories: [{
        category:               "JavaScript global property",
        entry:                  'nsFILEfox'
    }],

    //  Interface nsISupports:
    QueryInterface:             XPCOMUtils.generateQI(nsFILEfox_interfaces),

                                                    
    // Interface nsIFILEfox:

    /**
     *  Returns the version of the currently installed FILEfox extension.
     */
    getVersion:                 function() {
                                    var application = this._obtainComponentService(
                                                                    null,
                                                                    '@mozilla.org/fuel/application;1',
                                                                    Components.interfaces.fuelIApplication);

                                    var extension = application && application.extensions && application.extensions.get('FILEfox@maratbn.com');
                                    return extension && extension.version;
                                },

    /**
     *  Causes the FILEfox extension to request from the user to manually select an ASCII text file to load.  Upon
     *  user approval FILEfox will initiate a Mozilla-internal synchroneous file loading routine via XPCOM, and then
     *  return the file contents in a data object corresponding to the 'nsIFILEfoxTextFileRead' interface, or a falsy
     *  value on failure.
     *
     *  The returned data object should be assigned to a private local variable inside the calling function and later
     *  accessed via closure to prevent exposing it to other scripts on the page.
     *
     *  @param  strUPFile           String          A string identifying the requesting application's upload policy
     *                                              for file contents.  Only valid upload policies are accepted.
     *                                              Valid upload policies for file contents are:
     *
     *                                              'upload_policy_file_never'      File contents are never uploaded.
     *                                              'upload_policy_file_always'     File contents are always uploaded.
     *                                              'upload_policy_file_asks_later' Application will later ask the
     *                                                                              user for permission to upload.
     *
     *  @param  strUPDerivedData    String          A string identifying the requesting application's upload policy
     *                                              for data derived from file contents.  Only valid upload policies
     *                                              are accepted.  Valid upload policies for derived data are:
     *
     *                                              'upload_policy_derived_data_never'      Derived data is never uploaded.
     *                                              'upload_policy_derived_data_always'     Derived data is always uploaded.
     *                                              'upload_policy_derived_data_asks_later' Application will later ask the
     *                                                                                      user for permission to upload.
     *
     *  @param  strApplicationName  String          A short textual name identifying the JavaScript
     *                                              application requesting the file.  The application will be
     *                                              identified to the user by this name.
     *
     *  @param  strMessageToUser    String          A longer textual request message providing file loading
     *                                              instructions to the user, and explaining why the
     *                                              JavaScript application is requesting the file.
     */
    requestLoadASCIIFile:       function(strUPFile, strUPDerivedData, strApplicationName, strMessageToUser) {
                                    // Get a reference to the DOM window to be able to communicate with the user:
                                    var window_mediator = this._obtainComponentService(
                                                                    null,
                                                                    '@mozilla.org/appshell/window-mediator;1',
                                                                    Components.interfaces.nsIWindowMediator);
                                    var window = window_mediator && window_mediator.getMostRecentWindow('navigator:browser');
                                    if (!window) return null;

                                    if (!this._doConfirmationMsg(   window,
                                                                    window_mediator,
                                                                    strUPFile,
                                                                    strUPDerivedData,
                                                                    strApplicationName,
                                                                    strMessageToUser)) return null;

                                    // Obtain the user's Desktop directory:
                                    var directory_service = this._obtainComponentService(
                                                                    window,
                                                                    '@mozilla.org/file/directory_service;1',
                                                                    Components.interfaces.nsIProperties);
                                    if (!directory_service) return null;

                                    var fileDesktop = directory_service.get('Desk', Components.interfaces.nsIFile);
                                    if (!fileDesktop || !fileDesktop.path) {
                                        window.alert("nsFILEfox error:  Unable to determine the user's desktop directory.");
                                        return null;
                                    }

                                    // Display the file picker:
                                    const nsi_file_picker = Components.interfaces.nsIFilePicker;
                                    var file_picker = this._obtainComponentInstance(
                                                                    window,
                                                                    '@mozilla.org/filepicker;1',
                                                                    nsi_file_picker);
                                    if (!file_picker) return null;

                                    file_picker.init(window, "Loading an ASCII text file for website via the FILEfox Firefox extension.", nsi_file_picker.modeOpen);
                                    file_picker.appendFilters(nsi_file_picker.filterAll);

                                    var ret = file_picker.show();
                                    if (ret !== nsi_file_picker.returnOK) return null;

                                    var file = file_picker.file;
                                    if (!file || !file.path) {
                                        window.alert("nsFILEfox error:  Unable to determine which file the user has decided to open.");
                                        return null;
                                    }

                                    var file_input_stream = this._obtainComponentInstance(
                                                                    window,
                                                                    '@mozilla.org/network/file-input-stream;1',
                                                                    Components.interfaces.nsIFileInputStream);
                                    if (!file_input_stream) return null;

                                    file_input_stream.init(file, 1, 0, false);

                                    var converter_input_stream = this._obtainComponentInstance(
                                                                    window,
                                                                    '@mozilla.org/intl/converter-input-stream;1',
                                                                    Components.interfaces.nsIConverterInputStream);
                                    if (!converter_input_stream) return null;

                                    var strEncoding = 'us-ascii';

                                    converter_input_stream.init(
                                                            file_input_stream,
                                                            strEncoding,
                                                            file_input_stream.available(),
                                                            converter_input_stream.DEFAULT_REPLACEMENT_CHARACTER);

                                    var arrContents = [];
                                    for (var isThereMore = true; isThereMore;) {
                                        var objRead = {};
                                        var totalToRead = file_input_stream.available();
                                        isThereMore = converter_input_stream.readString(totalToRead, objRead);
                                        arrContents.push(objRead.value);
                                    }

                                    converter_input_stream.close();

                                    // The following splits the string with the text file contents into a line by line array.
                                    var strContents = arrContents.join("");
                                    var arrSplit = strContents.split(/(\r\n|\r|\n)/);
                                    // The 'arrSplit' variable is an array where the line text and the line delimiters are at separate indices.
                                    // Need to process that into another array where the line delimiters are appended to the ends of their associated lines.
                                    var arrLines = [];
                                    var strLine = "";
                                    for (var i = 0; i < arrSplit.length; i ++) {
                                        strLine += arrSplit[i];
                                        if (strLine.match(/\r\n|\r|\n/)) {
                                            arrLines.push(strLine);
                                            strLine = "";
                                        }
                                    }
                                    if (strLine) arrLines.push(strLine);

                                    var file_fox_text_file = this._obtainComponentInstance(
                                                                    window,
                                                                    '@marat.nepomnyashy/ns_file_fox_text_file_read_out;1',
                                                                    Components.interfaces.nsIFILEfoxTextFileReadOut);
                                    file_fox_text_file.setData(strEncoding, strContents.length, arrLines.length, arrLines);
                                    return file_fox_text_file;
                                },

    _analyzeURL:                function(strURL) {
                                    if (!strURL) return null;

                                    var arrURLBreakdown = strURL.match(/^((\w+):\/\/(([\d\w-]+\.)*([\d\w-]+))(:\d+)?)\/.*$/);
                                    var strServerAddress = arrURLBreakdown && arrURLBreakdown.length > 1 && arrURLBreakdown[1];
                                    var strProtocol = arrURLBreakdown && arrURLBreakdown.length > 2 && arrURLBreakdown[2];
                                    var strServer = arrURLBreakdown && arrURLBreakdown.length > 3 && arrURLBreakdown[3];
                                    var strPort = arrURLBreakdown && arrURLBreakdown.length > 4 && arrURLBreakdown[4];

                                    if (strProtocol == 'http' && !strPort) strPort = 80;
                                    if (strProtocol == 'https' && !strPort) strPort = 443;

                                    var arrURLBreakdownForFile = strURL.match(/^(file:\/\/\/(.+))$/);
                                    strProtocol = strProtocol || arrURLBreakdownForFile && arrURLBreakdownForFile.length > 1 && 'file';
                                    var strOriginAddress = arrURLBreakdownForFile && arrURLBreakdownForFile.length > 0 && arrURLBreakdownForFile[1];
                                    var strFilename = arrURLBreakdownForFile && arrURLBreakdownForFile.length > 1 && arrURLBreakdownForFile[2];

                                    if (!strOriginAddress) strOriginAddress = strServerAddress;

                                    return  {
                                                protocol:       strProtocol,
                                                server:         strServer,
                                                port:           strPort,
                                                origin_addr:    strOriginAddress,
                                                server_addr:    strServerAddress,
                                                filename:       strFilename,
                                                url:            strURL
                                            };
                                },

    _determineIfDomainsDiffer:  function(objURLData1, objURLData2) {
                                    if (!objURLData1 || !objURLData2) return true;                      // Non-existant addresses are considered different domains.
                                    if (objURLData1.protocol != objURLData2.protocol) return true;      // Different protocols are considered different domains.
                                    if (objURLData1.port != objURLData2.port) return true;              // Different port numbers are considered different domains.
                                                                                                        // For now just comparing "origin addresses".
                                    if (!objURLData1.strOriginAddress || !objURLData2.strOriginAddress || (objURLData1.strOriginAddress != objURLData2.strOriginAddress)) return true;

                                    return false;
                                },

    _doConfirmationMsg:         function(window, window_mediator, strUPFile, strUPDerivedData, strApplicationName, strMessageToUser) {
                                    var strUPFileDesc = null, strUPDerivedDataDesc = null;

                                    switch (strUPFile) {
                                        case 'upload_policy_file_never':
                                            strUPFileDesc = "File contents are never uploaded.";
                                            break;
                                        case 'upload_policy_file_always':
                                            strUPFileDesc = "File contents are always uploaded.";
                                            break;
                                        case 'upload_policy_file_asks_later':
                                            strUPFileDesc = "Application will later ask the user for permission to upload file contents.";
                                            break;
                                    }

                                    switch (strUPDerivedData) {
                                        case 'upload_policy_derived_data_never':
                                            strUPDerivedDataDesc = "Derived data is never uploaded.";
                                            break;
                                        case 'upload_policy_derived_data_always':
                                            strUPDerivedDataDesc = "Derived data is always uploaded.";
                                            break;
                                        case 'upload_policy_derived_data_asks_later':
                                            strUPDerivedDataDesc = "Application will later ask the user for permission to upload derived data.";
                                            break;
                                    }

                                    var arrMessageFromDOM = strMessageToUser && strMessageToUser.split(/\s/);
                                    var arrMessageFromDOMLines = [];
                                    for (var i = 0; i < arrMessageFromDOM.length;) {
                                        var line = "", maxlen = 75;
                                        for (; i < arrMessageFromDOM.length; i++) {
                                            if (line.length == 0 && arrMessageFromDOM[i].length >= maxlen) {
                                                line = arrMessageFromDOM[i];
                                                i++;
                                                break;
                                            } else if ((line.length + arrMessageFromDOM[i].length) >= maxlen) {
                                                break;
                                            } else {
                                                if (line.length > 0) line += " ";
                                                line += arrMessageFromDOM[i];
                                            }
                                        }
                                        if (line.length > 0) arrMessageFromDOMLines.push(line);
                                    }

                                    var arrMessage = [];
                                    arrMessage.push(        "A website-embedded JavaScript application identifying itself as '", strApplicationName, "' is requesting to load an ASCII text file through the FILEfox Firefox extension.\r\n\r\n");

                                    if (strUPFileDesc) {
                                        arrMessage.push(    "Application-advertised file contents upload policy for this request:  ", strUPFileDesc, "\r\n");
                                    } else {
                                        arrMessage.push(    "The application did not specify a valid upload policy for file contents.  Valid upload policies for file contents are:\r\n",
                                                            "    *  'upload_policy_file_never'\r\n",
                                                            "       File contents are never uploaded.\r\n",
                                                            "    *  'upload_policy_file_always'\r\n",
                                                            "       File contents are always uploaded.\r\n",
                                                            "    *  'upload_policy_file_asks_later'\r\n",
                                                            "       Application will later ask the user for permission to upload.\r\n\r\n");
                                    }
                                    if (strUPDerivedDataDesc) {
                                        arrMessage.push(    "Application-advertised derived data upload policy for this request:  ", strUPDerivedDataDesc, "\r\n");
                                    } else {
                                        arrMessage.push(    "The application did not specify a valid upload policy for derived data.  Valid upload policies for derived data are:\r\n",
                                                            "    *  'upload_policy_derived_data_never'\r\n",
                                                            "       Derived data is never uploaded.\r\n",
                                                            "    *  'upload_policy_derived_data_always'\r\n",
                                                            "       Derived data is always uploaded.\r\n",
                                                            "    *  'upload_policy_derived_data_asks_later'\r\n",
                                                            "       Application will later ask the user for permission to upload.\r\n");
                                    }
                                    arrMessage.push(        "\r\n");

                                    if (!strUPFileDesc || !strUPDerivedDataDesc) {
                                        arrMessage.push(    "This file request has been aborted because the requesting JavaScript application has not specified valid upload policie(s) supported in this FILEfox extension version ", this.getVersion(), ".\r\n\r\n");
                                    }

                                    arrMessage.push(        "Warning:  Malicious applications may not honor advertised upload policies.\r\n\r\n");

                                    arrMessage.push(        "The JavaScript application is operating through a series of JavaScript routines downloaded from the following server(s) / domain(s):\r\n\r\n");

                                    var totalScripts3rdParty = 0;

                                    var arrServers = this._obtainListOrigins(window_mediator);
                                    for (var i = 0; i < arrServers.length; i++) {
                                        var objServer = arrServers[i];
                                        arrMessage.push(    "   *  ", objServer.origin_addr);
                                        if (objServer.isScript3rdParty) {
                                            for (var j = objServer.origin_addr.length; j < 50; j++) {           // This makes the 3rd party script warnings are relatively aligned.
                                                arrMessage.push(" ");
                                            }
                                            arrMessage.push(    "  <-- 3-rd party script");

                                            totalScripts3rdParty++;
                                        }
                                        arrMessage.push(    "\r\n");
                                    }

                                    arrMessage.push(        "\r\n");

                                    if (totalScripts3rdParty > 0) {
                                        arrMessage.push(    "Warning:  Detected at least " + totalScripts3rdParty + " 3-rd party script(s) involved in this file loading request.  ");
                                        arrMessage.push(    "3-rd party JavaScript can be legitimate, but it is also known to be used by malicious servers for cross-site scripting (XSS) attacks.  ");
                                        arrMessage.push(    "Such a malicious XSS \"attack\" could upload your private file to the malicious 3-rd party server.\r\n\r\n");
                                    }

                                    if (!strUPFileDesc || !strUPDerivedDataDesc) {
                                        window.alert(arrMessage.join(""));
                                        return false;
                                    }

                                    arrMessage.push(        "Do not continue with the file loading process if you do not trust any one of the server(s) / domain(s) listed above.\r\n\r\n");

                                    if (arrMessageFromDOMLines.length > 0) {
                                        arrMessage.push(    "Message from the JavaScript application:  ",
                                                            "\r\n\r\n");
                                        for (var i = 0; i < arrMessageFromDOMLines.length; i++) {
                                            arrMessage.push(" -->  ", arrMessageFromDOMLines[i], "\r\n");
                                        }
                                        arrMessage.push(    "\r\n",
                                                            "Use your discretion regardless of what the message above says.  ");
                                    } else {
                                        arrMessage.push(    "The application has not provided an explanation as to which file it is requesting, or why.  ",
                                                            "Therefore, continuing not recommended.  ");
                                    }
                                    arrMessage.push(        "\r\n\r\n",
                                                            "Do not load files containing authentication, operating system configuration, or financial information.  ",
                                                            "Make sure to read the information at [Tools -> FILEfox -> About] before using this feature.  ",
                                                            "\r\n\r\n",
                                                            "Are you sure you want to continue to the file selection dialog box?");

                                    return window.confirm(arrMessage.join(""));
                                },

    _obtainComponentClass:      function(window, strComponentContractID) {
                                    var objComponent = Components.classes[strComponentContractID];
                                    if (!objComponent) {
                                        if (window) window.alert("nsFILEfox error:  Unable to obtain the XPCOM class with the contract ID of '" + strComponentContractID + "'.");
                                        return null;
                                    }
                                    return objComponent;
                                },

    _obtainComponentInstance:   function(window, strComponentContractID, objInterface) {
                                    try {
                                        var objComponent = this._obtainComponentClass(window, strComponentContractID);
                                        if (!objComponent) return null;

                                        var objInstance = objComponent.createInstance(objInterface);
                                        if (!objInstance) {
                                            if (window) window.alert("nsFILEfox error:  Unable to create an instance of the XPCOM class with the contract ID of '" + strComponentContractID + "'.");
                                            return null;
                                        }
                                        return objInstance;
                                    } catch (e) {
                                        if (window) {
                                            window.alert("nsFILEfox error:  Unable to create an instance of the XPCOM class with the contract ID of '" + strComponentContractID + "'.  Caught exception: " + e);
                                            return null;
                                        } else {
                                            throw e;
                                        }
                                    }
                                },

    _obtainComponentService:    function(window, strComponentContractID, objInterface) {
                                    try {
                                        var objComponent = this._obtainComponentClass(window, strComponentContractID);
                                        if (!objComponent) return null;

                                        var objService = objComponent.getService(objInterface);
                                        if (!objService) {
                                            if (window) window.alert("nsFILEfox error:  Unable to obtain the service of the XPCOM class with the contract ID of '" + strComponentContractID + "'.");
                                            return null;
                                        }
                                        return objService;
                                    } catch (e) {
                                        if (window) {
                                            window.alert("nsFILEfox error:  Unable to obtain the service of the XPCOM class with the contract ID of '" + strComponentContractID + "'.  Caught exception: " + e);
                                            return null;
                                        } else {
                                            throw e;
                                        }
                                    }
                                },

    _obtainListOrigins:         function(window_mediator) {
                                    var mapOrigins = {};
                                    var arrOrigins = [];
                                    var arrStackInfo = this._obtainStackInfo();

                                    var originLast = arrStackInfo.pop();
                                    var strOriginLast = originLast && originLast.origin_addr;

                                    var objWebpageHierarchy = this._obtainWebpageHierarchy(window_mediator);

                                    for (var i = 0; i < arrStackInfo.length; i++) {
                                        var strOriginAddress = arrStackInfo[i].origin_addr;
                                        if (strOriginAddress == strOriginLast) continue;

                                        if (!mapOrigins[strOriginAddress]) {
                                            var isScript3rdParty = false;
                                            var strURLStack = arrStackInfo[i].url;
                                            for (var j = 0; j < objWebpageHierarchy.scripts3rdParty.length; j++) {
                                                var objScript3rdParty = objWebpageHierarchy.scripts3rdParty[j];
                                                if (strURLStack == objScript3rdParty.url_data.url) {
                                                    isScript3rdParty = true;
                                                    break;
                                                }
                                            }

                                            arrOrigins.push(
                                                        {
                                                            isScript3rdParty:   isScript3rdParty,
                                                            origin_addr:        strOriginAddress
                                                        });

                                            mapOrigins[strOriginAddress] = true;
                                        }
                                    }
                                    return arrOrigins;
                                },

    _obtainStackInfo:           function() {
                                    try {
                                        throw new Error("This is not really an error, just a way to obtain the stack info.");
                                    } catch (e) {
                                        var arrStack = e.stack.split(/\r\n|\r|\n/);
                                        arrStack = arrStack.reverse();
                                        var arrStackInfo = [];
                                        for (var i = 0; i < arrStack.length; i++) {
                                            var strScope = arrStack[i];
                                            if (!strScope) continue;

                                            var arrURL = strScope.match(/^.+@(.+)#?:.+$/);
                                            var strURL = arrURL && arrURL.length > 1 && arrURL[1];
                                            if (strURL) arrStackInfo.push(this._analyzeURL(strURL));
                                        }
                                        return arrStackInfo;
                                    }
                                },

    _obtainWebpageHierarchy:    function(window_mediator) {
                                    var arrWebpages = [];
                                    var arrScripts3rdParty = [];

                                    var that = this;

                                    function _processFrames(windowWithFrames) {
                                        if (!windowWithFrames.frames) return;

                                        for (var i = 0; i < windowWithFrames.frames.length; i++) {
                                            var windowFrame = windowWithFrames[i];
                                            _processFrames(windowFrame);

                                            if (!windowFrame.document) continue;

                                            var strURL = windowFrame.document.documentURI;
                                            if (strURL == 'about:blank') continue;

                                            var objURLDataWP = that._analyzeURL(strURL);
                                            if (objURLDataWP.protocol == 'chrome') continue;

                                            var arrScriptSRCs = [];
                                            var arrScripts = windowFrame.document.getElementsByTagName('script');
                                            if (arrScripts) {
                                                for (var j = 0; j < arrScripts.length; j++) {
                                                    var elemScript = arrScripts[j];
                                                    var attrSRC = elemScript.attributes && elemScript.attributes.getNamedItem('src');
                                                    var strSRC = attrSRC && attrSRC.value;
                                                    if (strSRC) {
                                                        var objURLDataScript = that._analyzeURL(strSRC);
                                                        var areDomainsDifferent = that._determineIfDomainsDiffer(objURLDataWP, objURLDataScript);
                                                        var objScript = {
                                                                            isScript3rdParty:   areDomainsDifferent,
                                                                            url_data:           objURLDataScript
                                                                        };
                                                        arrScriptSRCs.push(objScript);
                                                        if (areDomainsDifferent) arrScripts3rdParty.push(objScript);
                                                    }
                                                }
                                            }
                                            arrWebpages.push(
                                                            {
                                                                url_data:   objURLDataWP,
                                                                scripts:    arrScriptSRCs
                                                            });
                                        }
                                    }

                                    var enumeration = window_mediator.getEnumerator('navigator:browser');
                                    while (enumeration.hasMoreElements()) {
                                        _processFrames(enumeration.getNext());
                                    }

                                    return  {
                                                scripts3rdParty:    arrScripts3rdParty,
                                                webpages:           arrWebpages
                                            };
                                }
};

var components = [nsFILEfox, nsFILEfoxTextFileReadOut];
function NSGetModule(compMgr, fileSpec) {
    return XPCOMUtils.generateModule(components);
}
