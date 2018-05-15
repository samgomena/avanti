/**
 * Contact form
 */

"use strict";

var contact = (function() {

	// Variables
	var form =			$('#contact__form');
	var formName = 		$('#contact__form__name');
	var formEmail = 	$('#contact__form__email');
	var formMessage = 	$('#contact__form__message');
	var formSubmit = 	form.find('[type="submit"]');
	var formActionUrl = 'assets/plugins/contact/contact.php';

	// Methods
	function submitForm($this) {

		$.ajax({
			url: formActionUrl,
			type: 'POST',
			data: $this.serialize(),
			dataType: 'json',
			beforeSend: function (XMLHttpRequest) {

				// Disable submit button
				formSubmit.prop('disabled', true);

				// Clear error messages
				form.find('.is-invalid').removeClass('is-invalid');
				form.find('.invalid-feedback').html('');

			},
			success: function( json, textStatus ) {

				// Enable submit button
				formSubmit.prop('disabled', false);

				function showError(elem, message) {
					elem.addClass('is-invalid');
					elem.next('.invalid-feedback').html(message);
				}

				if( json.error ) {

					// Proceed error messages
					if ( json.error.name ) {
						showError(formName, json.error.name);
					}
					if ( json.error.email ) {
						showError(formEmail, json.error.email);
					}
					if ( json.error.message ) {
						showError(formMessage, json.error.message);
					}
				}

				// Proceed success message
				if( json.success ) {

					// Show alert message
					$(document).trigger('touche.alert.show', ['success', json.success]);

					// Reset form fields
					form[0].reset();
				}
			}
		});

	}

	// Process form
	form.on('submit', function() {
		submitForm( $(this) );
		return false;
	});

})();