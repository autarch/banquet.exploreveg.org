#!/usr/bin/perl

use strict;
use warnings;

use CGI;
use Email::Sender::Simple qw( sendmail );
use Email::Simple;
use Email::Simple::Creator;

my %uris = (
    1 =>
'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3026543',
    2 =>
'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3026624',
    family =>
'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3026661',
);

my $cgi = CGI->new();

my $body = "Purchaser: " . $cgi->param('submitter-name') . "\n\n";

if ( $cgi->param('submitter-email') ) {
    $body .= "Email: " . $cgi->param('submitter-email') . "\n\n";
}

if ( $cgi->param('submitter-phone') ) {
    $body .= "Phone: " . $cgi->param('submitter-phone') . "\n\n";
}

my $x = 1;
while ( $cgi->param("name-$x") ) {
    $body .= "Attendee #$x\n";
    $body .= '-' x 40;
    $body .= "\n\n";

    $body .= "Name:   " . $cgi->param("name-$x") . "\n";
    $body .= "Soup:   " . $cgi->param("soup-$x") . "\n";
    $body .= "Entree: " . $cgi->param("entree-$x") . "\n";

    $body .= "\n";

    $x++;
}

my $email = Email::Simple->create(
    header => [
        From    => 'dave@exploreveg.org',
        To      => 'dave@exploreveg.org',
        Subject => 'Banquet sign-up',
    ],
    body => $body,
);

sendmail($email);

my $uri = $uris{ $x - 1 } ? $uris{ $x - 1 } : $uris{family};

print $cgi->redirect($uri);
