// Import the Express.js framework for building web applications.
import express from "express";

// Create a new Express.js application, which will be used to handle HTTP requests and responses.
const app = express();

// Import the Multer middleware, which is used for handling multipart/form-data requests, such as file uploads.
import multer from "multer";

// Import the Path module, which provides utilities for working with file paths and directories.
import path from "path";

// Import the EJS-Mate template engine, which is used for rendering dynamic HTML templates.
import ejsmate from "ejs-mate";

// Import the MySQL2 module, which is used for interacting with MySQL databases.
import mysql from "mysql2";

// Import the Bcrypt module, which is used for password hashing and verification.
import bcrypt from "bcrypt";

// Import the Body-Parser middleware, which is used for parsing incoming request bodies.
import bodyParser from "body-parser";

// Import the Express-Session middleware, which is used for managing user sessions.
import session from "express-session";

// Import the Passport.js authentication framework, which is used for authenticating users.
import passport from "passport";

// Import the LocalStrategy for Passport.js, which is used for authenticating users using a username and password.
import { Strategy as LocalStrategy } from "passport-local";

// Import the Connect-Flash middleware, which is used for displaying flash messages to users.
import flash from "connect-flash";

// Import the Nodemailer module, which is used for sending emails.
import nodemailer from "nodemailer";

// Body parser middleware to parse incoming request bodies in JSON format.
app.use(bodyParser.json());

// Body parser middleware to parse incoming request bodies in URL-encoded format.
app.use(bodyParser.urlencoded({ extended: true }));

// Set the template engine to EJS.
app.engine("ejs", ejsmate);

// Set the default view engine to EJS.
app.set("view engine", "ejs");

// Get the current file URL and directory.
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the views directory to the current directory.
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory.
app.use(express.static(path.join(__dirname, "public")));

// Multer setup for handling file uploads.
const storage = multer.diskStorage({
  // Destination for uploaded files.
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // File naming strategy.
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Create a Multer instance with the storage setup.
const upload = multer({ storage: storage });

// MySQL connection setup.
const db = mysql.createConnection({
  // Host for the MySQL database.
  host: "mysqldb",
  // User for the MySQL database.
  user: "root",
  // Password for the MySQL database.
  password: "qazwsxeD3#",
  // Database name.
  database: "DBMS_pro2",
});

// Connect to the MySQL database.
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL connected");
  }
});

// Error handling for MySQL connection.
db.on('error', (err) => {
  console.error('MySQL connection error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    // Attempt to re-establish connection.
    db.connect((err) => {
      if (err) {
        console.error('Error reconnecting to MySQL:', err);
        return;
      }
      console.log("MySQL reconnected");
    });
  } else {
    throw err;
  }
});

// Session middleware setup.
app.use(
  session({
    // Secret key for session encryption.
    secret: "mysupersecretcode",
    // Resave session on every request.
    resave: false,
    // Save uninitialized session.
    saveUninitialized: true,
    // Cookie settings for session.
    cookie: {
      // Expiration time for session cookie.
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      // Maximum age for session cookie.
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // HTTP-only flag for session cookie.
      httpOnly: true,
    },
  })
);

//Passport.js initialization: This is used to authenticate users and manage sessions
app.use(passport.initialize());
app.use(passport.session());

// Middleware to set current user in locals: This sets the current user's data in the res.locals object and req.session object
// so that it can be accessed across multiple requests and in templates
app.use((req, res, next) => {
  // Set current user in locals
  res.locals.currUser = req.user; // Set current user in res.locals object
  req.session.currUser = req.user; // Set current user in req.session object
  next(); // Call next middleware function in the chain
});

// Serve uploaded files from the uploads directory: This serves files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create users table in database: This creates a table in the database to store user data
db.query(`CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each user
  email VARCHAR(255) UNIQUE NOT NULL, // Email address of the user
  password VARCHAR(255) NOT NULL // Password of the user
)`);

// Create profile table in database: This creates a table in the database to store user profile data
db.query(`CREATE TABLE IF NOT EXISTS profile (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each profile
  first_name VARCHAR(255) NOT NULL, // First name of the user
  last_name VARCHAR(255) NOT NULL, // Last name of the user
  category VARCHAR(255) NOT NULL, // Category of the user
  email VARCHAR(255) NOT NULL // Email address of the user
)`);

// Create application details table in database: This creates a table in the database to store application details
db.query(`CREATE TABLE IF NOT EXISTS applicationdetails (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each application
  email VARCHAR(255) NOT NULL, // Email address of the user
  adv_num VARCHAR(255) NOT NULL, // Advertisement number
  doa VARCHAR(255) NOT NULL, // Date of application
  app_num VARCHAR(255) NOT NULL, // Application number
  post VARCHAR(255) NOT NULL, // Post applied for
  dept VARCHAR(255) NOT NULL // Department
)`);

// Create personal details table in database: This creates a table in the database to store personal details
db.query(`CREATE TABLE IF NOT EXISTS personaldetails (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each personal detail
  email VARCHAR(255) NOT NULL, // Email address of the user
  first_name VARCHAR(255) NOT NULL, // First name of the user
  middle_name VARCHAR(255) NOT NULL, // Middle name of the user
  last_name VARCHAR(255) NOT NULL, // Last name of the user
  nationality VARCHAR(255) NOT NULL, // Nationality of the user
  dob VARCHAR(255) NOT NULL, // Date of birth of the user
  gender VARCHAR(255) NOT NULL, // Gender of the user
  maritalstatus VARCHAR(255) NOT NULL, // Marital status of the user
  category VARCHAR(255) NOT NULL, // Category of the user
  image_path VARCHAR(255) NULL, // Path to the user's image
  idproof VARCHAR(255) NOT NULL, // ID proof of the user
  idproof_image VARCHAR(255) NULL, // Path to the user's ID proof image
  father_name VARCHAR(255) NOT NULL, // Father's name of the user
  correspondenceaddress VARCHAR(255) NOT NULL, // Correspondence address of the user
  permanentaddress VARCHAR(255) NOT NULL, // Permanent address of the user
  mobile VARCHAR(255) NOT NULL, // Mobile number of the user
  altmobile VARCHAR(255) NOT NULL, // Alternate mobile number of the user
  altemail VARCHAR(255) NOT NULL, // Alternate email address of the user
  landlinenumber VARCHAR(255) NOT NULL // Landline number of the user
)`);


// Create page_8 table in database: This creates a table in the database to store page 8 data
db.query(`CREATE TABLE IF NOT EXISTS page_8 (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each page 8 entry
  email VARCHAR(255) NOT NULL, // Email address of the user
  phd_path VARCHAR(255) NULL, // Path to PhD certificate
  pg_path VARCHAR(255) NULL, // Path to PG certificate
  ug_path VARCHAR(255) NULL, // Path to UG certificate
  tw_path VARCHAR(255) NULL, // Path to 10th certificate
  te_path VARCHAR(255) NULL, // Path to 12th certificate
  pay_path VARCHAR(255) NULL, // Path to pay certificate
  noc_path VARCHAR(255) NULL, // Path to NOC certificate
  post_path VARCHAR(255) NULL, // Path to post certificate
  misc_path VARCHAR(255) NULL, // Path to miscellaneous certificate
  sign_path VARCHAR(255) NULL, // Path to signature
  research_path VARCHAR(255) NULL // Path to research certificate
)`);

// Create datapage table in database: This creates a table in the database to store datapage data
db.query(`CREATE TABLE IF NOT EXISTS datapage (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each datapage entry
  email VARCHAR(255) NOT NULL, // Email address of the user
  email07 VARCHAR(255) NOT NULL, // Alternate email address of the user
  ref_name VARCHAR(255) NOT NULL, // Name of the referee
  phone VARCHAR(255) NOT NULL, // Phone number of the referee
  position VARCHAR(255) NOT NULL, // Position of the referee
  association_referee VARCHAR(255) NOT NULL, // Association of the referee
  org VARCHAR(255) NOT NULL // Organization of the referee
)`);

