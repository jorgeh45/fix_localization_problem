odoo.define('fix_localization_problem.screen', function (require) {
    "use strict";
 
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var _t = core._t;
    var rpc = require('web.rpc');

    screens.PaymentScreenWidget.include({
      
        finalize_validation: function () {
            var self = this;
            var current_order = this.pos.get_order();
            var _super = this._super.bind(this);
            if (current_order.to_invoice_backend &&
                self.pos.invoice_journal.l10n_latam_use_documents) {
                var latam_sequence =
                    self.pos.get_l10n_latam_sequence_by_document_type_id(
                        current_order.l10n_latam_document_type.id
                    );
                self.pos.loading_screen_on();
                rpc.query({
                    model: 'ir.sequence',
                    method: 'get_l10n_do_fiscal_info',
                    args: [latam_sequence.id],
                }).then(function (res) {
                    self.pos.loading_screen_off();
                    current_order.l10n_latam_document_number = res.ncf;
                    current_order.l10n_do_ncf_expiration_date = res.expiration_date;
                    current_order.l10n_latam_sequence_id = latam_sequence.id;
                    current_order.l10n_latam_document_type_id =
                        current_order.l10n_latam_document_type.id;
                    current_order.save_to_db();
                    console.log(res);
                    _super();
                }, function (err) {
                    self.pos.loading_screen_off();
                    current_order.l10n_latam_sequence_id = latam_sequence.id;
                    current_order.l10n_latam_document_type_id =
                        current_order.l10n_latam_document_type.id;
                    current_order.to_invoice = true;
                    current_order.save_to_db();
                    console.log('err', err);
                    err.event.preventDefault();
                    var error_body =
                        _t('Your Internet connection is probably down.');
                    if (err.message.data) {
                        var except = err.message.data;
                        error_body = except.message || except.arguments || error_body;
                    }
                    self.gui.show_popup('error', {
                        'title': _t('Error: Could not Save Changes'),
                        'body': error_body,
                    });
                });
            } else {
                this._super();
            }
        },
    });


});