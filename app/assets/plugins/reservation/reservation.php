<?php
require_once 'config.php';

// Defind variables
$json =		array();
$email =	isset( $_POST['reservation__form__email'] ) ? $_POST['reservation__form__email'] : '';
$phone =	isset( $_POST['reservation__form__phone'] ) ? $_POST['reservation__form__phone'] : '';
$name =		isset( $_POST['reservation__form__name'] ) ? $_POST['reservation__form__name'] : '';
$people =	isset( $_POST['reservation__form__people'] ) ? $_POST['reservation__form__people'] : '';
$date =		isset( $_POST['reservation__form__date'] ) ? $_POST['reservation__form__date'] : '';
$time =		isset( $_POST['reservation__form__time'] ) ? $_POST['reservation__form__time'] : '';

// Check if fields are empty
if( !$name ) {
	$json['error']['name'] = 'Please enter your name.';
}
if( !$email ) {
	$json['error']['email'] = 'Please enter your email address.';
}
if( !$phone ) {
	$json['error']['phone'] = 'Please enter your phone number.';
}
if( !$people ) {
	$json['error']['people'] = 'Please enter number of guests.';
}
if( !$date ) {
	$json['error']['date'] = 'Please enter reservation date.';
}
if( !$time ) {
	$json['error']['time'] = 'Please enter reservation time.';
}

// Proceed if no erros found
if( !isset( $json['error'] ) ) {

	// Email message
	$mail_message =  $mail_subject . "\r\n\r\n";
	$mail_message .= "Name: " . $name . "\r\n";
	$mail_message .= "Phone: " . $phone . "\r\n";
	$mail_message .= "Email address: " . $email . "\r\n";
	$mail_message .= "Number of guests: " . $people . "\r\n";
	$mail_message .= "Date: " . $date . "\r\n";
	$mail_message .= "Time: " . $time;

	// Email title
	$mail_headers  = "Content-type: text/plain; charset=utf-8\r\n";
	$mail_headers .= "From: {$email}\r\n";

	// Sending email
	mail( $to_email, $mail_subject, $mail_message, $mail_headers );

	// Return success message
	$json['success'] = 'Your reservation has been processed successfully!';
}

// Return data
echo json_encode( $json );
?>