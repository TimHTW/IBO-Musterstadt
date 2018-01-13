var process_id;
var url = "process.json";
get_stakeholder();
$.ajax({
    url: url
}).then(function(data){
    $.each(data.process.children, function(key,val){
        $('#header #select_process').append($('<option>', {
            id: val.id,
            value: val.name,
            text: val.name
        }));
    });
});

$('#select_process').change(function() {
    process_id = $(this).children(":selected").attr("id");
    get_child_process(process_id);
});

function get_child_process(id) {
    $.ajax({
        url: url
    }).then(function(data){
        $.each(data.process.children, function(key,val){
            if (val.id == id){
                var name = val.name;
                var description = val.description;
                $('#content .tab-content #procces').empty();
                $('#content .tab-content #procces').append("<h4>"+name+"</h4>");
                $('#mytabs a[href="#procces"]').tab('show');
                return false;
            }
        });
    });
}

function get_stakeholder() {
    var name,
        email,
        website;
    $.ajax({
        url: url
    }).then(function(data){
        $.each(data.process.stakeholder, function(key, val){
            name = val.name;
            $.each(val.contact, function(key,val){
                email = "example@mail.de";
                website = "example-website.com";
            });
            $('#content .tab-content #stakeholder table tbody').append("<tr><td>"+name+"</td><td>"+email+"</td><td>"+website+"</td></tr>");
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