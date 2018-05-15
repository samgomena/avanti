<?php
require_once 'config.php';

// Defind variables
$json =		array();
$email =	isset( $_POST['contact__form__email'] ) ? $_POST['contact__form__email'] : '';
$name =		isset( $_POST['contact__form__name'] ) ? $_POST['contact__form__name'] : '';
$message =	isset( $_POST['contact__form__message'] ) ? $_POST['contact__form__message'] : '';

// Check if fields are empty
if( !$name ) {
	$json['error']['name'] = 'Please enter your name.';
}
if( !$email ) {
	$json['error']['email'] = 'Please enter your email address.';
}
if( !$message ) {
	$json['error']['message'] = 'Please enter your message.';
}

// Proceed if no erros found
if( !isset( $json['error'] ) ) {

	// Email message
	$mail_message =  $mail_subject . "\r\n\r\n";
	$mail_message .= "Name: " . $name . "\r\n";
	$mail_message .= "Email address: " . $email . "\r\n";
	$mail_message .= "Message: " . $message;

	// Email title
	$mail_headers  = "Content-type: text/plain; charset=utf-8\r\n";
	$mail_headers .= "From: {$email}\r\n";

	// Sending email
	mail( $to_email, $mail_subject, $mail_message, $mail_headers );

	// Return success message
	$json['success'] = 'Your message has been sent successfully!';
}

// Return data
echo json_encode( $json );
?>