// Create educationaldetails table in database: This creates a table in the database to store educational details
db.query(`CREATE TABLE IF NOT EXISTS educationaldetails (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each educational detail
  email VARCHAR(255), // Email address of the user
  college_phd VARCHAR(255), // College where PhD was completed
  stream_phd VARCHAR(255), // Stream of PhD
  supervisor_phd VARCHAR(255), // Supervisor of PhD
  yoj_phd VARCHAR(255), // Year of joining PhD
  dod_phd VARCHAR(255), // Date of completion of PhD
  doa_phd VARCHAR(255), // Date of award of PhD
  phd_title VARCHAR(255), // Title of PhD thesis
  pg_degree VARCHAR(255), // PG degree
  pg_college VARCHAR(255), // College where PG was completed
  pg_stream VARCHAR(255), // Stream of PG
  pg_yoj VARCHAR(255), // Year of joining PG
  pg_yoc VARCHAR(255), // Year of completion of PG
  pg_duration VARCHAR(255), // Duration of PG
  pg_cgpa VARCHAR(255), // CGPA of PG
  pg_division VARCHAR(255), // Division of PG
  ug_degree VARCHAR(255), // UG degree
  ug_college VARCHAR(255), // College where UG was completed
  ug_stream VARCHAR(255), // Stream of UG
  ug_yoj VARCHAR(255), // Year of joining UG
  ug_yoc VARCHAR(255), // Year of completion of UG
  ug_duration VARCHAR(255), // Duration of UG
  ug_cgpa VARCHAR(255), // CGPA of UG
  ug_division VARCHAR(255), // Division of UG
  hsc_school VARCHAR(255), // School where HSC was completed
  hsc_passingyear VARCHAR(255), // Year of passing HSC
  hsc_percentage VARCHAR(255), // Percentage of HSC
  hsc_division VARCHAR(255), // Division of HSC
  ssc_school VARCHAR(255), // School where SSC was completed
  ssc_passingyear VARCHAR(255), // Year of passing SSC
  ssc_percentage VARCHAR(255), // Percentage of SSC
  ssc_division VARCHAR(255) // Division of SSC
)`);


// Create edu_additionaldetails table in database: This creates a table in the database to store additional educational details
db.query(`CREATE TABLE IF NOT EXISTS edu_additionaldetails (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each additional educational detail
  educationaldetails_id INT, // Foreign key referencing educationaldetails table
  degree VARCHAR(255), // Degree obtained
  college VARCHAR(255), // College where the degree was obtained
  subjects VARCHAR(255), // Subjects studied
  yoj VARCHAR(255), // Year of joining
  yog VARCHAR(255), // Year of graduation
  duration VARCHAR(255), // Duration of the degree
  perce VARCHAR(255), // Percentage of marks obtained
  division VARCHAR(255), // Division obtained
  FOREIGN KEY (educationaldetails_id) REFERENCES educationaldetails(id) // Establishes a relationship with the educationaldetails table
)`);

// Create publications table in database: This creates a table in the database to store publications
db.query(`CREATE TABLE IF NOT EXISTS publications (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each publication
  email VARCHAR(255), // Email address of the user
  summary_journal_inter VARCHAR(255), // Summary of journal publications (international)
  summary_journal VARCHAR(255), // Summary of journal publications (national)
  summary_conf_inter VARCHAR(255), // Summary of conference publications (international)
  summary_conf_national VARCHAR(255), // Summary of conference publications (national)
  patent_publish VARCHAR(255), // Summary of patents published
  summary_book VARCHAR(255), // Summary of books published
  summary_book_chapter VARCHAR(255) // Summary of book chapters published
)`);

// Create top10publications table in database: This creates a table in the database to store the top 10 publications
db.query(`CREATE TABLE IF NOT EXISTS top10publications (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each top publication
  email VARCHAR(255), // Email address of the user
  author VARCHAR(255), // Author of the publication
  title VARCHAR(255), // Title of the publication
  journal VARCHAR(255), // Journal where the publication was published
  year VARCHAR(255), // Year of publication
  impact VARCHAR(255), // Impact factor of the publication
  doi VARCHAR(255), // Digital Object Identifier (DOI) of the publication
  status VARCHAR(255) // Status of the publication (e.g. published, in press, etc.)
)`);

// Create patents table in database: This creates a table in the database to store patents
db.query(`CREATE TABLE IF NOT EXISTS patents (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each patent
  email VARCHAR(255), // Email address of the user
  pauthor VARCHAR(255), // Author of the patent
  ptitle VARCHAR(255), // Title of the patent
  p_country VARCHAR(255), // Country where the patent was filed
  p_number VARCHAR(255), // Patent number
  pyear_filed VARCHAR(255), // Year the patent was filed
  pyear_published VARCHAR(255), // Year the patent was published
  pyear_issued VARCHAR(255) // Year the patent was issued
)`);

// Create books table in database: This creates a table in the database to store books
db.query(`CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each book
  email VARCHAR(255), // Email address of the user
  bauthor VARCHAR(255), // Author of the book
  btitle VARCHAR(255), // Title of the book
  byear VARCHAR(255), // Year the book was published
  bisbn VARCHAR(255) // ISBN of the book
)`);

// Create book_chapters table in database: This creates a table in the database to store book chapters
db.query(`CREATE TABLE IF NOT EXISTS book_chapters (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each book chapter
  email VARCHAR(255), // Email address of the user
  bc_author VARCHAR(255), // Author of the book chapter
  bc_title VARCHAR(255), // Title of the book chapter
  bc_year VARCHAR(255), // Year the book chapter was published
  bc_isbn VARCHAR(255) // ISBN of the book chapter
)`);

// Create googlelink table in database: This creates a table in the database to store Google links
db.query(`CREATE TABLE IF NOT EXISTS googlelink (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each Google link
  email VARCHAR(255), // Email address of the user
  googlelink VARCHAR(255) // Google link
)`);

// Create presentemployment table in database: This creates a table in the database to store present employment details
db.query(`CREATE TABLE IF NOT EXISTS presentemployment (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each present employment
  email VARCHAR(255), // Email address of the user
  pres_emp_position VARCHAR(255), // Present employment position
  pres_emp_employer VARCHAR(255), // Present employment employer
  pres_status VARCHAR(255), // Present employment status
  pres_emp_doj VARCHAR(255), // Date of joining present employment
  pres_emp_dol VARCHAR(255), // Date of leaving present employment
  pres_emp_duration VARCHAR(255) // Duration of present employment
)`);

// Create employmenthistory table in database: This creates a table in the database to store employment history
db.query(`CREATE TABLE IF NOT EXISTS employmenthistory (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each employment history
  email VARCHAR(255), // Email address of the user
  exp_position VARCHAR(255), // Employment position
  exp_employer VARCHAR(255), // Employment employer
  exp_doj VARCHAR(255), // Date of joining employment
  exp_dol VARCHAR(255), // Date of leaving employment
  exp_duration VARCHAR(255) // Duration of employment
)`);

// Create teachingexp table in database: This creates a table in the database to store teaching experience
db.query(`CREATE TABLE IF NOT EXISTS teachingexp (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each teaching experience
  email VARCHAR(255), // Email address of the user
  t_exp_position VARCHAR(255), // Teaching experience position
  t_exp_employer VARCHAR(255), // Teaching experience employer
  t_exp_course VARCHAR(255), // Teaching experience course
  t_ugpg VARCHAR(255), // Teaching experience UG/PG
  t_noofstudents VARCHAR(255), // Number of students taught
  t_doj VARCHAR(255), // Date of joining teaching experience
  t_dol VARCHAR(255), // Date of leaving teaching experience
  t_duration VARCHAR(255) // Duration of teaching experience
)`);

// Create researchexp table in database: This creates a table in the database to store research experience
db.query(`CREATE TABLE IF NOT EXISTS researchexp (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each research experience
  email VARCHAR(255), // Email address of the user
  r_exp_position VARCHAR(255), // Research experience position
  r_exp_institute VARCHAR(255), // Research experience institute
  r_exp_supervisor VARCHAR(255), // Research experience supervisor
  r_exp_doj VARCHAR(255), // Date of joining research experience
  r_exp_dol VARCHAR(255), // Date of leaving research experience
  r_exp_duration VARCHAR(255) // Duration of research experience
)`);

