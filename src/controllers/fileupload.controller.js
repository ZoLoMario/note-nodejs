const fileuploadCtrl = {};
const multer = require("multer");
let path = require("path");
// Khởi tạo biến cấu hình cho việc lưu trữ file upload
let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    callback(null, "uploads");
  },
  limits: { fileSize: 1000000 },
  filename: (req, file, callback) => {
    // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
    // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }
    // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
    let filename = `${Date.now()}-wonote-${file.originalname}`;
    callback(null, filename);
  }
});
// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"

//module.exports = multerUpload;

// Models
const Fileupload = require("../models/Fileupload");
const Note = require("../models/Note");
//const  multerUpload = require("../config/multer");
fileuploadCtrl.uploadFile = (req, res) => {
	let multerUpload = multer({storage: diskStorage}).single('filedesp');
		  // Thực hiện upload file, truyền vào 2 biến req và res
		    // Nếu có lỗi thì trả về lỗi cho client.
		    // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
        //console.log(req.body); ở đây không có gì đâu
		    multerUpload(req, res, async (error) => {
          //console.log(req.body.idnote);
          req.file.user = req.user.id;
          req.file.note = req.body.idnote;
          const newFileObsave = await fileuploadCtrl.createFileOb(req.file);
          console.log(newFileObsave._id);
          const note = await Note.findById(req.body.idnote);
           console.log(note.file);
           note.file.push(newFileObsave._id);
          await Note.findByIdAndUpdate(req.body.idnote, note, function (err) {
          if (err) { console.log(err) }
        });
		    	if (error) {
		      return res.send(`Error when trying to upload: ${error}`);
		    }
		    // Không có lỗi thì lại render cái file ảnh về cho client.
		    // Đồng thời file đã được lưu vào thư mục uploads
		    //res.send("Thành công");
		    res.send({"link":'http://'+ req.hostname +':4000/public/up/'+ req.file.filename});
		 });
	};
  fileuploadCtrl.createFileOb = async (fileOb) => {
    const newFileOb = new Fileupload();
    newFileOb.name = fileOb.filename;
    newFileOb.path = fileOb.path;
    newFileOb.oldname = fileOb.originalname;
    newFileOb.mimetype = fileOb.mimetype;
    newFileOb.size = fileOb.size;
    newFileOb.user = fileOb.user;
    newFileOb.note = [fileOb.note];
    newFileOb.encoding = fileOb.encoding;
    const newFileObsave = await newFileOb.save();
    return newFileObsave;
};

module.exports = fileuploadCtrl;