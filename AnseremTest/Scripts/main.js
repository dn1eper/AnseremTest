var $table, $createModal, $removeModal, $editModal, selectedSale;

function InitTable() {
    $table.bootstrapTable({
        columns: [
            {
                title: '№',
                field: 'SaleID',
                align: 'center',
                width: 40,
                sortable: true,
                searchable: false
            },
            {
                title: 'Название',
                field: 'SaleName',
                width: 140,
                sortable: true
            },
            {
                title: 'Клиент-организация',
                field: 'Partner.PartnerName',
                width: 140,
                sortable: true
            },
            {
                title: 'Контактное лицо',
                field: 'Partner.Contact.FullName',
                width: 140,
                sortable: true
            },
            {
                title: 'Ответственный',
                field: 'Contact.FullName',
                sortable: true
            },
            {
                title: 'Город',
                field: 'Partner.City.CityName',
                sortable: true,
                width: 120
            },
            {
                title: 'Управление',
                searchable: false,
                align: 'center',
                width: 50,
                events: {
                    'click .edit': OnEditSaleShow,
                    'click .remove': OnRemoveSaleShow
                },
                formatter: () => [
                    '<a class="edit" href="javascript:void(0)" title="Изменить">',
                    '<i class="fa fa-edit"></i>',
                    '</a>',
                    '<a class="remove" href="javascript:void(0)" title="Удалить">',
                    '<i class="fa fa-trash"></i>',
                    '</a>'
                ].join('')
            }
        ],
        ajax: function (params) {
            $.getJSON('api/sales').done(function (data) {
                params.success({
                    'rows': data,
                    'total': data.length
                });
            });
        },
        search: true,
        pagination: true,
        toolbar: '.toolbar'
    });
}

function OnCreateSaleShow() {
    $createModal.modal('show');
}

function OnCreateSaleRequest() {
    var newSale = {
        SaleName: $('#createSaleName').val()
    };
    if ($('#createSaleContact').val()) {
        newSale.Contact = {
            FullName: $('#createSaleContact').val(),
            Telephone: $('#createSaleContactTelephone').val()
        }
    }
    else if ($('#createSaleContactTelephone').val()) {
        Notify('Невозможно указать номер телефона без имени контакта', 'danger');
        return false;
    }
    if ($('#createPartner').val()) {
        newSale.Partner = {
            PartnerName: $('#createPartner').val()
        };
        if ($('#createPartnerContact').val()) {
            newSale.Partner.Contact = {
                FullName: $('#createPartnerContact').val(),
                Telephone: $('#createPartnerContactTelephone').val()
            }
        }
        else if ($('#createPartnerContactTelephone').val()) {
            Notify('Невозможно указать номер телефона без имени контакта', 'danger');
            return false;
        }
        if ($('#createCity').val()) {
            newSale.Partner.City = {
                CityName: $('#createCity').val()
            };
        }
    }
    else if ($('#createCity').val() || $('#createPartnerContact').val()) {
        Notify('Необходимо указать клиент-организация', 'danger');
        return false;
    }

    $.ajax({
        url: '/api/sales/',
        type: 'POST',
        data: JSON.stringify(newSale),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            Notify('Продажа успешно сохранена', 'success');
            $table.bootstrapTable('append', data);
        },
        error: function (x, y, z) {
            Notify('Произошла ошибка при сохранении контакта (' + z + ')', 'danger');
        },
        complete: function () {
            $createModal.modal('hide');
            $('#createSaleForm')[0].reset();
        }
    });
    return false;
}

function OnEditSaleShow(e, value, row, index) {
    $('#editSaleForm')[0].reset();
    selectedSale = row;
    $('#editSaleName').val(row.SaleName);
    if (row.Partner) {
        $('#editPartner').val(row.Partner.PartnerName);
        if (row.Partner.City)
            $('#editCity').val(row.Partner.City.CityName);
        if (row.Partner.Contact) {
            $('#editPartnerContact').val(row.Partner.Contact.FullName);
            $('#editPartnerContactTelephone').val(row.Partner.Contact.Telephone);
        }
    }
    if (row.Contact) {
        $('#editSaleContact').val(row.Contact.FullName);
        $('#editSaleContactTelephone').val(row.Contact.Telephone);
    }
    $editModal.modal('show');
}

