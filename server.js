var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql2");


var app=express();

app.listen(2001,function(){
    console.log("Server Started...");
})
app.use(express.static("public"));
app.use(fileuploader());

app.get("/",function(req,resp)
{
      resp.sendFile(process.cwd()+"/public/index.html");
})


app.use(express.urlencoded(true));

var dbConfig={
    host:"127.0.0.1",
    user:"root",
    password:"root",
    database:"myproject",
    dateStrings:true,
}
var dbCon=mysql.createConnection(dbConfig);
dbCon.connect(function(jasoos)
{
    if(jasoos==null)
    console.log("Connected Hurrayyyyyyyy");
    else
    console.log(jasoos); 
})

app.get("/chk-info",function(req,resp)
{
     //saving data in table
    
    
         //fixed                             //same seq. as in table
  dbCon.query("insert into users2 values(?,?,current_date(),1,?)",[req.query.kuchEmail,req.query.kuchPwd,req.query.kuchType],function(err)
    {
          if(err==null)
            resp.send("Record Saved");
            else
            resp.send(err);
    })
})

app.get("/chk-logininfo",function(req,resp){
    console.log(req.query);
    
    dbCon.query("select * from users2 where emailid=? and password=?",[req.query.kuchEmailid,req.query.kuchPawd],function(err,resultTable){
      if(err==null)
      {
        if(resultTable.length==1)
          {
            if(resultTable[0].status==1)
              {
                console.log(resultTable[0].type);
                resp.send(resultTable[0].type);
              }
          else
             resp.send("You Are Blocked");
          }
      else
       resp.send("Invalid User ID/Password");
        }
        else
        {
          resp.send(err.toString());
        }
    })
  })
app.get("/profile-donor",function(req,resp){
  resp.sendFile(process.cwd()+"/public/profile-donor.html");
})
  //================================
  app.post("/projectsave",function(req,resp)
{   
  //============File Uploading==================
  var fileName="nopic.jpg";
  var emailKu=req.body.txtEmail;
  var nameKu=req.body.txtname;
  var mobileKu=req.body.txtmobile;
  var addressKu=req.body.txtadd;
  var cityKu=req.body.txtcity;
   var proofKu=req.body.idid;
   var from=req.body.amhours;
   var to=req.body.pmhours;
   var hour=from+"-"+to;

  if(req.files!=null)
  {
     fileName=req.files.ppic.name;
    var path=process.cwd()+"/public/uploads/"+fileName;
    req.files.ppic.mv(path);
  }
  else
  {
    fileName=req.body.hdn;
  }
  dbCon.query("insert into donors values(?,?,?,?,?,?,?,?)",[emailKu,nameKu,mobileKu,addressKu,cityKu,proofKu,fileName ,hour],function(err)
  {
          if(err==null)
          resp.send("Record Saved Hurrrayyyyyyyyyyy");
          else
          resp.send(err);
  })
})

app.get("/chkinfo" ,function(req,resp)
{
 console.log(req.query.kuchEmail);
  dbCon.query("select * from donors where emailid=?",[ req.query.kuchEmail],function(err,result)
  {
    if(err==null)
    {
      resp.send(result);
    }
    else
    resp.send(err);
  })



})
app.post("/my-update-p",function(req,resp)
{

  var fileName="nopic.jpg";
//if(fileName=="nopic.jpg")
// fileName = req.body.hdn;
//console.log( req.body.hdn);  //Update ki jagah koi pic nhi ayiii
  var emailKu=req.body.txtEmail;
  var nameKu=req.body.txtname;
  var mobileKu=req.body.txtmobile;
  var addressKu=req.body.txtadd;
  var cityKu=req.body.txtcity;
   var proofKu=req.body.idid;
   var from=req.body.amhours;
   var to=req.body.pmhours;
   var hour=from+"-"+to;
  if(req.files!=null)
  {
     fileName=req.files.ppic.name;
    var path=process.cwd()+"/public/uploads/"+fileName;
    req.files.ppic.mv(path);
  }
  else
  {
    fileName=req.body.hdn;
  }
  dbCon.query("update donors set name=?,mobile=?,address=?,city=?,proof=?,picname=?,hours=? where emailid=?",[nameKu,mobileKu,addressKu,cityKu,proofKu,fileName,hour,emailKu],function(err)
  {
          if(err==null)
          resp.send("Updates");
          else
          resp.send(err);
  })


})
//=====================AVAIL MEDICINE=======
app.get("/avail-med",function(req,resp)
{
  resp.sendFile(process.cwd()+"/public/avail-med.html");
})

