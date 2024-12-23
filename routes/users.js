const express = require('express');
const register_controller = require('../src/controller/registerController')
const r = express.Router();
const multer = require('multer');
const path = require('path');
const us_auth = require('../src/controller/Auth/UserAuthController')
const userController = require("../src/controller/userController")



// Set up storage options for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      // Specify the folder where the files will be stored
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      // Use the original file name or add a timestamp to ensure uniqueness
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Specify file filter to only accept images
const fileFilter = (req, file, cb) => {
  // Accept only image files (e.g., .jpg, .jpeg, .png)
  if (file.mimetype.startsWith('image/')) {
      cb(null, true);
  } else {
      cb(new Error('Only image files are allowed'), false);
  }
};

// Initialize multer with the storage configuration and file filter
const upload = multer({ 
  storage: storage,
   fileFilter: fileFilter,
   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  });

// View page routes------------------------------------
r.get('/', function (req, res, next) {
  res.render('user/index', { title: 'User Dashboard' });
});
r.get('/search', userController.get_user_data)
// r.get('/search', (req, res, next) => {
//   res.render('user/search', { title: "About page" })
// })
r.get('/register', (req, res, next) => {
  res.render('user/register', { title: "Register page" })
})
r.get('/download_pdf', (req, res, next) => {
  res.render('user/download-pdf', { title: "Register page" })
})
r.get('/login', (req, res, next) => {
  res.render('user/user-login', { error: "" });
})
r.get('/service', (req, res, next) => {
  res.render('user/service', { title: "Login page" });
})
r.get('/tamil_service', (req, res, next) => {
  res.render('user/tamil', { title: "Login page" });
})
r.get('/schemes', (req, res, next) => {
  res.render('user/schemes', { title: "Login page" });
})
r.get('/payment', (req, res, next) => {
  res.render('user/payment', { title: "Login page" });
})
r.get('/contact', (req, res, next) => {
  res.render('user/contact', { title: "Login page" });
})
r.get('/profile', userController.show_user_data)
// r.get('/profile', (req, res, next) => {
//   res.render('user/login_profile', { title: "Login page" });
// })
// User register page route ------------------------------

r.post('/user/post',upload.fields([{ name: 'FileUpload2' }, { name: 'FileUpload3' }]), register_controller.post_user_register_form)
r.post("/search_form", register_controller.search_users);
r.post("/user_login", us_auth.login);
r.get("/get_user_data", us_auth.get);
r.get('/user_data', userController.show_user_data)







module.exports = r;
