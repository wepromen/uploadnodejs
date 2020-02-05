var express = require('express');
var multer  = require('multer')
// getting-started.js
var mongoose = require('mongoose');
var uploadspModel = require('../model/uploadsp');
var router = express.Router();

mongoose.connect('mongodb://localhost/sanpham', {useNewUrlParser: true,useUnifiedTopology: true});

var anhs = [];
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './anhsanpham')
  },
  filename: function (req, file, cb) {
    cb(null,Date.now() + '_' + file.originalname )
  }
})

var upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// upload file
router.post('/uploadfile',upload.any(), (req, res, next) => {
  var tentamthoi = req.files[0].path;
  anhs.push(tentamthoi) // dua ten anh vao mang 
  console.log(anhs);
  res.status(200).send(req.files);
});
// up sản phẩm
router.post('/upsanpham', (req, res) => {
  var ten = req.body.ten , gia = req.body.gia; // lấy nhập liệu từ form
  // tạo 1 đối tượng dữ liệu
  var motdoituong = {
    "ten":ten,
    "gia":gia,
    "anh":anhs
  }
  var dulieu = new uploadspModel(motdoituong);
  dulieu.save();

  res.render('thanhcong',{title:'Thành Công'});
});
// Xem su lieu
router.get('/xemsp', (req, res) => {
  // sử dung Mongoose lấy dữ liệu, đổ ra view
  uploadspModel.find({},(error,dulieu)=>{
    res.render('xemsp',{title:'View Produces', data: dulieu});
  })
});

module.exports = router;
