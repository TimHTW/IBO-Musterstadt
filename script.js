$(document).ready(function(){

    var url = "process.json";
    var process_id;
    var dates = [];
    var is_initiator_selected = false,
        is_location_selected = false,
        is_status_selected = false;
    var location = "",
        initiator = "",
        status = "";


    load_processes_in_list_group();
    get_timeline();
    get_Prozesslandkarte();
    load_galery();
    load_content_for_filter();
    load_footer_content();

    //Sortierung wird verwendet, um die Prozesse nach dem Startdatum zu sortieren => notwendig für Zeitstrahl
    function SortBykey(a, b){
        var aKey = a.id;
        var bKey = b.id; 
        return ((aKey < bKey) ? -1 : ((aKey > bKey) ? 1 : 0));
    }

    //Zeitstrahl erzeugen
    function get_timeline() {
        var date;
        var all_years_on_timeline = [];

        $.ajax({
            url: url
        }).then(function(data){
            $.each(data.process.children, function(key,val){
                date = val.start.substring(0,10).split("-");
                dates.push({
                    id: Number(date[0]+date[1]+date[2]),
                    year: date[0],
                    month: date[1],
                    day: date[2],
                    name: val.name,
                    description: val.description
                });
                dates.sort(SortBykey);
            });

            $.each(dates, function(i, e){
                var year = dates[i].year;
                var month = dates[i].month;
                var day = dates[i].day;
                var processname = dates[i].name;
                var description = dates[i].description;
                
                if(jQuery.inArray(year, all_years_on_timeline) == -1){
                    $('.timeline').append("<h2>"+year+"</h2>"+
                                            "<ul class='timeline-items'>"+
                                            "<li class='timeline-item'>"+
                                                "<h3>"+processname+"</h3>"+
                                                "<hr>"+
                                                "<p>"+description+"</p>"+
                                                "<hr>"+
                                                "<time>"+day+"."+month+"."+year+"</time>"+
                                            "</li>"+
                                            "</ul>");
                } else {
                    $('.timeline').append("<ul class='timeline-items'>"+
                                            "<li class='timeline-item'>"+
                                                "<h3>"+processname+"</h3>"+
                                                "<hr>"+
                                                "<p>"+description+"</p>"+
                                                "<hr>"+
                                                "<time>"+day+"."+month+"."+year+"</time>"+
                                            "</li>"+
                                            "</ul>");
                }
                all_years_on_timeline.push(year);
            });
        
        });
    }
    //Prozesse in die Sidebar-Suche laden
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

    //Wenn aus der Sidebar-Suche ein Prozess ausgewählt wurde, werden die dazugehörigen Informationen abgerufen und im Tab Teilprozess angezeigt
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
                                                                        "<h3 class='card-header card-warning'>"+val.name+"</h3>"+
                                                                        "<div id='process-card' class='card-block'>"+
                                                                            "<h4 class='card-title'>"+val.description+"</h4>"+
                                                                            "<table class='table-striped'>"+
                                                                                    "<tr>"+
                                                                                    "<th class='col-md-1'>Initiator:</th>"+
                                                                                    "<td class='col-md-2'>"+initiator+"<br /></td>"+
                                                                                    "</tr>"+
                                                                                    "<tr>"+
                                                                                    "<th class='col-md-1'>Ort:</th>"+
                                                                                    "<td class='col-md-2'>"+location+"</td>"+
                                                                                    "</tr>"+
                                                                                    "<tr>"+
                                                                                    "<th class='col-md-1'>Beginn:</th>"+
                                                                                    "<td class='col-md-2'>"+start_date+"</td>"+
                                                                                    "</tr>"+
                                                                                    "<tr>"+
                                                                                    "<th class='col-md-1'>Status:</th>"+
                                                                                    "<td class='col-md-2'>"+status+"</td>"+
                                                                                    "</tr>"+
                                                                                    "<tr>"+
                                                                                    "<th class='col-md-1'>Beteiligte:</th>"+
                                                                                    "<td class='col-md-4'>"+participants+"</td>"+
                                                                                    "</tr>"+
                                                                            "</table>"+
                                                                        "</div>"+
                                                                        "<div class='card-footer card-warning'>"+
                                                                            "<div class='row'></div>"+
                                                                        "</div>"+
                                                                        "</div>"+
                                                                    "</div>");
                    process_number = parseInt(key) + 1;
                    
                    if(val.results.length != 0){
                        $.each(val.results, function(key,val){
                            result = val.name;
                            if(result.substring(result.length-4, result.length) == ".jpg"){
                                $('#process-card').append("<img src='Image/"+process_number+" "+result+"' class='card-img-bottom img-fluid'>");
                            }
                            else{
                                $('#process-card table').append("<tr><th class='col-md-1'>Ergebnis:</th><td class='col-md-2'><a href='PDF/"+process_number+" "+result+".pdf'>"+result+"</td></tr>");
                            }        
                        });
                    }
                    $('#tab-header a[href="#procces"]').tab('show');
                    return false;
                }
            });
        });
    }

    //Prozesslandkarte-Tabele füllen
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
                    $('#content .tab-content #info table tbody').append("<tr>"+
                                                                            "<td class='col-md-5' id='td-name'>"+name+"</td>"+
                                                                            "<td class='col-md-3' id='td-initiator'>"+initiator+"</td>"+
                                                                            "<td class='col-md-2' id='td-location'>"+location+"</td>"+
                                                                            "<td class='col-md-2' id='td-status'>"+status+"</td>"+
                                                                        "</tr>");
                });
            });
    }

    //Bilder in die Galerie laden
    function load_galery() {
        var counter = 3;
        $.ajax({
            url: url
        }).then(function(data){
            $.each(data.process.children, function(key,val){
                    process_number = parseInt(key) + 1;
                    
                    if(val.results.length != 0){
                        $.each(val.results, function(key,val){
                            result = val.name;
                            if(result.substring(result.length-4, result.length) == ".jpg"){
                                if(counter % 3 === 0){
                                    $('#thumbnail-galery').append("<div class='row justify-content-md-center'><div class='col-md-3'><div id='galery-img' class='img-thumbnail'><a href='Image/"+process_number+" "+result+"'><img src='Image/"+process_number+" "+result+"' style='width:100%'></div></div></div>");
                                } else {
                                    $('#thumbnail-galery .row').last().append("<div class='col-md-3'><div id='galery-img' class='img-thumbnail'><a href='Image/"+process_number+" "+result+"'><img  src='Image/"+process_number+" "+result+"' style='width:100%'></div></div>");
                                }
                                counter++;
                            }    
                        });
                    }
            });
        });
    }

    //Filter-Dropdowns mit Daten füllen
    function load_content_for_filter(){
        var status = ["open", "partial opened", "closed"],
            initiators = [];

        $.ajax({
            url: url
        }).then(function(data){

            $.each(data.process.children, function(key,val){
                initiators.push(val.initiator);
            });
            $.each(data.process.stakeholder, function(key,val){
                if (jQuery.inArray(val.id, initiators) != -1){
                    $('#select-initiator').append($('<option>', {
                        id: val.id,
                        value: val.name,
                        text: val.name
                    }));
                }
            });
            $("#select-initiator").prepend("<option value='' selected='selected'>Alle</option>");
            
            $.each(data.process.locations, function(key,val){
                $('#select-location').append($('<option>', {
                    id: val.id,
                    value: val.city,
                    text: val.city
                }));
            });
            $("#select-location").prepend("<option value='' selected='selected'>Alle</option>");

            $.each(status, function(key,val){
                $('#select-status').append($('<option>', {
                    id: key,
                    value: val,
                    text: val
                }));
            });
            $("#select-status").prepend("<option value='' selected='selected'>Alle</option>");
        });
    }

    //Footer mit Kontaktdaten füllen
    function load_footer_content(){
        $.ajax({
            url: url
        }).then(function(data){
            $('#footer').append("<p>"+data.system.contact+" | email: "+data.system.email+" | <a href='"+data.system.website+"'>"+data.system.website+"</a></p>");
        });
    }

    $('#select-initiator').change(function() {
        var visible_locations = [],
            visible_status = [];

        is_initiator_selected = true;

        initiator = $(this).children(":selected").attr("value");

        if (!initiator) {
            is_initiator_selected = false;
        }

        if (is_location_selected || is_status_selected){
            jQuery("#info table tbody tr #td-initiator").each(function() {
                if(!initiator){   
                    jQuery(this).parent().show();
                } else if (jQuery(this).text() == initiator){
                        jQuery(this).parent().show();
                    } else {
                        jQuery(this).parent().hide();
                    }
                });

                jQuery("#info table tbody tr #td-location:visible").each(function(){
                    if(!location){   
                        jQuery(this).parent().show();
                    } else if (jQuery(this).text() == location){
                            jQuery(this).parent().show();
                        } else {
                            jQuery(this).parent().hide();
                        }
                });
            
                jQuery("#info table tbody tr #td-status:visible").each(function(){
                    if(!status){
                        jQuery(this).parent().show();
                    } else if (jQuery(this).text() == status)
                        {
                            jQuery(this).parent().show();
                        } else {
                            jQuery(this).parent().hide();
                        }
                });
        } else {
            jQuery("#info table tbody tr #td-initiator").each(function() {
                if(!initiator){   
                    jQuery(this).parent().show();
                } else if (jQuery(this).text() == initiator){
                        jQuery(this).parent().show();
                    } else {
                        jQuery(this).parent().hide();
                    }
            });
        }
        
        jQuery('#info table tbody tr').each(function(){
            if(jQuery(this).children('#td-initiator').text() == initiator || !initiator){
                visible_locations.push(jQuery(this).children('#td-location').text());
            }
        });

        jQuery('#info table tbody tr').each(function(){
            if(jQuery(this).children('#td-initiator').text() == initiator || !initiator){
                visible_status.push(jQuery(this).children('#td-status').text());
            }
        });

        jQuery('#select-location option').each(function(){
            if (!jQuery(this).val()) {

            } else {
                if(jQuery.inArray(jQuery(this).val(), visible_locations) !== -1)  {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            }
        });

        jQuery('#select-status option').each(function(){
            if (!jQuery(this).val()) {

            } else {   
                if(jQuery.inArray(jQuery(this).val(), visible_status) !== -1)  {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            }
        });
    });

    $('#select-location').change(function() {
        var visible_initiators = [],
            visible_status = [];
        is_location_selected = true;
        location = $(this).children(":selected").attr("value");
        
        if (!location) {
            is_location_selected = false;
        }

        if (is_initiator_selected || is_status_selected){
            jQuery("#info table tbody tr #td-location").each(function() {
                if(!location){   
                    jQuery(this).parent().show();
                } else if (jQuery(this).text() == location){
                        jQuery(this).parent().show();
                    } else {
                        jQuery(this).parent().hide();
                    }
                
                });
                jQuery("#info table tbody tr #td-initiator:visible").each(function(){
                    if(!initiator){   
                        jQuery(this).parent().show();
                    } else if (jQuery(this).text() == initiator){
                            jQuery(this).parent().show();
                        } else {
                            jQuery(this).parent().hide();
                        }
                });
            
                jQuery("#info table tbody tr #td-status:visible").each(function(){
                    if(!status){
                        jQuery(this).parent().show();
                    } else if (jQuery(this).text() == status)
                        {
                            jQuery(this).parent().show();
                        } else {
                            jQuery(this).parent().hide();
                        }
                });
        } else {
            jQuery("#info table tbody tr #td-location").each(function() {
                if(!location){
                    jQuery(this).parent().show();
                } else if (jQuery(this).text() == location)
                    {
                        jQuery(this).parent().show();
                    } else {
                        jQuery(this).parent().hide();
                    }
            });
        }

        jQuery('#info table tbody tr').each(function(){
            if(jQuery(this).children('#td-location').text() == location || !location){
                visible_initiators.push(jQuery(this).children('#td-initiator').text());
            }
        });

        jQuery('#info table tbody tr').each(function(){
            if(jQuery(this).children('#td-location').text() == location || !location){
                visible_status.push(jQuery(this).children('#td-status').text());
            }
        });

        jQuery('#select-initiator option').each(function(){
            if (!jQuery(this).val()) {

            } else {
                if(jQuery.inArray(jQuery(this).val(), visible_initiators) !== -1)  {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            }
        });

        jQuery('#select-status option').each(function(){
            if (!jQuery(this).val()) {

            } else {   
                if(jQuery.inArray(jQuery(this).val(), visible_status) !== -1)  {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            }
        });
    });

    $('#select-status').change(function() {
        var visible_initiators = [],
            visible_locations = [];

            is_status_selected = true;

            status = $(this).children(":selected").attr("value");
        
        if (!status) {
            is_status_selected = false;
        }

        if (is_initiator_selected || is_location_selected){
            jQuery("#info table tbody tr #td-status").each(function() {
             if(!status){   
                jQuery(this).parent().show();
            } else if (jQuery(this).text() == status){
                    jQuery(this).parent().show();
                } else {
                    jQuery(this).parent().hide();
                }
            
            });

            jQuery("#info table tbody tr #td-initiator:visible").each(function(){
                if(!initiator){   
                    jQuery(this).parent().show();
                } else if (jQuery(this).text() == initiator){
                        jQuery(this).parent().show();
                    } else {
                        jQuery(this).parent().hide();
                    }
            });
        
            jQuery("#info table tbody tr #td-location:visible").each(function(){
                if(!location){   
                    jQuery(this).parent().show();
                } else if (jQuery(this).text() == location){
                        jQuery(this).parent().show();
                    } else {
                        jQuery(this).parent().hide();
                    }
            });
            
        } else {
            jQuery("#info table tbody tr #td-status").each(function() {
                if(!status){
                    jQuery(this).parent().show();
                } else if (jQuery(this).text() == status)
                    {
                        jQuery(this).parent().show();
                    } else {
                        jQuery(this).parent().hide();
                    }
            });
        }

        jQuery('#info table tbody tr').each(function(){
            if(jQuery(this).children('#td-status').text() == status || !status){
                visible_initiators.push(jQuery(this).children('#td-initiator').text());
            }
        });

        jQuery('#info table tbody tr').each(function(){
            if(jQuery(this).children('#td-status').text() == status || !status){
                visible_locations.push(jQuery(this).children('#td-location').text());
            }
        });

        jQuery('#select-initiator option').each(function(){
            if (!jQuery(this).val()) {

            } else {
                if(jQuery.inArray(jQuery(this).val(), visible_initiators) !== -1)  {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            }
        });

        jQuery('#select-location option').each(function(){
            if (!jQuery(this).val()) {

            } else {   
                if(jQuery.inArray(jQuery(this).val(), visible_locations) !== -1)  {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            }
        });
    
    });

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

});