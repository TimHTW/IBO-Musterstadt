var process_id;
var url = "process.json";

$.ajax({
    url: url
}).then(function(data){
    $.each(data.process.children, function(key,val){
        $('.grid-container .header #select_process').append($('<option>', {
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
                $('.content').empty();
                $('.content').append("<h4>"+name+"</h4>");
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