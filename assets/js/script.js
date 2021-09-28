
attribuateForm()
function attribuateForm(){
    let forms = $('form')
    forms.each(function() {
        let form = $(this)
        $(this).find('button[data-submit="true"]').click(function() {
            let data = getFormJSON(form);
            console.log(data)
            $.ajax({
                url     : form.attr('action'),
                type    : form.attr('method'),
                data    : data,
                success : function( response ) {
                    console.log(response);
                    if(response.code == 200){
                        window.location.replace("/");
                    }
                    if(response.code == 201){
                        window.location.replace("/m/"+response.server);
                    }
                }
            });
        });
    })
}


function getFormJSON(form){

    let isFormValid = true;

    form.find('input').each(function (){
        if($(this).val() == null || $(this).val() == ""){
            borderingInput($(this), true)
            isFormValid = false
            console.log(isFormValid, $(this).attr('name'))
            return false;
        }else{
            borderingInput($(this), false)
        }
    })

    if(isFormValid) {
        let indexed_array = serializeControls(form);

        function serializeControls(form) {
            var data = {};

            function buildInputObject(arr, val) {
                if (arr.length < 1)
                    return val;
                var objkey = arr[0];
                if (objkey.slice(-1) == "]") {
                    objkey = objkey.slice(0, -1);
                }
                var result = {};
                if (arr.length == 1) {
                    result[objkey] = val;
                } else {
                    arr.shift();
                    var nestedVal = buildInputObject(arr, val);
                    result[objkey] = nestedVal;
                }
                return result;
            }

            $.each(form.serializeArray(), function () {
                var val = this.value;
                var c = this.name.split("[");
                var a = buildInputObject(c, val);
                $.extend(true, data, a);
            });

            return data;
        }

        form.find('input[type="checkbox"]:not(:checked)').each(function () {
            indexed_array[this.name] = "off";
        });

        if (indexed_array.hasOwnProperty('resource_name')) {
            let resources_names = indexed_array['resource_name'];
            let resources_urls = indexed_array['resource_url'];
            let resources = [];
            for (const [key, value] of Object.entries(resources_names)) {
                let resource = {};
                resource['name'] = value;
                resource['url'] = resources_urls[key];
                resources.push(resource);
            }
            indexed_array['resources'] = JSON.stringify(resources);
            delete indexed_array['resource_name'];
            delete indexed_array['resource_url'];
        }

        return indexed_array;
    }else{
        console.log('form pas valide')
    }

    function borderingInput(elmt, add){
        if(add){
            elmt.addClass("ring ring-red-400 border-red-400")
        }else{
            elmt.removeClass("ring ring-red-400 border-red-400")
        }
    }
}