app.get("/avail-info",function(req,resp)
{


  console.log(req.query.kuchEmail);
  console.log(req.query.kuchmed);
  console.log(req.query.kuchdate);
dbCon.query("insert into medsavailable5(email,med,expdate,packing,quantity) values(?,?,?,?,?) ",[req.query.kuchEmail,req.query.kuchmed,req.query.kuchdate,req.query.kuchidid,req.query.kuchquan],function(err){
  



  if(err==null)
resp.send("Saved");
else
resp.send(err);
})
})


//----------------Donor Settings-------------
app.get("/donor-dashboard",function(req,resp){
  resp.sendFile(process.cwd()+"/public/donor-dashboard.html");
})

app.get("/change-password", function (req, resp) {
  var email = req.query.Email;
  var oldpass = req.query.oldpass;
  var newpass = req.query.newpass;

  var data = [email, oldpass, newpass];
  dbCon.query("select * from users2 where emailid=? and password=?", data, function (err, table) {
      if (err != null)
          resp.send(err.toString());
      else if (table.length == 1) {
          if (newpass) {
              if (table[0].type == "Donor") {
                  var data = [newpass, email];
                  dbCon.query("update users2 set password=? where emailid=?", data, function (err, result) {
                      if (err != null)
                          resp.send(err.toString());
                      else
                          resp.send("Change Password Successfully.....");
                  });
              }
              else {
                  resp.send("U Are Not Donor");
              }
          }
          else {
              resp.send("Fill New Password");
          }
      }
      else
          resp.send("Plz Check Your Email Or Old Password");
  })
});

//============Needy===============================
app.get("/dash-needy",function(req,resp){
  resp.sendFile(process.cwd()+"/public/dash-needy.html");
})
app.get("/dash-admin",function(req,resp){
  resp.sendFile(process.cwd()+"/public/dash-admin.html");
})

app.get("/chkinfoneedy",function(req,resp)
{


  console.log(req.query.kuchEmail);

dbCon.query("select * from needy where emailid=?",[req.query.kuchEmail],function(err,result){
  



  if(err==null)
resp.send(result);
else
resp.send(err);
})
})

app.post("/projectUpdateneedy",function(req,resp){



  var fileName="nopic.jpg";
  //if(fileName=="nopic.jpg")
  // fileName = req.body.hdn;
  //console.log( req.body.hdn);  //Update ki jagah koi pic nhi ayiii
    var emailKu=req.body.txtEmail;
    var nameKu=req.body.txtname;
    var mobileKu=req.body.txtmobile;
    var dobKu=req.body.txtdob;
    var gendKu=req.body.txtgend;
    var cityKu=req.body.txtcity;
    var addressKu=req.body.txtadd;
  
    if(req.files!=null)
    {
       fileName=req.files.ppic.name;
      var path=process.cwd()+"/public/uploads/"+fileName;
      req.files.ppic.mv(path);
    }
    else
    {
      fileName=req.body.hdn;
    }
    dbCon.query("update needy set name=?,mobile=?,dob=?,gender=?,city=?,address=?,picname=? where emailid=?",[nameKu,mobileKu,dobKu,gendKu,cityKu,addressKu,fileName,emailKu],function(err)
    {
            if(err==null)
            resp.send("Updates");
            else
            resp.send(err);
    })
  






})

