var process_id;
var url = "process.json";
fil_select_box();
load_processes_in_list_group();
get_stakeholder();

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
    $('#content .tab-content #procces').empty();
    $.ajax({
        url: url
    }).then(function(data){
        $.each(data.process.children, function(key,val){
            if (val.id == id){
                $('#content .tab-content #procces').append("<h1>"+val.name+"</h1>");
                $('#content .tab-content #procces').append("<h2>"+val.description+"</h2>");
                $('#content .tab-content #procces').append("<h3>"+val.initiator+"</h3>");
                $('#content .tab-content #procces').append("<h4>"+val.start+"</h4>");
                process_number = parseInt(key) + 1;
                
                if(val.results.length != 0){
                    $.each(val.results, function(key,val){
                        result = val.name;
                        if(result.substring(result.length-4, result.length) == ".jpg"){
                            $('#content .tab-content #procces').append("<img src='Image/"+process_number+" "+result+"'>");
                        }
                        else{
                            $('#content .tab-content #procces').append("<embed src='PDF/"+process_number+" "+result+".pdf'>");
                        }        
                    });
                }

                $('#tab-header a[href="#procces"]').tab('show');
                return false;
            }
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