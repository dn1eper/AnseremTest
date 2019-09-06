var $table, $createModal, $removeModal, $editModal, selectedSale;

function InitTable() {
    $table.bootstrapTable({
        columns: [
            {
                title: '№',
                field: 'SaleID',
                align: 'center',
                width: 50,
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
                field: 'Contact.FullName'
            },
            {
                title: 'Город клиента-организации',
                field: 'Partner.City.CityName',
                width: 120
            },
            {
                title: 'Управление',
                searchable: false,
                align: 'center',
                width: 60,
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
    var newContact = {
        FirstName: $('#createFirstName').val(),
        SurName: $('#createSurName').val(),
        Patronymic: $('#createPatronymic').val(),
        Address: $('#createAddress').val(),
        Telephone: {
            Number: $('#createTelephone').val().replace(/(\(|\)|\-)/g, '')
        }
    };
    $.ajax({
        url: '/api/sales/',
        type: 'POST',
        data: JSON.stringify(newContact),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            Notify('Контакт успешно сохранен', 'success');
            $table.bootstrapTable('append', data);
        },
        error: function (x, y, z) {
            Notify('Произошла ошибка при сохранении контакта (' + z + ')', 'danger');
        },
        complete: function () {
            $createModal.modal('hide');
            $('#createContactForm')[0].reset();
        }
    });
    return false;
}

function OnEditSaleShow(e, value, row, index) {
    selectedSale = row;
    $('#editFirstName').val(row.FirstName);
    $('#editSurName').val(row.SurName);
    $('#editPatronymic').val(row.Patronymic);
    $('#editAddress').val(row.Address);
    $('#editTelephone').val(row.Telephone.Number);
    $editModal.modal('show');
}

function OnEditSaleRequest() {
    selectedSale.FirstName = $('#editFirstName').val();
    selectedSale.SurName = $('#editSurName').val();
    selectedSale.Patronymic = $('#editPatronymic').val();
    selectedSale.Address = $('#editAddress').val();
    selectedSale.Telephone.Number = $('#editTelephone').val().replace(/(\(|\)|\-)/g, '');

    $.ajax({
        url: '/api/sales/' + selectedSale.ContactID,
        type: 'PUT',
        data: JSON.stringify(selectedSale),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            Notify('Контакт успешно сохранен', 'success');
            $table.bootstrapTable('updateByUniqueId', {
                id: selectedSale.$id,
                row: selectedSale
            });
        },
        error: function (x, y, z) {
            Notify('Произошла ошибка при сохранении контакта (' + z + ')', 'danger');
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
            }
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
    $("#createTelephone, #editTelephone").inputmask({ mask: "+9(999)999-99-99" });
});

