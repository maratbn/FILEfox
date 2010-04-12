if (!window.extension_FILEfox) {
    window.extension_FILEfox = {
            about: function() {
                let string_bundle = document.getElementById('extension_FILEfox_string_bundle');
                let text = string_bundle.getString('FILEfox.disclamer');
                alert(text);
            }
        }
}