// Create industrialexp table in database: This creates a table in the database to store industrial experience
db.query(`CREATE TABLE IF NOT EXISTS industrialexp (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each industrial experience
  email VARCHAR(255), // Email address of the user
  ind_exp_organization VARCHAR(255), // Industrial experience organization
  ind_exp_workprofile VARCHAR(255), // Industrial experience work profile
  ind_exp_doj VARCHAR(255), // Date of joining industrial experience
  ind_exp_dol VARCHAR(255), // Date of leaving industrial experience
  ind_exp_duration VARCHAR(255) // Duration of industrial experience
)`);

// Create aos_aor table in database: This creates a table in the database to store areas of specialization and areas of research
db.query(`CREATE TABLE IF NOT EXISTS aos_aor (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each area of specialization and area of research
  email VARCHAR(255), // Email address of the user
  area_spl VARCHAR(255), // Area of specialization
  area_rese VARCHAR(255) // Area of research
)`);

// Create membership table in database: This creates a table in the database to store membership details
db.query(`CREATE TABLE IF NOT EXISTS membership (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each membership
  email VARCHAR(255), // Email address of the user
  professional_society_name VARCHAR(255), // Name of the professional society
  membership_status VARCHAR(255) // Status of the membership
)`);

// Create training table in database: This creates a table in the database to store training details
db.query(`CREATE TABLE IF NOT EXISTS training (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each training
  email VARCHAR(255), // Email address of the user
  training_type VARCHAR(255), // Type of training
  training_organization VARCHAR(255), // Organization providing the training
  training_year VARCHAR(255), // Year the training was conducted
  training_duration VARCHAR(255) // Duration of the training
)`);

// Create awards table in database: This creates a table in the database to store award details
db.query(`CREATE TABLE IF NOT EXISTS awards (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each award
  email VARCHAR(255), // Email address of the user
  award_name VARCHAR(255), // Name of the award
  awarded_by VARCHAR(255), // Organization awarding the award
  award_year VARCHAR(255) // Year the award was received
)`);

// Create sponsoredprojects table in database: This creates a table in the database to store sponsored project details
db.query(`CREATE TABLE IF NOT EXISTS sponsoredprojects (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each sponsored project
  email VARCHAR(255), // Email address of the user
  sponsoring_agency VARCHAR(255), // Agency sponsoring the project
  project_title VARCHAR(255), // Title of the project
  sanctioned_amount VARCHAR(255), // Amount sanctioned for the project
  project_period VARCHAR(255), // Period of the project
  project_role VARCHAR(255), // Role in the project
  project_status VARCHAR(255) // Status of the project
)`);

// Create consultancyprojects table in database: This creates a table in the database to store consultancy project details
db.query(`CREATE TABLE IF NOT EXISTS consultancyprojects (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each consultancy project
  email VARCHAR(255), // Email address of the user
  consultancy_organization VARCHAR(255), // Organization providing the consultancy
  consultancy_title VARCHAR(255), // Title of the consultancy project
  grant_amount VARCHAR(255), // Amount granted for the consultancy
  consultancy_period VARCHAR(255), // Period of the consultancy
  consultancy_role VARCHAR(255), // Role in the consultancy
  consultancy_status VARCHAR(255) // Status of the consultancy
)`);

// Create phd_thesis table in database: This creates a table in the database to store PhD thesis details
db.query(`CREATE TABLE IF NOT EXISTS phd_thesis (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each PhD thesis
  email VARCHAR(255), // Email address of the user
  phd_name VARCHAR(255), // Name of the PhD student
  phd_title VARCHAR(255), // Title of the PhD thesis
  phd_role VARCHAR(255), // Role in the PhD thesis
  phd_status VARCHAR(255), // Status of the PhD thesis
  phd_year VARCHAR(255) // Year the PhD thesis was completed
)`);

// Create pg_thesis table in database: This creates a table in the database to store PG thesis details
db.query(`CREATE TABLE IF NOT EXISTS pg_thesis (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each PG thesis
  email VARCHAR(255), // Email address of the user
  pg_name VARCHAR(255), // Name of the PG student
  pg_title VARCHAR(255), // Title of the PG thesis
  pg_role VARCHAR(255), // Role in the PG thesis
  pg_status VARCHAR(255), // Status of the PG thesis
  pg_year VARCHAR(255) // Year the PG thesis was completed
)`);

// Create ug_thesis table in database: This creates a table in the database to store UG thesis details
db.query(`CREATE TABLE IF NOT EXISTS ug_thesis (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each UG thesis
  email VARCHAR(255), // Email address of the user
  ug_name VARCHAR(255), // Name of the UG student
  ug_title VARCHAR(255), // Title of the UG thesis
  ug_role VARCHAR(255), // Role in the UG thesis
  ug_status VARCHAR(255), // Status of the UG thesis
  ug_year VARCHAR(255) // Year the UG thesis was completed
)`);

// Create page_7 table in database: This creates a table in the database to store page 7 details
db.query(`CREATE TABLE IF NOT EXISTS page_7 (
  id INT AUTO_INCREMENT PRIMARY KEY, // Unique identifier for each page 7 entry
  email VARCHAR(255), // Email address of the user
  research_statement VARCHAR(255), // Research statement
  teaching_statement VARCHAR(255), // Teaching statement
  rel_in VARCHAR(255), // Relevant information
  prof_serv VARCHAR(255), // Professional service
  jour_details VARCHAR(255), // Journal details
  conf_details VARCHAR(255) // Conference details
)`);


// Passport local strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
      if (err) return done(err);
      if (!rows.length) return done(null, false);

      const user = rows[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return done(err);
        if (!result) return done(null, false);
        return done(null, user);
      });
    });
  })
);

// Serialize user for session: This function is used to serialize the user for the session
passport.serializeUser((user, done) => {
  // The user's ID is used as the identifier for the session
  done(null, user.id);
});

// Deserialize user from session: This function is used to deserialize the user from the session
passport.deserializeUser((id, done) => {
  // Query the database to retrieve the user's information based on the ID
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
    // If there is an error, return the error
    // Otherwise, return the user's information
    done(err, rows[0]);
  });
});

// Mailer: This section handles the sending of emails for password reset

// GET /reset: This route renders the password reset form
app.get("/reset", (req, res) => {
  res.render("formpages/reset.ejs");
});

// POST /reset: This route handles the submission of the password reset form
app.post("/reset", async (req, res) => {
  // Get the email address from the form submission
  const email = req.body.email;
  // Store the email address in the session
  req.session.forgotpasswordemail = email;
  // Generate a random token for the password reset link
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  // Create a transporter for sending emails using Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      type: 'login', // specify auth type
      user: `dkb8923@gmail.com`,
      pass: 'csdn qkeh rabv nyjh' // use 'pass', not 'password'
    },
  });

  // Define the email options
  const mailOptions = {
    from: "IIT PATNA<support>.com",
    to: email,
    subject: "password-reset-link",
    text: `Click the following link to reset your password: http://localhost:8000/reset-password/${token}`,
    html: `<p>Click the following link to reset your password:</p><p><a href="http://localhost:8000/reset-password/${token}">http://localhost:8000/reset-password/${token}</a></p>`
  };
  // Send the email using the transporter
  await transporter.sendMail(mailOptions, (err, info) => {
    // If there is an error, redirect to the reset page
    if (err) {
      res.redirect("/reset");
    } else {
      // Otherwise, redirect to the login page
      res.redirect("/login");
    }
  });
});

// GET /: This route redirects to the login page
app.get("/", (req, res) => {
  res.redirect("/login");
});

// GET /reset-password/:token: This route renders the password reset form with the token
app.get('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  res.render('formpages/reset-password.ejs', { token });
});

