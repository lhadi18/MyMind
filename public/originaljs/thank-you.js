$.ajax({
    url: '/recentPurchase',
    method: "GET",
    success: function(obj) {
        document.getElementById("orderNumber").innerHTML = obj.orderId;
    }
})