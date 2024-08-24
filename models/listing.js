const mongoose = require("mongoose");


const listingSchema = new mongoose.Schema({
    title : {
       type :String,
       required : true
    },
    description : {
       type :String,
       required : true
    },
    image : {
        type : String,
        default :
         "https://images.unsplash.com/photo-1611602132416-da2045990f76?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

        set : 
          (v) => v === "" 
           ? "https://images.unsplash.com/photo-1611602132416-da2045990f76?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
    },
    price : Number,

    location : {
      type :String,
      required : true
   },

   country : {
      type :String,
      required : true
   },
});


const Listing = mongoose.model("Listing" , listingSchema)

module.exports = Listing;