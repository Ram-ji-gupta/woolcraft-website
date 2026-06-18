function sendWhatsAppOrder(){

    let message =
    "New Order:%0A%0A";

    let total = 0;


    cart.forEach(item=>{

        let amount =
        item.price * item.qty;

        total += amount;

        message +=

        item.name +

        " x " +

        item.qty +

        " = ₹" +

        amount +

        "%0A";

    });


    message +=
    "%0A Total : ₹" + total;


    window.open(

    "https://wa.me/919876543210?text="

    + message

    );

}