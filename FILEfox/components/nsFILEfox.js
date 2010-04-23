/**
 *  Copyright (c) 2010 Marat Nepomnyashy    maratbn@gmail
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
     *  Causes the FILEfox extension to request from the user to manually select an ASCII text file to load.  The
     *  function will then initiate a synchroneous file loading process, and at the conclusion return an object
     *  corresponding to the 'nsIFILEfoxTextFile' contract with the file contents, or a falsy value on failure.
     *
     *  @param  strMessageToUser    String                  A textual request message to display to the user, possibly
     *                                                      explaining why the application is requesting an ASCII text
     *                                                      file.
     */
    requestASCIIFile:           function(strMessageToUser, observer) {
                                    // Get a reference to the DOM window to be able to communicate with the user:
                                    var window_mediator = this._obtainComponentService(
                                                                    null,
                                                                    '@mozilla.org/appshell/window-mediator;1',
                                                                    Components.interfaces.nsIWindowMediator);
                                    var window = window_mediator && window_mediator.getMostRecentWindow(null);
                                    if (!window) return null;

                                    if (!window.confirm(this._generateConfirmationMsg(window, strMessageToUser))) return null;

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

                                    var strContents = arrContents.join("");
                                    var arrLines = strContents.split(/(\r\n|\r|\n)/);

                                    var file_fox_text_file = this._obtainComponentInstance(
                                                                    window,
                                                                    '@marat.nepomnyashy/ns_file_fox_text_file_read_out;1',
                                                                    Components.interfaces.nsIFILEfoxTextFileReadOut);
                                    file_fox_text_file.setData(strEncoding, strContents.length, arrLines.length, arrLines);
                                    return file_fox_text_file;
                                },

    _generateConfirmationMsg:   function(window, strMessageToUser) {
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
                                    arrMessage.push(        "A JavaScript application embedded in this website is requesting to load an ASCII text file through the FILEfox Firefox extension.  ");
                                    
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

                                    return arrMessage.join("");
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
                                }
};

var components = [nsFILEfox, nsFILEfoxTextFileReadOut];
function NSGetModule(compMgr, fileSpec) {
    return XPCOMUtils.generateModule(components);
}
