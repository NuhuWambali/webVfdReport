$(document).ready(( function () {

    /**********************************************************************************
     * Receipts
     *********************************************************************************/
    $(document).on("click","#btn-receipt-print", function( e ){
        downloadReceipt();
        e.preventDefault();
        return false;
    });
    $(document).on("click","#btn-receipt-download", function( e ){
        downloadReceipt();
        e.preventDefault();
        return false;
    });

    function downloadReceipt() {
        var theDiv = $(".the-receipt").clone();
        $(theDiv).first("div").removeClass("col-xs-8").removeClass("col-xs-offset-2").printThis({
            importCSS: true,
            // pageTitle: "WebVFD Receipt",
            footer: " "
        });
    }

}));