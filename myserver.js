var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql2");

var app = express();

app.listen(2007, function () {
  console.log("Server Started...");
})
app.use(express.static("public"));
app.use(fileuploader());

app.get("/index", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/index.html");
})
//-----------------------------------------DB Operations------------------------------------------------//
app.use(express.urlencoded(true));

var dbConfig =
{
  host: "localhost",
  user: "root",
  password: "password14",
  database: "pro",
  dateStrings: true


}
var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (jasoos) {
  if (jasoos == null)
    console.log("connected successfully");
  else
    console.log(jasoos);
})

app.get("/chk-data", function (req, resp) {
  var email = req.query.kuchemail;
  var password = req.query.kuchpwd;
  var type = req.query.kuchtype;

  dbCon.query("insert into users values(?,?,?,current_date(),1)", [email, password, type], function (err) {
    if (err == null)
      resp.send("Record Saved Successfullyyyy");
    else
      console.log(err);


  })


  //ng-iniit  on page load karne ke liye

})

app.get("/chk-login", function (req, resp) {
  dbCon.query("select * from users where email=? and password=?", [req.query.kuchemail, req.query.kuchpwd], function (err, resulttable) {
    if (err == null) {
      if (resulttable.length != 1) {
        resp.send("invalid");
      }
      else {

        if (resulttable[0].statuss == 1)
          resp.send(resulttable[0].type);
        else
          resp.send("User Blocked");
      }
    }
    else
      console.log(JSON.stringify(err));
  })   
})

app.get("/json-rec-donor", function (req, resp) {
  
   
  dbCon.query("select * from donor where email=?", [req.query.kuchEmail], function (err, resultTableJSON) {
    if (err == null)
  {    resp.send(resultTableJSON);
  
  
  }
    else
     
      resp.send("email is not registered");
  })

})


app.post("/profile-get", function (req, resp) {

  dbCon.query("insert into donor values(?,?,?,?,?,?,?,?,?) ", [ req.body.txtEmail,req.body.txtname, req.body.txtmobile, req.body.txtadd, req.body.txtcity, req.body.txtid, req.body.txtpic, req.body.txtFrom, req.body.txtTo], function (err) {
    if (err == null)
      resp.send("Record saved successfullyyyyyyyyyyyyyyy.");
    else
      resp.send(err);
  });

});
///============================================================
app.post("/update-process", function (req, resp) {
  dbCon.query("update donor set  namee =?,moblie =?,address=?,city=?,proofid =?,picname=?,froma=?,toa=?where email=?", [req.body.txtname, req.body.txtmobile, req.body.txtadd, req.body.txtcity, req.body.txtid, req.body.txtpic, req.body.txtFrom, req.body.txtTo, req.body.txtEmail], function (err) {
    if (err == null)
      resp.send("Record Updated Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!");
    else
      resp.send(err);
  });
});







app.get("/chk-med", function (req, resp) {
  var email = (req.query.kuchemail);
  var name = (req.query.kuchname);
  var exp = (req.query.kuchexp);
  var pack = (req.query.kuchpack);
  var qty = (req.query.kuchqty);


  dbCon.query("insert into AMed values(?,?,?,?,?,?) ", [0,email,name, exp, pack, qty,email], function (err) {
    if (err == null) 
    {
     
      resp.send("Record saved successfullyyyyyyyyyyyyyyy.......");

    }
    else
     {
        resp.send(err);
     }}

  );
  
});





app.get("/get-angular-all-records", function (req, resp) {
  var email = req.query.kuchemail;
  // console.log(req.query.kuchemail);

  //fixed                             //same seq. as in table
  dbCon.query("select * from AMed  where email=?", [email], function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})


app.get("/do-angular-delete", function (req, resp) {
  //saving data in table
  var srno = req.query.kuchsrno;
  //  console.log(req.query.kuchsrno);


  //fixed                             //same seq. as in table
  dbCon.query("delete from AMed where srno=?", [srno], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1)
        resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyy!!!!!!!!!");
      else
        resp.send("Invalid Email id");
    }
    else
      resp.send(err);
  })
})

app.post("/saved-to-server", function (req, resp) {
  dbCon.query("insert into needy values(?,?,?,?,?,?,?,?)", [req.body.txtEmail, req.body.txtNamee, req.body.txtMobile, req.body.txtDob, req.body.txtGen, req.body.txtCity, req.body.txtAdd, req.body.txtPic], function (err) {

    if (err == null)
      resp.send("Record saved successfullyyyyyyyyyyyyyyy......");
    else
      resp.send(err);
  })


  });
  app.get("/findMed",function(req,resp){
    resp.sendFile(process.cwd()+"/project/Find-med.html");
  });
  app.get("/fetch-city-donors", function (req, resp) {
    console.log("j");
    dbCon.query("select distinct city from donor", function (err, resultTableJson) {
      if (err == null)
        resp.send(resultTableJson);

      else
        resp.send(err);
    });
  });
  app.get("/fetch-meds-donated-by-donors", function (req, resp) {
    console.log("y");
    dbCon.query("select distinct med from AMed", function (err, resultTableJson) {
      if (err == null)
        resp.send(resultTableJson);

      else
        resp.send(err);
    });
  });
 app.get("/fetch-donors",function(req,resp)
  {
    console.log(req.query);
    var med=req.query.Kuchmed;
    var city=req.query.Kuchcity;
  
    var query="select donor.email,donor.address,donor.city,donor.namee,donor.moblie,donor.froma,donor.toa,donor.picname,donor.proofid,AMed.med,AMed.qty,AMed.exp from donor  inner join AMed on donor.email= AMed.email where AMed.med=? and donor.city=? ";
    
  
    dbCon.query(query,[med,city],function(err,resultTable)
    {
      console.log(resultTable+"      "+err);
    if(err==null)
      resp.send(resultTable);
    else
      resp.send(err);
    })
  });

app.get("/update-pwd", function(req , resp){
  var email=req.query.kuchemail;
  console.log(email);
  var oldp=req.query.kuchold;
  var newpwd=req.query.kuchnew;
  var confirmP=req.query.kuchconf;

  if (oldp == newpwd) {
      resp.send("Old and new password are same");
    }
    if(newpwd!=confirmP) {
      resp.send("new and confirm password are different");
    }
  dbCon.query("update users set password=? where email=? and password=? ",[newpwd,email,oldp],function(err,result)
  {
    if(err)
      // resp.send("updated successfully")
       
{ console.log(req.query.kuchemail)
      resp.send("err")}

     else if(result.affectedRows==0)            
      { 
          resp.send("Incorrect old password or email");
      
      }
      else
      resp.send("password updated successfully");
      
    
  });
 })


  app.get("/fetch-donors",function(req,resp)
{
 // console.log(req.query);
  var med=req.query.Kuchmed;
  var city=req.query.Kuchcity;

  var query="select donor.email,donor.mobile,donor.froma,donor.toa,donor.pic,donor.namee,donor.address,donors.city,AMed.med from donor  inner join AMed on donor.email= AMed.email where AMed.med=? and donor.city=?";
  

  dbCon.query(query,[med,city],function(err,resultTable)
  {
   // console.log(resultTable+"      "+err);
  if(err==null)
    resp.send(resultTable);
  else
    resp.send(err);
  })




})

//==================================update password======================================================//








