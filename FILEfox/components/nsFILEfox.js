/**
 *  Copyright (c) 2010 Marat Nepomnyashy
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
                                    var interfaces = [
                                                        Components.interfaces.nsIFILEfox,
                                                        Components.interfaces.nsIClassInfo,
                                                        Components.interfaces.nsISupports
                                                    ];
                                    totalInterfaces.value = interfaces.length;
                                    return interfaces;
                                },

    _xpcom_categories: [{
        category:               "JavaScript global property",
        entry:                  'nsFILEfox'
    }],

    //  Interface nsISupports:
    QueryInterface:             XPCOMUtils.generateQI(
                                                    [
                                                        Components.interfaces.nsIFILEfox,
                                                        Components.interfaces.nsIClassInfo,
                                                        Components.interfaces.nsISupports
                                                    ]),

    // Interface nsIFILEfox:
    version:                    '0.1',

    test:                       function(str) {
                                    return "Returning string \"" + str + "\" from nsFILEfox";
                                }
};

var components = [nsFILEfox];
function NSGetModule(compMgr, fileSpec) {
    return XPCOMUtils.generateModule(components);
}
