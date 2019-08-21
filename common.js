$(document).ready(function () {

    Lnx_Init = function () {

        var common = ({
            inputlist: $('#InputListSimilarity'),
            selectdog: $('#SelectRacaDog'),
            inputdog: $('#InputRacaDog'),
            apelidodog: $('#ApelidoDog'),
            selectcor: $('#SelectCor'),
            selectfont: $('#SelectFont'),
            imagedog: $('#ImageDog'),
            dogtext: $('#DogText')
        });

        (function Lnx_DogSelect() {

            $.each(arrayraces, function (i, race) {
                common.selectdog.append('<option value="' + race + '">' + race + '</option>');
            });

        }());

        (function Lnx_DogInput() {

            common.inputdog.keyup(function (e) {

                if ($(e.target).val() != "" && $(e.target).val().length >= 1) {

                    common.selectdog.attr('disabled', 'true');
                    common.inputlist.html('');
                    common.selectdog.val('defalt');

                    var listraces = $.map(arrayraces, function (race) {
                        if ($(e.target).val().toLowerCase() == race) {
                            Lnx_GridImg(race);
                            common.inputlist.css('display', 'none');
                            $(e.target).next().addClass('lnx_select-selected');
                            return race;
                        }
                        else if (race.indexOf($(e.target).val().toLowerCase()) != -1) {
                            common.inputlist.css('display', 'block');
                            var $list = $('<li class="lnx_input-list-item">' + race + '</li>');
                            common.inputlist.append($list);
                            $list.click(function () {
                                Lnx_GridImg($(this).text());
                                $(e.target).val($(this).text());
                                common.inputlist.css('display', 'none');
                            });
                            return race;
                        }
                    });

                    if (listraces.length == 0) {
                            $('#NoRaces').remove();
                            common.inputlist.css('display', 'none');
                            common.inputlist.parent().after('<div id="NoRaces" class="lnx_no-races lnx_primary-text"> Nenhuma raça encontrada </div>');
                    } else if (listraces.length > 1) {
                        $(e.target).next().addClass('lnx_select-selected');
                        $('#NoRaces').remove(),
                            common.inputlist.css('display', 'block')
                    }

                } else {
                    common.selectdog.removeAttr('disabled');
                    $(e.target).next().removeClass('lnx_select-selected');
                    $('#NoRaces').remove(),
                        common.inputlist.css('display', 'none'),
                        common.inputlist.html('');
                }

            });

        }());

        (function Lnx_DogMountGrid() {

            Lnx_GridImg = function (race) {
                $.ajax({
                    url: "https://dog.ceo/api/breed/" + race + "/images/random",
                    type: "GET",
                    success: function (data) {
                        common.imagedog.html('');
                        common.imagedog.append('<img src="' + data.message + '" width="230" height="230">');
                        $('#NomeDog').html(race);
                    }
                });
            };

        }());

        (function Lnx_DogNickAtt() {

            common.apelidodog.change(function (event) {
                if ($(this).val() != "") {
                    $('#NickDog').html(' (' + $(this).val() + ')');
                }
            });

        }());

        (function Lnx_DogChangeData() {

            common.selectdog.change(function (event) {

                if ($(this).val() == "defalt") {
                    $(this).next().removeClass('lnx_select-selected');
                    common.inputdog.removeAttr('disabled');
                } else {
                    $(this).next().addClass('lnx_select-selected');
                    Lnx_GridImg($(this).val());
                    common.inputdog.val('');
                    common.inputdog.attr('disabled', 'true');
                }
            });

            common.selectcor.change(function (event) {

                if ($(this).val() == "defalt") {
                    $(this).next().removeClass('lnx_select-selected');
                } else {
                    common.dogtext.css('color', $(this).find("option[value='" + $(this).val() + "']").attr('data-color'));
                    $(this).next().addClass('lnx_select-selected');
                }

            });

            common.selectfont.change(function (event) {

                if ($(this).val() == "defalt") {
                    $('#lnx_dog-name').css('font-family', 'Arial');
                    $(this).next().removeClass('lnx_select-selected');
                } else {
                    $("head").append("<link href='https://fonts.googleapis.com/css?family=" + $(this).val() + "' rel='stylesheet' type='text/css'>");
                    common.dogtext.css('font-family', $(this).val().replace('+', ' '));

                    $(this).next().addClass('lnx_select-selected');
                }

            });

        }());

        (function Lnx_DogRecoverLocalStore() {

            if (sessionStorage.getItem('storeObj') != null) {

                var dados = JSON.parse(sessionStorage.getItem('storeObj'));
                common.selectdog.val(dados.Values.SelectRace.Value);
                common.selectdog.change();
                common.inputdog.val(dados.Values.InputRace.Value);
                common.inputdog.keyup();
                common.apelidodog.val(dados.Values.NickName.Value);
                common.apelidodog.change();
                common.selectcor.val(dados.Values.ColorSelect.Value);
                common.selectcor.change();
                common.selectfont.val(dados.Values.FontSelect.Value);
                common.selectfont.change();

                setTimeout(function () {
                    $('#lnx_loading').addClass('lnx_hidden');
                }, 500);

            } else {
                $('#lnx_loading').addClass('lnx_hidden');
            }

        }());

        (function Lnx_DogSaveLocalStore() {

            $('#lxn_form-dog').submit(function () {

                var save =
                {
                    Values: {
                        SelectRace: {
                            Value: common.selectdog.val()
                        },
                        InputRace: {
                            Value: common.inputdog.val()
                        },
                        NickName: {
                            Value: common.apelidodog.val()
                        },
                        ColorSelect: {
                            Value: common.selectcor.val()
                        },
                        FontSelect: {
                            Value: common.selectfont.val()
                        }
                    },
                    Date: new Date
                };

                sessionStorage.setItem('storeObj', JSON.stringify(save));

                if (sessionStorage.getItem('storeObj') != null) {
                    $('body').append('<div class="lnx_popupadd">Informações Salvas</div>');
                    setTimeout(function () {
                        $('.lnx_popupadd').remove();
                    }, 1200);
                }

            });

        }());

    };

    (function Lnx_DogApi() {

        $.ajax({
            url: "https://dog.ceo/api/breeds/list/all",
            type: "GET",
            success: function (result) {

                Lnx_DogChild = function (race, sub_race) {
                    $.each(sub_race, function (i, sub_race) {
                        arrayraces.push(race + '/' + sub_race);
                    });
                };

                arrayraces = [];

                $.each(result.message, function (race, sub_race) {
                    (sub_race.length > 0 ? Lnx_DogChild(race, sub_race) : arrayraces.push(race));
                });

            },
            complete: function (data) {

                Lnx_Init();

            }
        });

    }());

});