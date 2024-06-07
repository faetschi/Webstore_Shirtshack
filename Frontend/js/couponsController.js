$(document).ready(function() {

    function generateCouponCode() {
        var length = 5;
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var couponCode = '';
        for (var i = 0; i < length; i++) {
            couponCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return couponCode;
    }

    // Funktion zum Erstellen eines neuen Gutscheins
    $("#createCouponForm").submit(function(event) {
        event.preventDefault();

        var couponValue = $("#couponValue").val();
        var couponExpiry = $("#couponExpiry").val();
        var couponCode = generateCouponCode();

        // Hier könnte ein AJAX-Request zum Server gehen, um den Gutschein zu speichern
        console.log("Erstellter Gutschein:", couponCode, couponValue, couponExpiry);

        // Nach dem Speichern, die Liste der Gutscheine aktualisieren
        fetchCoupons();
    });

    // Funktion zum Abrufen und Anzeigen aller Gutscheine
    function fetchCoupons() {
        // Hier könnte ein AJAX-Request zum Server gehen, um die Gutscheine zu holen
        // Für die Demonstration wird hier ein statisches Beispiel verwendet
        var coupons = [
            { code: "ABCDE", value: "10€", expiry: "2023-12-31", used: false },
            { code: "FGHIJ", value: "5€", expiry: "2023-01-01", used: true } // Angenommen, dieser Gutschein ist bereits verwendet
        ];

        $("#couponList").empty(); // Liste leeren, bevor neue Einträge hinzugefügt werden
        coupons.forEach(function(coupon) {
            var status = new Date(coupon.expiry) < new Date() ? "Abgelaufen" : (coupon.used ? "Eingelöst" : "Aktiv");
            var row = `<tr class="${status}">
                        <td>${coupon.code}</td>
                        <td>${coupon.value}</td>
                        <td>${coupon.expiry}</td>
                        <td>${status}</td>
                       </tr>`;
            $("#couponList").append(row);
        });
    }

    // Initial die Liste der Gutscheine laden
    fetchCoupons();
});