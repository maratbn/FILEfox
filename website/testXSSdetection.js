// This JavaScript file is used to test the FILEfox 3-rd party JavaScript / cross-site scripting (XSS) detection mechanism.

function doLoadFileViaXSS() {
    var text_file = window.nsFILEfox.requestLoadASCIIFile(
                                        "FILEfox demo site",
                                        [
                                            "This is the FILEfox demonstration website.  ",
                                            "FILEfox has a security feature that warns the user when it detects 3-rd party JavaScript -- that is JavaScript coming from some domain other than the main webpage domain.  ",
                                            "This file loading request is coming from a domain different from the main webpage domain, and therefore this dialog box should display such a warning in addition to this message from the demo site.  ",
                                            "3-rd party JavaScript can be legitimate, but it is also known to be used by malicious servers for cross-site scripting (XSS) attacks.  ",
                                            "Such a malicious XSS \"attack\" could upload your private file to the malicious 3-rd party server."
                                        ].join(""));
    if (!text_file) {
        alert("Demonstration website:  Could not get a file via the FILEfox Firefox extension.  The user has either canceled, or there was an error in some part of the loading process.");
        return;
    }

    alert(
        [
            "Demonstration website:  ",
            "File loading has been approved by the user.  ",
            "Had this 3-rd party JavaScript been malicious, it would likely be uploading your file to its malicious server by now."
        ].join(""));

    text_file_view.displayTextFile(text_file);
}