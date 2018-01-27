var process_id;
var url = "process.json";
fil_select_box();
load_processes_in_list_group();
get_stakeholder();
get_Prozesslandkarte();

function fil_select_box() {
    $.ajax({
        url: url
    }).then(function(data){
        $.each(data.process.children, function(key,val){
            $('#header #select-box #select_process').append($('<option>', {
                id: val.id,
                value: val.name,
                text: val.name
            }));
        });
    });
}

function get_stakeholder() {
    var akteur,
        name,
        phone,
        email,
        website;
    $.ajax({
        url: url
    }).then(function(data){
        $.each(data.process.stakeholder, function(key, val){
            akteur = val.name;
            $.each(val.contact, function(key,val){
                name = "Max Mustermann";
                phone = "0123456789";
                email = "example@mail.de";
                website = "example-website.com";
            });
            $('#content .tab-content #stakeholder table tbody').append("<tr><td>"+akteur+"</td><td>"+name+"</td><td>"+phone+"</td><td>"+email+"</td><td><a href='#'>"+website+"</a></td></tr>");
        });
    });
}

$('#FindYourProcces').keyup(function(){
    var input = jQuery(this).val();
    jQuery("#list-elements .list-group a").each(function() {
        if (jQuery(this).text().search(new RegExp(input, "i")) < 0) {
            jQuery(this).hide();
        } else {
            jQuery(this).show()
        }
    });
});

$(document).on('click', '#list-elements .list-group a', function(){
    var process_id = $(this).attr("id");
    get_child_process(process_id);
});

$('#select_process').change(function() {
    process_id = $(this).children(":selected").attr("id");
    get_child_process(process_id);
});

function load_processes_in_list_group() {
    $.ajax({
        url: url
    }).then(function(data){
        $.each(data.process.children, function(key,val){
            key = parseInt(key) + 1;
            $('#search-box #list-elements .list-group').append("<a id='"+val.id+"' class='list-element'>"+key+". "+ val.name +"</a>")
        });
    });
}


function get_child_process(id) {
    var process_number;
    var name, description, status, start_date, location_id, initiator_id, initiator, location;
    var participant_ids = [];
    var participants = [];
    $('#content .tab-content #procces').empty();
    $.ajax({
        url: url
    }).then(function(data){
        $.each(data.process.children, function(key,val){
            if (val.id == id){
                 name = val.name;
                 description = val.description;
                 status = val.participation;
                 start_date = val.start;
                 initiator_id = val.initiator;

                 location_id = val.location;

                 $.each(data.process.locations, function(key, val){
                     if (val.id == location_id[0]) {
                         location = val.city;
                     }
                 });
                 
                $.each(data.process.stakeholder, function(key, val){
                    if (val.id == initiator_id) {
                         initiator = val.name;
                    }
                });

                $.each(val.participants, function(key,val){
                    participant_ids.push(val);
                 });

                 $.each(data.process.stakeholder, function(key, val){
                     $.each(participant_ids, function(inner_key, inner_val){
                         if (val.id == inner_val){
                            participants.push(" "+val.name);
                         }
                     });
                 });
                

                $('#content .tab-content #procces').append("<div class='container'>"+
                                                             "<div class='card'>"+
                                                               "<h3 class='card-header card-info'>"+val.name+"</h3>"+
                                                               "<div class='card-block'>"+
                                                                 "<h4 class='card-title'>"+val.description+"</h4>"+
                                                                 "<p class='card-text'>Initiator: <b>"+initiator+"</b></p>"+
                                                                 "<p class='card-text'>Ort: <b>"+location+"</b></p>"+
                                                                 "<p class='card-text'>Beginn: <b>"+start_date+"</b></p>"+
                                                                 "<p class='card-text'>Status: <b>"+status+"</b></p>"+
                                                                 "<p class='card-text'>Beteiligte: <b>"+participants+"</b></p>"+
                                                               "</div>"+
                                                               "<div class='card-footer card-info'>"+
                                                                  "<div class='row'></div>"+
                                                               "</div>"+
                                                             "</div>"+
                                                           "</div>");
                process_number = parseInt(key) + 1;
                
                if(val.results.length != 0){
                    $.each(val.results, function(key,val){
                        result = val.name;
                        if(result.substring(result.length-4, result.length) == ".jpg"){
                            $('.card-block').append("<img src='Image/"+process_number+" "+result+"' class='card-img-bottom img-fluid'>");
                        }
                        else{
                            $('.card-block').append("<p class='card-text'>Ergebnis: <a href='PDF/"+process_number+" "+result+".pdf'>"+result+"</p>");
                        }        
                    });
                }

                // if (val.connection.from.length != 0){
                //     $.each(val.connection.from, function(key,val){
                //         from = val;
                //         $('.card-footer .row').append(from);
                //     });
                // }

                // if (val.connection.to.length != 0){
                //     $.each(val.connection.to, function(key,val){
                //         to = val;
                //         $('.card-footer .row').append("<div class='col align-self-end'>"+to+"</div>");
                //     });
                // }

                $('#tab-header a[href="#procces"]').tab('show');
                return false;
            }
        });
    });
}

function get_Prozesslandkarte(){
    var name,
        initiator_id,
        initiator,
        location_id,
        location,
        status;

        $.ajax({
            url: url
        }).then(function(data){
            $.each(data.process.children, function(key, val){
                name = val.name;
                initiator_id = val.initiator;
                status = val.participation;
                location_id = val.location;

                $.each(data.process.stakeholder, function(key, val){
                    if (val.id == initiator_id) {
                         initiator = val.name;
                    }
                });

                 $.each(data.process.locations, function(key, val){
                     if (val.id == location_id[0]) {
                         location = val.city;
                     }
                 });
                $('#content .tab-content #info table tbody').append("<tr><td>"+name+"</td><td>"+initiator+"</td><td>"+location+"</td><td>"+status+"</td></tr>");
            });
        });
}

// $.ajax({
//     url: "process.json"
// }).then(function(data){
//     var process_list = [];
//     $.each(data.process.children, function(key,val){
//         $.each(val.connection.to, function(key, val) {
//             $("body").append("<li id='" + key + "'>" + val + "</li>" );
//         });
//     });
// });
