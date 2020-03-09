const path = require('path') ;
const multer = require('multer') ;

var Storage = multer.diskStorage({
  destination : './public/uploads/',
  filename: (req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname)) ;
  }
})
var upload = multer({
  storage:Storage
}).single('avatar') ;

module.exports = upload ;