// POST /reset-password/:token: This route handles the submission of the password reset form with the token
app.post('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  // Check if the passwords match
  if (password !== confirm_password) {
    // If they do not match, render the form with an error message
    res.render('formpages/reset-password.ejs', { token, message: 'Passwords do not match' });
    return;
  }
  // Hash the password using bcrypt
  bcrypt.hash(password, 10, (err, hash) => {
    // If there is an error, return an internal server error
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Update the user's password in the database
    db.query('UPDATE users SET password = ? WHERE email = ?', [hash, req.session.forgotpasswordemail], (err, result) => {
      // If there is an error, return an internal server error
      if (err) {
        console.error('Error updating password:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      // Otherwise, redirect to the login page
      res.redirect("/login");
    });
  });
});



// Upload route: This route handles the upload of files for page 8
app.post('/upload', upload.fields([
  { name: 'phdCertificate' },
  { name: 'pgDocuments' },
  { name: 'ugDocuments' },
  { name: 'twelfthCertificate' },
  { name: 'tenthCertificate' },
  { name: 'paySlip' },
  { name: 'nocUndertaking' },
  { name: 'postPhdExperience' },
  { name: 'miscCertificate' },
  { name: 'signature'}, 
  { name: 'researchPapers'}
]), (req, res) => {
  // Create an object to store the file paths
  let page_8 = {
    email: req.session.currUser.email,
    phd_path: req.files['phdCertificate'] ? req.files['phdCertificate'][0].path : null,
    pg_path: req.files['pgDocuments'] ? req.files['pgDocuments'][0].path : null,
    ug_path: req.files['ugDocuments'] ? req.files['ugDocuments'][0].path : null,
    tw_path: req.files['twelfthCertificate'] ? req.files['twelfthCertificate'][0].path : null,
    te_path: req.files['tenthCertificate'] ? req.files['tenthCertificate'][0].path : null,
    pay_path: req.files['paySlip'] ? req.files['paySlip'][0].path : null,
    noc_path: req.files['nocUndertaking'] ? req.files['nocUndertaking'][0].path : null,
    post_path: req.files['postPhdExperience'] ? req.files['postPhdExperience'][0].path : null,
    misc_path: req.files['miscCertificate'] ? req.files['miscCertificate'][0].path : null,
    sign_path: req.files['signature'] ? req.files['signature'][0].path : null,
    research_path: req.files['researchPapers'] ? req.files['researchPapers'][0].path : null
  };

  // Insert the file paths into the page_8 table
  db.query('INSERT INTO page_8 SET ?', page_8, (err, result) => {
    if (err) {
      console.error('Error inserting page_8 data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Delete all existing rows in the datapage table
    db.query("DELETE FROM datapage", (err, result) => {
      if (err) throw err;
      // Insert or update rows based on new data
      for (let i = 0; i < req.body.ref_name.length; i++) {
        let data2 = {
          id: null,
          email: req.session.currUser.email,
          email07: req.body.email[i],
          ref_name: req.body.ref_name[i],
          phone: req.body.phone[i],
          position: req.body.position[i],
          association_referee: req.body.association_referee[i],
          org: req.body.org[i],
        };
        let sql = `INSERT INTO datapage SET ? ON DUPLICATE KEY UPDATE 
                email = VALUES(email), 
                email07 = VALUES(email07),
                ref_name = VALUES(ref_name), 
                phone = VALUES(phone), 
                position = VALUES(position), 
                association_referee = VALUES(association_referee), 
                org = VALUES(org)`;

        db.query(sql, data2, (err, result) => {
          if (err) throw err;
        });
      }
    });
    res.redirect("/formpages/9");
  });
});

// Signup route: This route handles the signup process
app.get("/signup", (req, res) => {
  // Generate a random string for the captcha
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  res.render("home/signup.ejs", { randomString });
});

app.post("/signup", (req, res) => {
  // Get the form data
  const {
    firstname,
    lastname,
    category,
    email,
    password,
    re_password,
    captcha,
    randomString,
  } = req.body;

  // Check if the passwords match
  if (password !== re_password) {
    res.redirect("/signup");
    return;
  }

  // Check if the captcha is correct
  if (captcha === randomString) {
    // Hash the password using bcrypt
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;

      // Insert the user into the users table
      db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hash],
        (err, result) => {
          if (err) throw err;

          // Insert the user into the profile table
          db.query(
            "INSERT INTO profile (first_name, last_name, category, email) VALUES (?, ?, ?, ?)",
            [firstname, lastname, category, email],
            (err, result) => {
              if (err) throw err;
            }
          );

          res.redirect("/login");
        }
      );
    });
  } else {
    // Generate a new random string for the captcha
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset[randomIndex];
    }
    res.render("home/signup.ejs", { randomString });
  }
});

// Login route: This route handles the login process
app.get("/login", (req, res) => {
  // Render the login page
  res.render("home/logged.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    // Redirect to form page 1 after successful login
    res.redirect("/formpages/1");
  }
);

// Form page 1 route: This route handles the first form page
app.get("/formpages/1", isAuthenticated, (req, res) => {
  // Get the user's email from the session
  const userEmail = req.session.currUser.email;
  // Get the personal and application details from the session
  const personaldetails = req.session.personaldetails || {};
  const applicationdetails = req.session.applicationdetails || {};
  // Get the image and ID proof paths from the session
  let imagePath = req.session.image_path ? req.session.image_path : null;
  let idpath = req.session.idpath ? req.session.idpath : null;
  // Replace backslashes with forward slashes in the image path
  if (imagePath) {
    imagePath = imagePath.replace(/\\/g, '/');
  }

  // Query the database to retrieve the user's profile data
  db.query(
    "SELECT first_name, last_name, category FROM profile WHERE email = ?",
    [userEmail],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving profile data:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (rows.length === 0) {
        return res.status(404).send("Profile not found");
      }
      // Extract the first name, last name, and category from the profile data
      const { first_name, last_name, category } = rows[0];
      // Render the form page 1 with the user's data
      res.render("formpages/1st.ejs", {
        firstname: first_name,
        lastname: last_name,
        email: userEmail,
        category: category,
        personaldetails: personaldetails,
        applicationdetails: applicationdetails,
        imagePath: imagePath,
        idpath: idpath
      });
    }
  );
});

