
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
                    if(response.callback){
                        console.log('Do', response.callback)
                        window[response.callback](response);
                    }else{
                        if(response.code == 200){
                            window.location.replace("/");
                        }
                    }

                }
            });
        });
    })
}

function isJson(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
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

let userbtn = document.querySelector('#user-menu-button')
if(userbtn){
    $('#user-menu-button').click(function() {
        setTimeout(function() { $('#userDrop').removeClass('hidden') }, 10)
    });

    $('body:not(#userDrop)').click(function() {
        $('#userDrop').addClass('hidden');
    });

    $('#disco').click(() => {
        $.post("/disconnect",
            {
                action: "Disconnect",
            },
            function(data, status){
                console.log("Data: " + data.success + "\nStatus: " + status);
                if(data.success){
                    window.location.replace('/login')
                }else{
                    alert("Il semblerait qu'il y ait eu une erreur.")
                }
            });
    });


}

let btnDeleteAccount = document.querySelector('#btnDeleteAccount')
if(btnDeleteAccount){
    let cancelDeleteAccount = document.querySelector('#cancelDeleteAccount')
    let modalDeleteAccount = document.querySelector('#modalDeleteAccount')

    btnDeleteAccount.onclick = () => {
        modalDeleteAccount.classList.remove('hidden')
    }
    cancelDeleteAccount.onclick = () => {
        modalDeleteAccount.classList.add('hidden')
    }
}

function authError(info){
    let error = document.querySelector('#error')
    if (error) error.innerHTML = info.errorMsg
}

function userModal(info){
    console.log("Disp modal")
    let modal = document.querySelector("#modalResponseChanges")
    let title = modal.querySelector('#modal-title')
    let desc = modal.querySelector('#modal-desc')
    let button = modal.querySelector('#modal-button')

    title.innerHTML = info.title
    desc.innerHTML = info.desc
    button.onclick = () => {
        window.location.href = window.location.href.split( '#' )[0];
    }

    modal.classList.remove('hidden')
}

//RGPD
let dataUsage = document.querySelector("#data-usage")
if (dataUsage) {
    let text = dataUsage.querySelector('#text')
    let revealOrHide = dataUsage.querySelector('#revealText')
    let accept = dataUsage.querySelector('#btnAcceptPrivacy')
    let decline = dataUsage.querySelector('#btnDeclinePrivacy')

    revealOrHide.onclick = () => {
        text.classList.toggle('hidden')
        revealOrHide.classList.toggle('rotate-180')
    }

    accept.onclick = () => {
        $.post("/privacy",
            {accept: true},
            function(data, status){
                console.log("Data: " + data + "\nStatus: " + status);
                if(data.code == 200){
                    dataUsage.remove()
                }else{
                    alert("Il semblerait qu'il y ait eu une erreur.")
                }
            }
        );
    }
    decline.onclick = () => {
        $.post("/privacy",
            {accept: false},
            function(data, status){
                console.log("Data: " + data + "\nStatus: " + status);
                if(data.code == 200){
                    dataUsage.remove()
                }else{
                    alert("Il semblerait qu'il y ait eu une erreur.")
                }
            }
        );
    }


}

