var express = require("express");
var fileuploader = require("express-fileupload");

var mysql = require("mysql2");

var app = express();

app.use(fileuploader());

app.listen(1245, function () {
  console.log("Server started.....");
})

app.use(express.static("public"));  //can be placed anywhere

app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/index.html");
})

app.use(express.urlencoded(true));

// app.get("/fun", function (req, resp) {
//   var dir = process.cwd();  //current working directory hai
//   var file = __filename;   //inbuilt hai

//   //  console.log(dir+","+file);
//   resp.send(dir + "," + file);

// })


// app.get("/signup", function (req, resp) {
//   resp.sendFile(process.cwd() + "/public/mysignup.html");   //dont replace with dir chakda nahi
// })



// app.get("/login", function (req, resp) {
//   resp.contentType("text/html");
//   resp.write("<center><h3>Login Here</h3></center>");
//   resp.end();
// })

// app.get("/signup-process", function (req, resp) {

//   var quali = "  ";

//   if (req.query.qualib != undefined)
//     quali = req.query.qualib + ","; ///lke this works

//   if (req.query.qualim != undefined)
//     quali = quali + req.query.qualim;

//   if (req.query.qualib == undefined && req.query.qualim == undefined)
//     quali = "No Qualification";

//   if (quali.endsWith(","))      ///backspace
//     quali = quali.substring(0, quali.length - 1);
//   //////name =occu,txtEmail ,txtPwd                   quali a var
//   resp.send("Welcome=" + req.query.txtEmail + ",,,,,," + req.query.txtPwd + "Qualification=" + quali + ",Occupation=" + req.query.occu);
// })

// app.get("/signup-secure-process", function (req, resp) {
//   resp.sendFile(process.cwd() + "/public/signup-secure.html");

// })
// app.get("/db-sign", function (req, resp) {
//   resp.sendFile(process.cwd() + "/public/DB-signup.html");
// })




// ///================================================///////////////////////////////////////////////////////////
// app.use(express.urlencoded(true)); //binary to object conversion

// app.post("/signup-secure-process", function (req, resp) {
//   //resp.send("Welcome="+req.body.txtEmail+",,,,,"+req.body.txtPwd);
//   //console.log(req.body);

//   var quali = "  ";

//   if (req.query.qualib != undefined)
//     quali = req.query.qualib + ","; ///lke this works

//   if (req.query.qualim != undefined)
//     quali = quali + req.query.qualim;

//   if (req.query.qualib == undefined && req.query.qualim == undefined)
//     quali = "No Qualification";

//   if (quali.endsWith(","))      ///backspace
//     quali = quali.substring(0, quali.length - 1);
//   ///------------------file uploading======================

//   var fileName = "nopic.jpg"


//   ///============================File uploading===========
//   var fileName = "nopic.jpg";

//   if (req.files != null) ///PIC HAI MATLAB
//   {

//     fileName = req.files.ppic.name;
//     var path = process.cwd() + "/public/uploads/" + fileName;
//     req.files.ppic.mv(path);
//   }

//   var city = req.body.comboCity;////AISE HIAISE HI
//   var cities = req.body.listCity.toString();///

//   resp.send("Welcome=" + req.body.txtEmail + "<br>" + req.body.txtPwd + "<br> Qualification" + quali + "<br> Pic Name=" + fileName + "<br> City=" + city + "<br> Cities=" + cities);
//   console.log(req.body);///SARA KA SARA



///=///===========================================================================================================
///-==------------------------DB Operations--------------------
///===============Database Connectivity==================
var dbConfig = {
  host: "localhost",
  user: "root",
  password: "iShaani14#", //MYSQL WORKB
  database: "db2023",
  dateStrings: true
}

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (err) {
  if (err == null)
    console.log("Mysql server connected.........");
  else
    console.log(err.message);
})

// app.post("/db-signup-process-secure", function (req, resp) {
//   //---------File uploading=======================
//   var fileName = "nopic.jpg";
//   if (req.files != null) {
//     fileName = req.files.ppic.name;
//     var path = process.cwd() + "/public/uploads/" + fileName;
//     req.files.ppic.mv(path);

//   }

//   console.log(req.body)

//   var email = req.body.txtEmail;
//   var password = req.body.txtPwd;
//   var dob = req.body.dob;

//   dbCon.query("insert into users(email,password,picname,dob) values(?,?,?,?)", [email, password, fileName, dob], function (err) {
//     if (err == null)
//       resp.send("record saved successsfulllllllyyyyyyyyyyyyyyy");
//     else
//       resp.send(err);

//   })
// })
// //---------------------------------------------------
// app.post("/db-delete-process-secure", function (req, resp) {
//   var email = req.body.txtEmail;

//   dbCon.query("delete from users2023 where email=?", [email], function (err, result) {

//     if (err == null) {
//       if (result.affectRows == 1)
//         resp.send("Account Removed Successfullyyyyyyy");
//       else
//         resp.send("invalid email id");
//     }
//     else
//       resp.send(err);



//   })

// })
//--------------------------------------------
app.get("/chk-email", function (req, resp) {
  dbCon.query("select * from users2023 where email=?", [req.query.kuchEmail], function (err, resultTable) {
    if (err == null) {
      if (resultTable.length == 1)
        resp.send("Already Taken");
      else
        resp.send("Available............!!!!!");
    }
    else
      resp.send(err);

  })
})
//============================
app.get("/get-json-record", function (req, resp) {
  dbCon.query("select * from users2023 where email=?", [req.query.kuchEmail], function (err, resultTableJSON) {
    if (er == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})
//=========================================
app.post("/db-update-process-secure", function (req, resp) {
  //---------------File Uploading----------------
  var fileName;
  if (req.files != NULL) {
    fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/uploads" + fileName;
    req.files.ppic.mv(path);
  }
  else {
    fileName = req.body.hdn;
  }
  console.log(req.body);

  var email = req.body.txtEmail;
  var password = req.body.txtPwd;
  var dob = req.body.dob;

  dbCon.query("update users2023 set password=?,picname=?,dob=? where email=?", [password, fileName, dob, email], function (err) {
    if (err == null)
      resp.send("Record Updated Successsssfulllllyyyyyyyyyyyyyyy");
    else
      resp.send(err);
  })



});
//========ANGULAR JjjjjjjjjjjjjjjjjjjjjjjjjjjjjjSssssssssssssssssssssssssssss========================================
app.get("/angular", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/angular.html");
})

app.get("/get-angular-all-records", function (req, resp) {
  dbCon.query("select * from users2023", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON)
    else
      resp.send(err);
  })
})


app.get("/do-angular-delete", function (req, resp) {

  var email = req.query.emailkuch;
  dbCon.query("delete from users2023 where email=?", [email], function (err, result) {

    if (err == null) {
      if (result.affectedRows == 1)
        resp.send("Account Removed Successfullllyyyyyyyy");
      else
        resp.send("Invalid Email id");
    }
    else
      resp.send(err);
  })

})


//=========================================================