// Form page 1 post route: This route handles the submission of form page 1
app.post("/formpages/1", isAuthenticated, upload.fields([{ name: 'uploadid' }, { name: 'userfile' }]), (req, res) => {
  // Get the uploaded files
  let uploadidFile = null;
  let userfile = null;

  if (req.files['uploadid'] && req.files['uploadid'][0]) {
    uploadidFile = req.files['uploadid'][0];
  }

  if (req.files['userfile'] && req.files['userfile'][0]) {
    userfile = req.files['userfile'][0];
  }
  // Get the application and personal details from the form submission
  let applicationdetails = req.body.applicationdetails;
  let personaldetails = req.body.personaldetails;
  // Set the email for the application details
  applicationdetails.email = req.session.currUser.email;
  // Store the personal and application details in the session
  req.session.personaldetails = personaldetails;
  req.session.applicationdetails = applicationdetails;
  // Store the image and ID proof paths in the session
  req.session.image_path = userfile ? userfile.path : null;
  req.session.idpath = uploadidFile ? uploadidFile.path : null;
  // Set the image and ID proof paths for the personal details
  personaldetails.image_path = userfile ? userfile.path : null;
  personaldetails.idproof_image = uploadidFile ? uploadidFile.path : null;
  // Insert the application details into the database
  db.query('INSERT INTO applicationdetails SET ?', applicationdetails, (err, result) => {
    if (err) {
      console.error('Error inserting applicationdetails:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Insert the personal details into the database
    db.query('INSERT INTO personaldetails SET ?', personaldetails, (err, result) => {
      if (err) {
        console.error('Error inserting personaldetails:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      // Redirect to form page 2
      res.redirect("/formpages/2");
    });
  });
});

// Form page 2 route: This route handles the second form page
app.get("/formpages/2", isAuthenticated, (req, res) => {
  // Get the user's email from the session
  const userEmail = req.session.currUser.email;

  // Delete existing data from all tables where email matches
  db.query("DELETE FROM edu_additionaldetails WHERE educationaldetails_id IN (SELECT id FROM educationaldetails WHERE email = ?)", [userEmail], (err) => {
    if (err) {
      console.error("Error deleting publications:", err);
      return res.status(500).send("Internal Server Error");
    }
    db.query("DELETE FROM educationaldetails WHERE email = ?", [userEmail], (err) => {
      if (err) {
        console.error("Error deleting top10publications:", err);
        return res.status(500).send("Internal Server Error");
      }
      // Query the database to retrieve the user's profile data
      db.query(
        "SELECT first_name, last_name FROM profile WHERE email = ?",
        [userEmail],
        (err, rows) => {
          if (err) {
            console.error("Error retrieving profile data:", err);
            return res.status(500).send("Internal Server Error");
          }
          if (rows.length === 0) {
            return res.status(404).send("Profile not found");
          }
          // Extract the first name and last name from the profile data
          const { first_name, last_name } = rows[0];
          // Render the form page 2 with the user's data
          res.render("formpages/2nd.ejs", {
            firstname: first_name,
            lastname: last_name,
          });
        }
      );
    });
  });
});

app.post("/formpages/2", isAuthenticated, (req, res) => {
  const email = req.session.currUser.email;
  req.body.email = email;

  // Insert main educational details into educationaldetails table
  const educationalDetailsQuery = `INSERT INTO educationaldetails (
      email,
      college_phd,
      stream_phd,
      supervisor_phd,
      yoj_phd,
      dod_phd,
      doa_phd,
      phd_title,
      pg_degree,
      pg_college,
      pg_stream,
      pg_yoj,
      pg_yoc,
      pg_duration,
      pg_cgpa,
      pg_division,
      ug_degree,
      ug_college,
      ug_stream,
      ug_yoj,
      ug_yoc,
      ug_duration,
      ug_cgpa,
      ug_division,
      hsc_school,
      hsc_passingyear,
      hsc_percentage,
      hsc_division,
      ssc_school,
      ssc_passingyear,
      ssc_percentage,
      ssc_division
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const educationaldetails = [
    req.body.email,
    req.body.college_phd,
    req.body.stream_phd,
    req.body.supervisor_phd,
    req.body.yoj_phd,
    req.body.dod_phd,
    req.body.doa_phd,
    req.body.phd_title,
    req.body.pg_degree,
    req.body.pg_college,
    req.body.pg_stream,
    req.body.pg_yoj,
    req.body.pg_yoc,
    req.body.pg_duration,
    req.body.pg_cgpa,
    req.body.pg_division,
    req.body.ug_degree,
    req.body.ug_college,
    req.body.ug_stream,
    req.body.ug_yoj,
    req.body.ug_yoc,
    req.body.ug_duration,
    req.body.ug_cgpa,
    req.body.ug_division,
    req.body.hsc_school,
    req.body.hsc_passingyear,
    req.body.hsc_percentage,
    req.body.hsc_division,
    req.body.ssc_school,
    req.body.ssc_passingyear,
    req.body.ssc_percentage,
    req.body.ssc_division
  ];
  req.session.educationaldetails = educationaldetails;
  let edu_additionalDetails = [];

  req.session.edu_additionalDetails = edu_additionalDetails;
  db.query(educationalDetailsQuery, educationaldetails, (error, results, fields) => {
    if (error) {
      console.error('Error inserting educational details:', error);
      return res.status(500).send("Internal Server Error");
    } else {
      const educationaldetails_id = results.insertId;

      const additionalDetailsQuery = `INSERT INTO edu_additionaldetails (
              educationaldetails_id,
              degree,
              college,
              subjects,
              yoj,
              yog,
              duration,
              perce,
              division
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

      const edu_additionalDetails = [];
      if (req.body.add_degree !== undefined) {
        for (let i = 0; i < req.body.add_degree.length; i++) {
          const edu_additionalDetailsValues = [
            educationaldetails_id,
            req.body.add_degree[i],
            req.body.add_college[i],
            req.body.add_subjects[i],
            req.body.add_yoj[i],
            req.body.add_yog[i],
            req.body.add_duration[i],
            req.body.add_perce[i],
            req.body.add_division[i]
          ];
          db.query(additionalDetailsQuery, edu_additionalDetailsValues, (error, results, fields) => {
            if (error) {
              console.error('Error inserting additional details:', error);
            }
          });
        }
      }
      res.redirect("/formpages/3");
    }
  });
});

app.get("/formpages/3", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;

  // Delete existing data from all tables where email matches
  db.query("DELETE FROM presentemployment WHERE email = ?", [userEmail], (err) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    db.query("DELETE FROM employmenthistory WHERE email = ?", [userEmail], (err) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      db.query("DELETE FROM teachingexp WHERE email = ?", [userEmail], (err) => {
        if (err) {
          return res.status(500).send("Internal Server Error");
        }
        db.query("DELETE FROM researchexp WHERE email = ?", [userEmail], (err) => {
          if (err) {
            return res.status(500).send("Internal Server Error");
          }
          db.query("DELETE FROM industrialexp WHERE email = ?", [userEmail], (err) => {
            if (err) {
              return res.status(500).send("Internal Server Error");
            }
            db.query("DELETE FROM aos_aor WHERE email = ?", [userEmail], (err) => {
              if (err) {
                return res.status(500).send("Internal Server Error");
              }
              db.query(
                "SELECT first_name, last_name FROM profile WHERE email = ?",
                [userEmail],
                (err, rows) => {
                  if (err) {
                    console.error("Error retrieving profile data:", err);
                    return res.status(500).send("Internal Server Error");
                  }
                  if (rows.length === 0) {
                    return res.status(404).send("Profile not found");
                  }
                  const { first_name, last_name } = rows[0];
                  res.render("formpages/3rd.ejs", {
                    firstname: first_name,
                    lastname: last_name,
                  });
                }
              );
            });
          });
        });
      });
    });
  });
});

