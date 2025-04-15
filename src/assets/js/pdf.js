window.onload = function () {
    document.getElementById("download")
        .addEventListener("click", () => {
            const invoice = this.document.getElementById("invoice");
            console.log(invoice);
            console.log(window);
            var opt = {
                margin: 0,
                filename: 'web_receipt.pdf',
                enableLinks: true,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 6 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().from(invoice).set(opt).save();
        });

        window.open(
          'web_receipt.pdf',
          '_blank' // <- This is what makes it open in a new window.
        );
}