app.post("/projectsendto-server-needy",function(req,resp){



  var fileName="nopic.jpg";
  //if(fileName=="nopic.jpg")
  // fileName = req.body.hdn;
  //console.log( req.body.hdn);  //Update ki jagah koi pic nhi ayiii
    var emailKu=req.body.txtEmail;
    var nameKu=req.body.txtname;
    var mobileKu=req.body.txtmobile;
    var dobKu=req.body.txtdob;
    var gendKu=req.body.txtgend;
    var cityKu=req.body.txtcity;
    var addressKu=req.body.txtadd;
  
    if(req.files!=null)
    {
       fileName=req.files.ppic.name;
      var path=process.cwd()+"/public/uploads/"+fileName;
      req.files.ppic.mv(path);
    }
    else
    {
      fileName=req.body.hdn;
    }
    dbCon.query("insert into needy values(?,?,?,?,?,?,?,?)",[emailKu,nameKu,mobileKu,dobKu,gendKu,cityKu,addressKu,fileName],function(err)
    {
            if(err==null)
            resp.send("Record Saved");
            else
            resp.send(err);
    })
  







})

   
//==================================================Admin==============
app.get("/panel-users",function(req,resp){
  resp.sendFile(process.cwd()+"/public/panel-users.html");
})

app.get("/get-angular-all-records",function(req,resp)
{

 console.log(req.query.kuchEmail);

dbCon.query("select * from users2",function(err,result){
  



  if(err==null)
resp.send(result);
else
resp.send(err);
})
})

app.get("/get-angular-block-records",function(req,resp){


    dbCon.query("update users2 set status=0 where emailid=?",[req.query.emailKuch],function(err)
    {
            if(err==null)
            resp.send("Blocked");
            else
            resp.send(err);
    })
  





})

app.get("/get-angular-resume-records",function(req,resp){


  dbCon.query("update users2 set status=1 where emailid=?",[req.query.emailKuch],function(err)
  {
          if(err==null)
          resp.send("Resumed");
          else
          resp.send(err);
  })

})


app.get("/panel-donors",function(req,resp){
  resp.sendFile(process.cwd()+"/public/panel-donors.html");
})

app.get("/get-angular-all-records-donor",function(req,resp)
{

 console.log(req.query.kuchEmail);

dbCon.query("select * from donors",function(err,result){
  



  if(err==null)
resp.send(result);
else
resp.send(err);
})
})

app.get("/panel-needy",function(req,resp){
  resp.sendFile(process.cwd()+"/public/panel-needy.html");
})

app.get("/get-angular-all-records-needy",function(req,resp)
{

 console.log(req.query.kuchEmail);

dbCon.query("select * from needy",function(err,result){
  



  if(err==null)
resp.send(result);
else
resp.send(err);
})
})
//====================Medicine Manager========================
app.get("/med-manager",function(req,resp)
{
  resp.sendFile(process.cwd()+"/public/med-manager.html");
})

app.get("/get-angular-med-records",function(req,resp)
{

 

dbCon.query("select * from medsavailable5 where email=? ",[req.query.txtemail],function(err,result){
  



  if(err==null)
resp.send(result);
else
resp.send(err);
})
})
app.get("/do-angular-delete-med",function(req,resp)
{
  console.log(req.query);

dbCon.query("delete  from medsavailable5 where srno=?",[req.query.srno],function(err,result){
if(err==null)
resp.send(result);
else
resp.send(err);
})
})



//==========================Medicine-finder=City of combo==========================
app.get("/finder-med", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/finder-med.html");
});
app.get("/fetch-city-donors", function (req, resp) {
  dbCon.query("select distinct city from donors", function (err, resultTableJson) {
      if (err == null)
          resp.send(resultTableJson);

      else
          resp.send(err);
  });
});

//============================Medicine-finder=avalable medicines combo==============
app.get("/fetch-meds-donated-by-donors", function (req, resp) {
  dbCon.query("select distinct med from medsavailable5", function (err, resultTableJson) {
      if (err == null)
          resp.send(resultTableJson);

      else
          resp.send(err);
  });
});
//Medicine Manager

app.get("/med-manager",function(req,resp)
{
  resp.sendFile(process.cwd()   +  "/public/med-manager.html")
})


app.get("/fetch-donors",function(req,resp)
{
  console.log(req.query);
  var med=req.query.medKuch;
  var city=req.query.cityKuch;

  var query="select donors.emailid,donors.name,donors.mobile,donors.hours,donors.address,donors.city,donors.proof,donors.picname,medsavailable5.med from donors  inner join medsavailable5 on donors.emailid= medsavailable5.email where medsavailable5.med=? and donors.city=?";
  

  dbCon.query(query,[med,city],function(err,resultTable)
  {
    console.log(resultTable+"      "+err);
  if(err==null)
    resp.send(resultTable);
  else
    resp.send(err);
  })
})