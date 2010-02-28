var Signup = {};

Signup.count = 1;

Signup.onAddAnotherClick = function (event) {
    Signup.count++;
    var pdiv = $("#person-1").clone();

    var fixupClone = function () {
        if ( $(this).attr("type") == "text" ) {
            $(this).attr( "value",  "" );
        }

        if ( $(this).attr("for") ) {
            $(this).attr( "for", $(this).attr("for").replace( /-1$/g, "-" + Signup.count ) );
        }

        if ( $(this).attr("name") ) {
            $(this).attr( "name", $(this).attr("name").replace( /-1$/g, "-" + Signup.count ) );
        }

        if ( $(this).attr("checked") ) {
            $(this).attr( "checked", false );
        }

        if ( $(this).attr("id") ) {
            $(this).attr( "id", $(this).attr("id").replace( /-1$/g, "-" + Signup.count ) );
        }
    };

    pdiv.find("*").map(fixupClone);

    pdiv.attr( "id", "person-" + Signup.count );

    pdiv.find(".number").text(Signup.count);

    pdiv.hide();

    pdiv.insertBefore("#add-another-p");

    pdiv.fadeIn("slow");

    Signup.updateTotal();

    event.preventDefault();
};

Signup.onSubmit = function () {
    var errors = [];
    var form = this;

    if ( ! form["submitter-name"].value ) {
        errors.push( "Please tell us your name" );
    }

    if ( ! form["submitter-email"].value && ! form["submitter-phone"].value ) {
        errors.push( "Please provide an email address or phone number" );
    }

    var check = function () {
        var matches = $(this).attr("id").match( /-(\d+)/ );
        var num = matches[1];

        if ( ! form[ "name-" + num ].value ) {
            errors.push( "Please supply a name for Attendee #" + num );
        }

        var found_soup = false;

        var soups = form[ "soup-" + num ];
        for ( var i = 0; i < soups.length; i++ ) {
            if ( soups[i].checked ) {
                found_soup = true;
            }
        }

        if ( ! found_soup ) {
            errors.push( "Please choose a soup for Attendee #" + num );
        }

        var found_entree = false;

        var entrees = form[ "entree-" + num ];
        for ( var i = 0; i < entrees.length; i++ ) {
            if ( entrees[i].checked ) {
                found_entree = true;
            }
        }

        if ( ! found_entree ) {
            errors.push( "Please choose an entree for Attendee #" + num );
        }
    };

    $(this).find(".person").each(check);

    if ( errors.length ) {
        var ul = "<ul>";
        for ( var i = 0; i < errors.length; i ++ ) {
            ul = ul + "<li>" + errors[i] + ".</li>";
        }
        ul = ul + "</ul>";

        $("#errors").empty().append(ul).dialog("open");

        return false;
    }
    else {
        return true;
    }
};

Signup.updateTotal = function () {
    var count = $(".person").length;

    $("#total").text( count == 1
                      ? 35
                      : count == 2
                      ? 60
                      : 75 );
}

Signup.onReady = function () {
    $("#add-another").click( Signup.onAddAnotherClick );
    $("#attendees-form").submit( Signup.onSubmit );

    $("#errors").dialog( { "draggable": false,
                           "modal":     true,
                           "autoOpen":  false,
                           "closeText": "X",
                           "width":     450,
                           "title":    "Please correct these errors" } );

    $("a[rel='gallery']").colorbox( { "current": "", "maxWidth": 700, "maxHeight": 500, "slideShow": true } );
};

$(document).ready( Signup.onReady );