app.post("/formpages/3", isAuthenticated, (req, res) => {
  req.body.email = req.session.currUser.email;
  const present = req.body.present;
  present.email = req.session.currUser.email;
  const aos_aor = req.body.aos_aor;
  aos_aor.email = req.session.currUser.email;
  db.query('INSERT INTO presentemployment SET ?', present, (err, result) => {
    if (err) throw err;
  });
  if (req.body.exp_position !== undefined) {
    for (let i = 0; i < req.body.exp_position.length; i++) {
      let data2 = [req.body.exp_position[i], req.body.exp_employer[i], req.body.exp_doj[i], req.body.exp_dol[i], req.body.exp_duration[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO employmenthistory(exp_position,exp_employer,exp_doj,exp_dol,exp_duration,email) Values (?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  if (req.body.t_exp_position !== undefined) {
    for (let i = 0; i < req.body.t_exp_position.length; i++) {
      let data2 = [req.body.t_exp_position[i], req.body.t_exp_employer[i], req.body.t_exp_course[i], req.body.t_ugpg[i], req.body.t_noofstudents[i], req.body.t_doj[i], req.body.t_dol[i], req.body.t_duration[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO teachingexp(t_exp_position,t_exp_employer,t_exp_course,t_ugpg,t_noofstudents,t_doj,t_dol,t_duration,email) Values (?,?,?,?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  if (req.body.r_exp_position !== undefined) {
    for (let i = 0; i < req.body.r_exp_position.length; i++) {
      let data2 = [req.body.r_exp_position[i], req.body.r_exp_institute[i], req.body.r_exp_supervisor[i], req.body.r_exp_doj[i], req.body.r_exp_dol[i], req.body.r_exp_duration[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO researchexp(r_exp_position,r_exp_institute,r_exp_supervisor,r_exp_doj,r_exp_dol,r_exp_duration,email) Values (?,?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  if (req.body.ind_exp_position !== undefined) {
    for (let i = 0; i < req.body.ind_exp_position.length; i++) {
      let data2 = [req.body.ind_exp_organization[i], req.body.ind_exp_workprofile[i], req.body.ind_exp_doj[i], req.body.ind_exp_dol[i], req.body.ind_exp_duration[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO industrialexp(ind_exp_organization,ind_exp_workprofile,ind_exp_doj,ind_exp_dol,ind_exp_duration,email) Values (?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  db.query('INSERT INTO aos_aor SET ?', aos_aor, (err, result) => {
    if (err) throw err;
  });
  res.redirect("/formpages/4");
});

app.get("/formpages/4", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;

  // Delete existing data from all tables where email matches
  db.query("DELETE FROM publications WHERE email = ?", [userEmail], (err) => {
    if (err) {
      console.error("Error deleting publications:", err);
      return res.status(500).send("Internal Server Error");
    }
    db.query("DELETE FROM top10publications WHERE email = ?", [userEmail], (err) => {
      if (err) {
        console.error("Error deleting top10publications:", err);
        return res.status(500).send("Internal Server Error");
      }
      db.query("DELETE FROM patents WHERE email = ?", [userEmail], (err) => {
        if (err) {
          console.error("Error deleting patents:", err);
          return res.status(500).send("Internal Server Error");
        }
        db.query("DELETE FROM books WHERE email = ?", [userEmail], (err) => {
          if (err) {
            console.error("Error deleting books:", err);
            return res.status(500).send("Internal Server Error");
          }
          db.query("DELETE FROM book_chapters WHERE email = ?", [userEmail], (err) => {
            if (err) {
              console.error("Error deleting book_chapters:", err);
              return res.status(500).send("Internal Server Error");
            }
            db.query("DELETE FROM googlelink WHERE email = ?", [userEmail], (err) => {
              if (err) {
                console.error("Error deleting book_chapters:", err);
                return res.status(500).send("Internal Server Error");
              }

              // Once deletion is complete, retrieve profile data
              db.query(
                "SELECT first_name, last_name FROM profile WHERE email = ?",
                [userEmail],
                (err, rows) => {
                  if (err) {
                    console.error("Error retrieving profile data:", err);
                    return res.status(500).send("Internal Server Error");
                  }
                  if (rows.length === 0) {
                    return res.status(404).send("Profile not found");
                  }
                  const { first_name, last_name } = rows[0];
                  res.render("formpages/4th.ejs", {
                    firstname: first_name,
                    lastname: last_name,
                  });
                }
              );
            });
          });
        });
      });
    });
  });
});

app.post("/formpages/4", isAuthenticated, (req, res) => {
  req.body.email = req.session.currUser.email;
  const data1 = req.body.one;
  data1.email = req.session.currUser.email;
  console.log(req.body);
  // Insert data into publications table
  db.query('INSERT INTO publications SET ?', data1, (err, result) => {
    if (err) throw err;
  });
  if (req.body.author !== undefined) {
    for (let i = 0; i < req.body.author.length; i++) {
      let data2 = [req.body.author[i], req.body.title[i], req.body.journal[i], req.body.year[i], req.body.impact[i], req.body.doi[i], req.body.status[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO top10publications(author,title,journal,year,impact,doi,status,email) Values (?,?,?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  if (req.body.pauthor !== undefined) {
    for (let i = 0; i < req.body.pauthor.length; i++) {
      let data2 = [req.body.pauthor[i], req.body.ptitle[i], req.body.p_country[i], req.body.p_number[i], req.body.pyear_filed[i], req.body.pyear_published[i], req.body.pyear_issued[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO patents(pauthor,ptitle,p_country,p_number,pyear_filed,pyear_published,pyear_issued,email) Values (?,?,?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  if (req.body.bauthor !== undefined) {
    for (let i = 0; i < req.body.bauthor.length; i++) {
      let data2 = [req.body.bauthor[i], req.body.btitle[i], req.body.byear[i], req.body.bisbn[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO books(bauthor,btitle,byear,bisbn,email) Values (?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  if (req.body.bc_author !== undefined) {
    for (let i = 0; i < req.body.bc_author.length; i++) {
      let data2 = [req.body.bc_author[i], req.body.bc_title[i], req.body.bc_year[i], req.body.bc_isbn[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO book_chapters(bc_author,bc_title,bc_year,bc_isbn,email) Values (?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  db.query('INSERT INTO googlelink(email,googlelink) Values (?,?)', [req.session.currUser.email, req.body.google_link], (err, result) => {
    if (err) throw err;
  });
  res.redirect("/formpages/5");
});


app.get("/formpages/5", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;

  // Delete existing data from all tables where email matches
  db.query("DELETE FROM membership WHERE email = ?", [userEmail], (err) => {
    if (err) {
      console.error("Error deleting publications:", err);
      return res.status(500).send("Internal Server Error");
    }
    db.query("DELETE FROM training WHERE email = ?", [userEmail], (err) => {
      if (err) {
        console.error("Error deleting top10publications:", err);
        return res.status(500).send("Internal Server Error");
      }
      db.query("DELETE FROM awards WHERE email = ?", [userEmail], (err) => {
        if (err) {
          console.error("Error deleting patents:", err);
          return res.status(500).send("Internal Server Error");
        }
        db.query("DELETE FROM sponsoredprojects WHERE email = ?", [userEmail], (err) => {
          if (err) {
            console.error("Error deleting books:", err);
            return res.status(500).send("Internal Server Error");
          }
          db.query("DELETE FROM consultancyprojects WHERE email = ?", [userEmail], (err) => {
            if (err) {
              console.error("Error deleting book_chapters:", err);
              return res.status(500).send("Internal Server Error");
            }

            // Once deletion is complete, retrieve profile data
            db.query(
              "SELECT first_name, last_name FROM profile WHERE email = ?",
              [userEmail],
              (err, rows) => {
                if (err) {
                  console.error("Error retrieving profile data:", err);
                  return res.status(500).send("Internal Server Error");
                }
                if (rows.length === 0) {
                  return res.status(404).send("Profile not found");
                }
                const { first_name, last_name } = rows[0];
                res.render("formpages/5th.ejs", {
                  firstname: first_name,
                  lastname: last_name,
                });
              }
            );
          });
        });
      });
    });
  });
});

app.post("/formpages/5", isAuthenticated, (req, res) => {
  if (req.body.professional_society_name !== undefined) {
    for (let i = 0; i < req.body.professional_society_name.length; i++) {
      let data2 = [req.body.professional_society_name[i], req.body.membership_status[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO membership(professional_society_name, membership_status,email) Values (?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  if (req.body.training_type !== undefined) {
    for (let i = 0; i < req.body.training_type.length; i++) {
      let data2 = [req.body.training_type[i], req.body.training_organization[i], req.body.training_year[i], req.body.training_duration[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO training(training_type, training_organization, training_year,training_duration,email) Values (?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  if (req.body.award_name !== undefined) {
    for (let i = 0; i < req.body.award_name.length; i++) {
      let data2 = [req.body.award_name[i], req.body.awarded_by[i], req.body.award_year[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO awards(award_name, awarded_by, award_year,email) Values (?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  if (req.body.sponsoring_agency !== undefined) {
    for (let i = 0; i < req.body.sponsoring_agency.length; i++) {
      let data2 = [req.body.sponsoring_agency[i], req.body.project_title[i], req.body.sanctioned_amount[i], req.body.project_period[i], req.body.project_role[i], req.body.project_status[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO sponsoredprojects(sponsoring_agency, project_title, sanctioned_amount, project_period, project_role, project_status,email) Values (?,?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  if (req.body.consultancy_organization !== undefined) {
    for (let i = 0; i < req.body.consultancy_organization.length; i++) {
      let data2 = [req.body.consultancy_organization[i], req.body.consultancy_title[i], req.body.grant_amount[i], req.body.consultancy_period[i], req.body.consultancy_role[i], req.body.consultancy_status[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO consultancyprojects(consultancy_organization, consultancy_title, grant_amount,consultancy_period,consultancy_role,consultancy_status,email) Values (?,?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  res.redirect("/formpages/6");
});

app.get("/formpages/6", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;

  // Delete existing data from all tables where email matches
  db.query("DELETE FROM phd_thesis WHERE email = ?", [userEmail], (err) => {
    if (err) {
      console.error("Error deleting publications:", err);
      return res.status(500).send("Internal Server Error");
    }
    db.query("DELETE FROM pg_thesis WHERE email = ?", [userEmail], (err) => {
      if (err) {
        console.error("Error deleting top10publications:", err);
        return res.status(500).send("Internal Server Error");
      }
      db.query("DELETE FROM ug_thesis WHERE email = ?", [userEmail], (err) => {
        if (err) {
          console.error("Error deleting patents:", err);
          return res.status(500).send("Internal Server Error");
        }

        // Once deletion is complete, retrieve profile data
        db.query(
          "SELECT first_name, last_name FROM profile WHERE email = ?",
          [userEmail],
          (err, rows) => {
            if (err) {
              console.error("Error retrieving profile data:", err);
              return res.status(500).send("Internal Server Error");
            }
            if (rows.length === 0) {
              return res.status(404).send("Profile not found");
            }
            const { first_name, last_name } = rows[0];
            res.render("formpages/6th.ejs", {
              firstname: first_name,
              lastname: last_name,
            });
          }
        );
      });
    });
  });
});

app.post("/formpages/6", isAuthenticated, (req, res) => {
  if (req.body.phd_name !== undefined) {
    for (let i = 0; i < req.body.phd_name.length; i++) {
      let data2 = [req.body.phd_name[i], req.body.phd_title[i], req.body.phd_role[i], req.body.phd_status[i], req.body.phd_year[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO phd_thesis(phd_name, phd_title,phd_role,phd_status,phd_year,email) Values (?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  if (req.body.pg_name !== undefined) {
    for (let i = 0; i < req.body.pg_name.length; i++) {
      let data2 = [req.body.pg_name[i], req.body.pg_title[i], req.body.pg_role[i], req.body.pg_status[i], req.body.pg_year[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO pg_thesis(pg_name, pg_title,pg_role,pg_status,pg_year,email) Values (?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  if (req.body.ug_name !== undefined) {
    for (let i = 0; i < req.body.ug_name.length; i++) {
      let data2 = [req.body.ug_name[i], req.body.ug_title[i], req.body.ug_role[i], req.body.ug_status[i], req.body.ug_year[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO ug_thesis(ug_name, ug_title,ug_role,ug_status,ug_year,email) Values (?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  res.redirect("/formpages/7");
});

app.get("/formpages/7", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;
  db.query(
    "SELECT first_name, last_name FROM profile WHERE email = ?",
    [userEmail],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving profile data:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (rows.length === 0) {
        return res.status(404).send("Profile not found");
      }
      const { first_name, last_name } = rows[0];
      res.render("formpages/7th.ejs", {
        firstname: first_name,
        lastname: last_name,
      });
    }
  );
});

app.post("/formpages/7", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;
  let data = [];
  data.push(userEmail);
  let {
    research_statement,
    teaching_statement,
    rel_in,
    prof_serv,
    jour_details,
    conf_details,
  } = req.body;
  // Check if the fields are defined before calling substring
  research_statement = research_statement ? research_statement.substring(3, research_statement.length - 6) : '';
  teaching_statement = teaching_statement ? teaching_statement.substring(3, teaching_statement.length - 6) : '';
  rel_in = rel_in ? rel_in.substring(3, rel_in.length - 6) : '';
  prof_serv = prof_serv ? prof_serv.substring(3, prof_serv.length - 6) : '';
  jour_details = jour_details ? jour_details.substring(3, jour_details.length - 6) : '';
  conf_details = conf_details ? conf_details.substring(3, conf_details.length - 6) : '';
  data.push(
    research_statement,
    teaching_statement,
    rel_in,
    prof_serv,
    jour_details,
    conf_details
  );
  req.session.page_7 = data;
  db.query(
    "INSERT INTO page_7(email,research_statement, teaching_statement,rel_in,prof_serv,jour_details,conf_details) Values (?,?,?,?,?,?,?)",
    data,
    (err, result) => {
      if (err) throw err;
    }
  );
  res.redirect("/formpages/8");
});

app.get("/formpages/8", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;
  console.log("Fetching profile data for email:", userEmail);
  db.query(
    "SELECT profile.first_name, profile.last_name,page_8.phd_path,page_8.pg_path,page_8.ug_path,page_8.tw_path,page_8.te_path,page_8.pay_path,page_8.noc_path,page_8.post_path,page_8.misc_path,page_8.sign_path FROM profile LEFT JOIN page_8 ON profile.email=page_8.email WHERE profile.email = ?",
    [userEmail],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving profile data:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (rows.length === 0) {
        return res.status(404).send("Profile not found");
      }
      const { first_name, last_name,phd_path,pg_path,ug_path,tw_path,te_path,pay_path,noc_path,post_path,misc_path, sign_path} = rows[0];
      const absolutePhdPath = `/${phd_path}`;
      const absolutePgPath = `/${pg_path}`;
      const absoluteUgPath = `/${ug_path}`;
      const absoluteTwPath = `/${tw_path}`;
      const absoluteTePath = `/${te_path}`;
      const absolutePayPath = `/${pay_path}`;
      const absoluteNocPath = `/${noc_path}`;
      const absolutePostPath = `/${post_path}`;
      const absoluteMiscPath = `/${misc_path}`;
      const absoluteSignPath = `/${sign_path}`;
    
      res.render("formpages/8th.ejs", {
        firstname: first_name,
        lastname: last_name,
        phdPath: absolutePhdPath,
        pgPath: absolutePgPath,
        ugPath: absoluteUgPath,
        twPath: absoluteTwPath,
        tePath: absoluteTePath,
        payPath: absolutePayPath,
        nocPath: absoluteNocPath,
        postPath: absolutePostPath,
        miscPath: absoluteMiscPath,
        signPath: absoluteSignPath,
      });
    }
  );
});

app.post("/formpages/8", isAuthenticated, (req, res) => {
  res.redirect("/formpages/9");
});

app.get("/formpages/9", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;
  db.query(
    "SELECT first_name, last_name FROM profile WHERE email = ?",
    [userEmail],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving profile data:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (rows.length === 0) {
        return res.status(404).send("Profile not found");
      }
      const { first_name, last_name } = rows[0];
      res.render("formpages/9th.ejs", {
        firstname: first_name,
        lastname: last_name,
      });
    }
  );
});

app.post("/formpages/9", isAuthenticated, (req, res) => {
  res.redirect("/printform");
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});


app.get("/printform", (req, res) => {
  const userEmail = req.session.currUser.email;
  db.query(
    "SELECT * FROM profile WHERE email = ?",
    [userEmail],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving profile data:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (rows.length === 0) {
        return res.status(404).send("Profile not found");
      }
      db.query(
        "SELECT * FROM personaldetails WHERE email = ?",
        [userEmail],
        (err, personalRows) => {
          if (err) {
            console.error("Error retrieving personal details:", err);
            return res.status(500).send("Internal Server Error");
          }
          db.query(
            "SELECT * FROM page_8 WHERE email = ?",
            [userEmail],
            (err, uploadRows) => {
              if (err) {
                console.error("Error retrieving upload details:", err);
                return res.status(500).send("Internal Server Error");
              }
              db.query(
                "SELECT * FROM datapage WHERE email = ?",
                [userEmail],
                (err, datapagerow) => {
                  if (err) {
                    console.error("Error retrieving upload details:", err);
                    return res.status(500).send("Internal Server Error");
                  }
                  db.query(
                    "SELECT * FROM educationaldetails WHERE email = ?",
                    [userEmail],
                    (err, educationaldetails) => {
                      if (err) {
                        console.error("Error retrieving upload details:", err);
                        return res.status(500).send("Internal Server Error");
                      }

                      let eddu = (educationaldetails && educationaldetails.length > 0) ? educationaldetails[0].id : null;

                      db.query(
                        "SELECT * FROM edu_additionaldetails WHERE educationaldetails_id = ?",
                        [eddu],
                        (err, edu_additionaldetails) => {
                          if (err) {
                            console.error("Error retrieving upload details:", err);
                            return res.status(500).send("Internal Server Error");
                          }
                         db.query(
                            "SELECT * FROM datapage WHERE email = ?",
                            [userEmail],
                            (err, publications) => {
                              if (err) {
                                console.error("Error retrieving upload details:", err);
                                return res.status(500).send("Internal Server Error");
                              }
                              db.query(
                                "SELECT * FROM presentemployment WHERE email = ?",
                                [userEmail],
                                (err, present) => {
                                  if (err) {
                                    console.error("Error retrieving upload details:", err);
                                    return res.status(500).send("Internal Server Error");
                                  }
                                  db.query(
                                    "SELECT * FROM employmenthistory WHERE email = ?",
                                    [userEmail],
                                    (err, employhist) => {
                                      if (err) {
                                        console.error("Error retrieving upload details:", err);
                                        return res.status(500).send("Internal Server Error");
                                      }
                                      db.query(
                                        "SELECT * FROM teachingexp WHERE email = ?",
                                        [userEmail],
                                        (err, teaching) => {
                                          if (err) {
                                            console.error("Error retrieving upload details:", err);
                                            return res.status(500).send("Internal Server Error");
                                          }
                                          db.query(
                                            "SELECT * FROM researchexp WHERE email = ?",
                                            [userEmail],
                                            (err, research) => {
                                              if (err) {
                                                console.error("Error retrieving upload details:", err);
                                                return res.status(500).send("Internal Server Error");
                                              }
                                              db.query(
                                                "SELECT * FROM industrialexp WHERE email = ?",
                                                [userEmail],
                                                (err, Industrial) => {
                                                  if (err) {
                                                    console.error("Error retrieving upload details:", err);
                                                    return res.status(500).send("Internal Server Error");
                                                  }
                                                  db.query(
                                                    "SELECT * FROM aos_aor WHERE email = ?",
                                                    [userEmail],
                                                    (err, aosaor) => {
                                                      if (err) {
                                                        console.error("Error retrieving upload details:", err);
                                                        return res.status(500).send("Internal Server Error");
                                                      }
                                                      db.query(
                                                        "SELECT * FROM publications WHERE email = ?",
                                                        [userEmail],
                                                        (err, publications) => {
                                                          if (err) {
                                                            console.error("Error retrieving upload details:", err);
                                                            return res.status(500).send("Internal Server Error");
                                                          }

                                                          db.query(
                                                            "SELECT * FROM top10publications WHERE email = ?",
                                                            [userEmail],
                                                            (err, top10publications) => {
                                                              if (err) {
                                                                console.error("Error retrieving upload details:", err);
                                                                return res.status(500).send("Internal Server Error");
                                                              }

                                                              db.query(
                                                                "SELECT * FROM patents WHERE email = ?",
                                                                [userEmail],
                                                                (err, patents) => {
                                                                  if (err) {
                                                                    console.error("Error retrieving upload details:", err);
                                                                    return res.status(500).send("Internal Server Error");
                                                                  }

                                                                  db.query(
                                                                    "SELECT * FROM books WHERE email = ?",
                                                                    [userEmail],
                                                                    (err, books) => {
                                                                      if (err) {
                                                                        console.error("Error retrieving upload details:", err);
                                                                        return res.status(500).send("Internal Server Error");
                                                                      }

                                                                      db.query(
                                                                        "SELECT * FROM book_chapters WHERE email = ?",
                                                                        [userEmail],
                                                                        (err, book_chapters) => {
                                                                          if (err) {
                                                                            console.error("Error retrieving upload details:", err);
                                                                            return res.status(500).send("Internal Server Error");
                                                                          }
                                                                          db.query(
                                                                            "SELECT * FROM googlelink WHERE email = ?",
                                                                            [userEmail],
                                                                            (err, googlelink) => {
                                                                              if (err) {
                                                                                console.error("Error retrieving upload details:", err);
                                                                                return res.status(500).send("Internal Server Error");
                                                                              }
                                                                              db.query(
                                                                                "SELECT * FROM membership WHERE email = ?",
                                                                                [userEmail],
                                                                                (err, membership) => {
                                                                                  if (err) {
                                                                                    console.error("Error retrieving upload details:", err);
                                                                                    return res.status(500).send("Internal Server Error");
                                                                                  }
                                                                                  db.query(
                                                                                    "SELECT * FROM training WHERE email = ?",
                                                                                    [userEmail],
                                                                                    (err, training) => {
                                                                                      if (err) {
                                                                                        console.error("Error retrieving upload details:", err);
                                                                                        return res.status(500).send("Internal Server Error");
                                                                                      }
                                                                                      db.query(
                                                                                        "SELECT * FROM awards WHERE email = ?",
                                                                                        [userEmail],
                                                                                        (err, awards) => {
                                                                                          if (err) {
                                                                                            console.error("Error retrieving upload details:", err);
                                                                                            return res.status(500).send("Internal Server Error");
                                                                                          }
                                                                                          db.query(
                                                                                            "SELECT * FROM phd_thesis WHERE email = ?",
                                                                                            [userEmail],
                                                                                            (err, phd_thesis) => {
                                                                                              if (err) {
                                                                                                console.error("Error retrieving upload details:", err);
                                                                                                return res.status(500).send("Internal Server Error");
                                                                                              }
                                                                                              db.query(
                                                                                                "SELECT * FROM pg_thesis WHERE email = ?",
                                                                                                [userEmail],
                                                                                                (err, pg_thesis) => {
                                                                                                  if (err) {
                                                                                                    console.error("Error retrieving upload details:", err);
                                                                                                    return res.status(500).send("Internal Server Error");
                                                                                                  }
                                                                                                  db.query(
                                                                                                    "SELECT * FROM ug_thesis WHERE email = ?",
                                                                                                    [userEmail],
                                                                                                    (err, ug_thesis) => {
                                                                                                      if (err) {
                                                                                                        console.error("Error retrieving upload details:", err);
                                                                                                        return res.status(500).send("Internal Server Error");
                                                                                                      }
                                                                                                      db.query(
                                                                                                        "SELECT * FROM sponsoredprojects WHERE email = ?",
                                                                                                        [userEmail],
                                                                                                        (err, sponsoredprojects) => {
                                                                                                          if (err) {
                                                                                                            console.error("Error retrieving upload details:", err);
                                                                                                            return res.status(500).send("Internal Server Error");
                                                                                                          }
                                                                                                          db.query(
                                                                                                            "SELECT * FROM consultancyprojects WHERE email = ?",
                                                                                                            [userEmail],
                                                                                                            (err, consultancyprojects) => {
                                                                                                              if (err) {
                                                                                                                console.error("Error retrieving upload details:", err);
                                                                                                                return res.status(500).send("Internal Server Error");

                                                                                                              }
                                                                                                              db.query(
                                                                                                                "SELECT * FROM datapage WHERE email = ?",
                                                                                                                [userEmail],
                                                                                                                (err, datapage) => {
                                                                                                                  if (err) {
                                                                                                                    console.error("Error retrieving upload details:", err);
                                                                                                                    return res.status(500).send("Internal Server Error");

                                                                                                                  }
                                                                                                                  db.query(
                                                                                                                    "SELECT * FROM page_7 WHERE email = ?",
                                                                                                                    [userEmail],
                                                                                                                    (err, page_7) => {
                                                                                                                      if (err) {
                                                                                                                        console.error("Error retrieving upload details:", err);
                                                                                                                        return res.status(500).send("Internal Server Error");

                                                                                                                      }
                                                                                                                      db.query(
                                                                                                                        "SELECT * FROM applicationdetails WHERE email = ?",
                                                                                                                        [userEmail],
                                                                                                                        (err, applicationdetails) => {
                                                                                                                          if (err) {
                                                                                                                            console.error("Error retrieving upload details:", err);
                                                                                                                            return res.status(500).send("Internal Server Error");

                                                                                                                          }
                                                                                                                          let sign_path = req.session.signpath ? req.session.signpath : null;
                                                                                                                  
                                                                                                                          let imagePath = req.session.image_path ? req.session.image_path : null;
                                                                                                              
                                                                                                                          res.render("formpages/print.ejs", {
                                                                                                                            rows, personalRows, educationaldetails,
                                                                                                                            research, Industrial,
                                                                                                                            edu_additionaldetails, present, employhist, teaching, aosaor, publications, top10publications, patents, book_chapters, books, googlelink, pg_thesis, ug_thesis, phd_thesis, awards, training, membership, sponsoredprojects, consultancyprojects,datapage, imagePath,page_7
                                                                                                                            , sign_path, applicationdetails
                                                                                                                          });
                                                                                                                        });
                                                                                                                    });
                                                                                                                });
                                                                                                            });
                                                                                                        });
                                                                                                    });
                                                                                                });
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
       });
    });
});


// res.render("formpages/print.ejs");