function OnEditSaleRequest() {
    selectedSale.SaleName = $('#editSaleName').val()

    if ($('#editSaleContact').val()) {
        if (selectedSale.Contact == null) selectedSale.Contact = {};

        selectedSale.Contact.FullName = $('#editSaleContact').val();
        selectedSale.Contact.Telephone = $('#editSaleContactTelephone').val().replace(/(\(|\)|\-)/g, '');
    }
    else if ($('#editSaleContactTelephone').val()) {
        Notify('Невозможно указать номер телефона без имени контакта', 'danger');
        return false;
    }
    else {
        selectedSale.Contact = null;
    }
    if ($('#editPartner').val()) {
        if (selectedSale.Partner == null) selectedSale.Partner = {};

        selectedSale.Partner.PartnerName = $('#editPartner').val();

        if ($('#editPartnerContact').val()) {
            if (selectedSale.Partner.Contact == null) selectedSale.Partner.Contact = {};

            selectedSale.Partner.Contact.FullName = $('#editPartnerContact').val();
            selectedSale.Partner.Contact.Telephone = $('#editPartnerContactTelephone').val().replace(/(\(|\)|\-)/g, '');
        }
        else if ($('#editPartnerContactTelephone').val()) {
            Notify('Невозможно указать номер телефона без имени контакта', 'danger');
            return false;
        }
        else {
            selectedSale.Partner.Contact = null;
        }
        if ($('#editCity').val()) {
            if (selectedSale.Partner.City == null) selectedSale.Partner.City = {};

            selectedSale.Partner.City.CityName = $('#editCity').val();
        }
        else {
            selectedSale.Partner.City = null;
        }
    }
    else if ($('#editCity').val() || $('#editPartnerContact').val()) {
        Notify('Необходимо указать клиент-организация', 'danger');
        return false;
    }
    else {
        selectedSale.Partner = null;
    }

    $.ajax({
        url: '/api/sales/' + selectedSale.SaleID,
        type: 'PUT',
        data: JSON.stringify(selectedSale),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            Notify('Продажа успешно сохранена', 'success');
            $table.bootstrapTable('updateByUniqueId', {
                id: selectedSale.$id,
                row: selectedSale
            });
        },
        error: function (x, y, z) {
            console.debug(x.responseJSON);
            Notify('Произошла ошибка при сохранении продажи (' + z + ')', 'danger');
        },
        complete: function () {
            $editModal.modal('hide');
        }
    });
    return false;
}

function OnRemoveSaleShow(e, value, row, index) {
    selectedSale = row;
    $removeModal.find('.modal-body').html(['Вы действительно хотите удалить <b>', row.SaleName, '</b>?'].join(''));
    $removeModal.modal('show');
}

function OnRemoveSaleRequest() {
    $.ajax({
        url: '/api/sales/' + selectedSale.SaleID,
        type: 'DELETE',
        success: function (data) {
            console.log(data);
            Notify('Продажа успешно удалена', 'success');
            $table.bootstrapTable('remove', {
                field: 'SaleID',
                values: [selectedSale.SaleID]
            });
        },
        error: function (x, y, z) {
            Notify('Произошла ошибка при удалении продажи (' + z + ')', 'danger');
        },
        complete: function () {
            $removeModal.modal('hide');
        }
    });
}

function Notify(message, type) {
    $.notify({
        message: message
    }, {
            type: type,
            placement: {
                from: "top",
                align: "center"
            },
            z_index: 2031
        });
}

$(document).ready(function () {
    $table = $('#salesTable');
    $createModal = $('#createSaleModal');
    $removeModal = $('#removeSaleModal');
    $editModal = $('#editSaleModal');

    InitTable();

    $('#createSaleBtn').click(OnCreateSaleShow);
    $('#createSaleForm').submit(OnCreateSaleRequest);
    $('#editSaleForm').submit(OnEditSaleRequest);
    $('#removeSaleConfirmBtn').click(OnRemoveSaleRequest);
    $("#createSaleContactTelephone, #createPartnerContactTelephone, #editSaleContactTelephone, #editPartnerContactTelephone").inputmask({ mask: "+9(999)999-99-99" });
});

