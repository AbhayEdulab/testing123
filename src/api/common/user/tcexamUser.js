var config = require('../../../../config/config.json')['tcConfig']
const bcrypt = require('bcrypt');
const saltRounds = 10;
var mysql = require('mysql');

class tcExamUser {
    constructor() {
        this.tcconnection = mysql.createConnection({
            host     : config.host,
            user     : config.username,
            password : config.password,
            database : config.database
          });
    }


    connectDb(){
        this.tcconnection.connect(async function(err) {
            // in case of error
            if(err){
                console.log(err.code);
                console.log(err.fatal);
            }else{
            console.log("TCEXAM succesfully connected");
    
            }
        })
      }

     async hash(pass){
      let password = await bcrypt.hash(pass, saltRounds,async function(err, hash) {
         console.log("hash------>"+hash)
                return hash;
        })
        return password;
      }

     async addUser(event){
        // bcrypt.genSalt(saltRounds,async function(err, salt) {
        //               bcrypt.hash(params.password, salt,async function(err, hash) {
          let params = JSON.parse(event)
          // console.log("params-->>",params)
            // var key =JSON.parse(params["user"]);
          // console.log("key[Password]-ss-->>",params["Password"])
          // console.log("params.Password====>"+params.Password)
            
                          // Store hash in your password DB.
                        // let  hash = await this.hash(params["Password"])
                        // const salt = await bcrypt.genSalt(10);
                        // now we set user password to hashed password
                        const hash = await bcrypt.hash(params["Password"].toString(), await bcrypt.genSalt(10));

                        // {"firstName":"sp","lastName":"sp","login":"sp","age":24,"email":"shravan@sdbi.in","mobile":9665188437,"Street":"MUMBAI","City":"Mumbai","ZipCode":400014,"role":"student","Department":"sdbi","Course":"M.sc","academicYear":2022,"Password":1234}

                          console.log("---hash--->>"+hash)
                          var sql = await "INSERT INTO tce_users (user_name, user_password, user_email, user_regdate,user_ip, user_firstname, user_lastname, user_level) VALUES ('"+params["email"]+"', '"+hash+"', '"+params["email"]+"','2020-11-02 08:44:22','127.0.0.1','"+params["firstName"]+"','"+params["lastName"]+"','1');"
                          await this.tcconnection.query(sql, function(err, rows) {
                            if(err){
                                console.log("An error ocurred performing the query.",err);
                                return;
                            }
                         console.log("user created in tc")
                         return rows;
                         });
                    // })
      }

      endDb(){
        this.tcconnection.end(function(err){
            if(err){
              console.log("connection hasnt ended");
            }
            else {
              console.log("connection has ended");
            }
          })
      }

  }


  module.exports = tcExamUser;



// async function getPasswordHash(params) {
//     console.log("params--->>",params)

//      tcconnection.connect(async function(err) {
//       // in case of error
//       if(err){
//           console.log(err.code);
//           console.log(err.fatal);
//       }
//       else{
//         bcrypt.genSalt(saltRounds,async function(err, salt) {
//           bcrypt.hash('12345', salt,async function(err, hash) {
//               // Store hash in your password DB.
//               // console.log("hash--->>"+hash)
//               var sq12 = "INSERT INTO tce_users (user_name, user_password, user_email, user_regdate,user_ip, user_firstname, user_lastname, user_level) VALUES ('"+params.email+"', '"+hash+"', '"+params.email+"','2020-11-02 08:44:22','127.0.0.1','"+params.firstName+"','"+params.lastName+"','1');"
//               await tcconnection.query(sq12, function(err, rows) {
//                 if(err){
//                   // console.log("firstname",req.body.lastName );
//                     console.log("An error ocurred performing the query.",err);
//                     return;
//                 }
//                 tcconnection.end(function(err){
//                   if(err){
//                     console.log("connection hasnt ended");
//                   }
//                   else {
//                     console.log("connection has ended");
//                   }
//                 })
//                 return rows;
//                 });
              
//           });
//       });
//       }
      
//     });
   
//   }