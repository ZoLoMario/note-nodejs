const usersCtrl = {};

// Models
const User = require('../models/User');
const Note = require("../models/Note");
const Fileupload = require("../models/Fileupload");
const Tag = require("../models/Tag");
const Hep = require("../helpers/hep");
// Modules
const passport = require("passport");
const { addNote, renderApinotes } = require("./notes.controller");
const { addTag } = require("./tags.controller");

usersCtrl.renderSignUpForm = (req, res) => {
  res.render('users/signup');
};

usersCtrl.singup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if (password != confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }
  if (password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      name,
      email,
      password,
      confirm_password
    });
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "The Email is already in use.");
      res.redirect("/users/signup");
    } else {
      // Saving a New User
      const newUser = new User({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "You are registered.");
      res.redirect("/users/signin");
    }
  }
};

usersCtrl.renderSigninForm = (req, res) => {
  res.render("users/signin");
};

usersCtrl.signin = passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/signin",
    failureFlash: true
  });

usersCtrl.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out now.");
  res.redirect("/users/signin");
};

usersCtrl.renderUserinfo = async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  console.log(req.headers);
  console.log(req.client._peername);
  const notes = await Note.find({ user: req.user.id }).lean();
  const Fileuploads = await Fileupload.find({ user: req.user.id }).lean();
  user.note = notes.length;
  user.fileupload = Fileuploads.length;
  console.log(user);
  res.render('users/userinfo', { user } );
}

usersCtrl.changeUserinfo = async (req, res) => {
  console.log(req.headers);
  console.log(req.client._peername);
  console.log(req.body);

  const { username, email, oldpass, newpass, renewpass } = req.body;
  const user = await User.findById(req.user.id, async (err, userdoc) => {
  userdoc.name = username;
  userdoc.email = email;
  console.log(userdoc);
  userdoc.save();
  if( oldpass == null || newpass == null || renewpass == null ){
     res.send('Mật khẩu trống');
  } else {
        const match = await userdoc.matchPassword(oldpass);
        if(match) {
          userdoc.password = await userdoc.encryptPassword(newpass);
          userdoc.save();
          req.logout();
          req.flash("success_msg", "Update thành công. You are logged out now.");
          res.redirect("/users/signin");
        } else {
          res.send('Sai mật khẩu.');
        }
    }
  console.log(userdoc);
})};



//Import
const multer = require("multer");
let path = require("path");
var JSZip = require("jszip");
var zip = new JSZip();
const fs = require('fs');

let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    callback(null, "uploads/import");
  },
  limits: { fileSize: 1000000000 },
  filename: (req, file, callback) => {
    console.log(file.mimetype);
    let math = ["application/x-zip-compressed"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      console.log("loai bo");
      return callback(errorMess, null);
    }
    let filename = `${Date.now()}` + ".zip";
    callback(null, filename);
  }
});

usersCtrl.importUata = (req, res) => {
  res.render('users/upload');
};
usersCtrl.imUpload = (req, res) => {
  let multerUpload = multer({storage: diskStorage}).single('file');
   multerUpload(req, res, (error) => {
      fs.readFile(req.file.path, (err, data) => {
            if (err) throw err;
            JSZip.loadAsync(data).then( async (zip) => {
              var zipJson = zip.folder("Takeout").folder("Keep").file(/.json$/);
              if ( zipJson == null ) {
                res.send("không có gì");
              } else {
              var tag = await addTag("Google Keep");
              Promise.all(
                zipJson.map((x) => {
                    return x.async("string").then( async (a) => {
                      var b = JSON.parse(a);
                      b.title = b.title + " - timeUx " + b.userEditedTimestampUsec;
                      if( b.textContent == undefined ) {
                        if( b.listContent == undefined ) {
                          console.log(b.title) } else {
                         textContent = '{"time":1611475007397,"blocks":[{"type":"checklist","data":{"items":' + JSON.stringify(b.listContent).replace(new RegExp('\r?\\n','g'), '<br>').replace('"isChecked"', '"checked"') + '}}],"version":"2.19.1"}';
                         }
                      } else {  
                      var textContent = '{"time":1611475007397,"blocks":[{"type":"paragraph","data":{"text":' + JSON.stringify(b.textContent).replace(new RegExp('\\\\n','g'), '<br>') + '}}],"version":"2.19.1"}';
                      }
                      var note = {"title":b.title,  "description": textContent, "user":req.user.id, "tag": tag._id , status: true}
                      var newNote = await addNote(note);
                      return newNote._id;
                    }).catch((err) => { console.log('Something went wrong E3 ' + err) })
                  })
                ).then( async (dataJson)=> { 
                  tag.note = dataJson;
                  await Tag.findByIdAndUpdate(tag._id, tag,{new:true}, function (err, doc) {
                          if (err) { console.log(err) }
                        });
                })
              .catch(() => { console.log('Something went wrong E2') })
            }
            }).catch(() => { console.log('Something went wrong E1') })
          });
      res.redirect("/notes"); 
})};

// su dung cho API
usersCtrl.signAppin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send({code:"12"}); }//giá trị gửi đến là r
    req.logIn(user, async (err) => {
      if (err) { return next(err); }
      user.token = Hep.makeid(33);
      var usera = await User.findByIdAndUpdate(req.user.id, user ,{new:true}, function (err, doc) {
        if (err) { console.log(err) };
      });
      console.log("usera");
      console.log(usera);
      console.log("user._id");
      console.log(user._id);
      //var notes = await renderApinotes(user._id);
      //console.log("notes.length");
      //console.log(notes.length);
      return res.send({status:'success',token:usera.token,'user':user});
    });
  })(req, res, next);
};
usersCtrl.registerAppin = async (req, res)=> {
  console.log(req.body);

  let errors = [];
  const { name, email, password, confirm_password, age } = req.body;
  if (password != confirm_password) {
    errors.push({ text: "Mật khẩu không khớp." });
  }
  if (password.length < 4) {
    errors.push({ text: "Mật khẩu ít nhất phải có 4 kí tự." });
  }
  if (errors.length > 0) {
    res.json({status:'errors',msg:JSON.stringify(errors)});
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      errors.push("Thư điện tử đã tồn tại.");
      res.json({status:'errors',msg:errors});
    } else {
      // Saving a New User
      const newUser = new User({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      res.json({status:'success',msg: "Đăng kí thành công"});
    }
  }
}

module.exports = usersCtrl;