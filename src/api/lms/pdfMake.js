var http = require('http');
var express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const pdfmake = require('pdfmake')
var path = require('path');
var _ = require('lodash');
var bodyParser = require('body-parser');
var moment = require('moment');
var currentDateTimeFormat = moment(new Date()).format("DD/MM/YYYY");
var qrcode = './image/Koala.jpg';
var path = require('path');
facultyPayment = require('../../app/models/facultyPayment')
var facultyPayment =  mongoose.model('facultyPayment')
//Sql
var root_path = path.dirname(require.main.filename);
var models = require('../../models');
const getSqlId = require('./../../utils/getSqlId');
var getId = new getSqlId();

var rootDir = path.resolve(path.dirname('.'));
var currentPath = process.cwd();
const config = require('config');
var sendgrid = require('@sendgrid/mail');
const { key } = config.get('sendGrid');
const sengrid_key = key;

var PdfPrinter = require('pdfmake/src/printer');

var fonts = {
  Roboto: {
    normal: currentPath+'/src/fonts/Roboto-Regular.ttf',
    bold: currentPath+'/src/fonts/Roboto-Medium.ttf',
    italics: currentPath+'/src/fonts/Roboto-Italic.ttf',
    bolditalics: currentPath+'/src/fonts/Roboto-MediumItalic.ttf'
    
  }
};
var printer = new PdfPrinter(fonts);
var fs = require('fs');



module.exports ={
facultyPaymentPdf:async function(user_id,fullName,dateRange,monthName,year,invoiceNumber,specialization,subject,totalMinutes,totalHours,ratePerHour,grossPay,TDS,PT,netPay,callback){
  var subjecth = subject

var currentPath = process.cwd();
var PdfPrinter = require('pdfmake/src/printer');
var fonts = {
Roboto: { 
  normal: currentPath+'/src/fonts/Roboto-Regular.ttf',
  bold: currentPath+'/src/fonts/Roboto-Medium.ttf',
  italics: currentPath+'/src/fonts/Roboto-Italic.ttf',
  bolditalics: currentPath+'/src/fonts/Roboto-MediumItalic.ttf'
}
};

var printer = new PdfPrinter(fonts);
var fs = require('fs');
  var docDefinition = {
    pageMargins:[40,150,40,112],
    header:{
          image: currentPath+"/src/public/pdfImages/header.png",
                alignment: 'center',
                height: 120, 
                width: 600
    },
    content:[
  { text:'Invoice Number :'+invoiceNumber, alignment: 'left'},
  { text:'Date :'+moment().format("DD MM YYYY"), alignment: 'right'},

      {
        style:{
          fontSize: 10,
          bold: false,
        } ,
        table: {
          widths: [150,180,170],
          headerRows: 1,
          margin:[40,80],
          body: [
            ['','',''],
            ['',{text:' '+specialization,alignment:'center',bold:true,fontSize:10},''],
            ['','',''],
            ['',{text:'Payment Slip : '+subject,alignment:'center',bold:true,fontSize: 10} ,''],
            ['','',''],
            ['',{text:' '+dateRange,alignment:'center',bold:true,fontSize: 10} ,''],
          ]
        },
        layout: 'noBorders',
      },
      {
        style:{
          fontSize: 9,
          bold: false,
        } ,
        table: {
          widths: [500],
          headerRows: 1,
          body: [
            [''],
            [
              {
                style:{
                  fontSize: 9,
                  bold: false,
                } ,
                table: {
                  widths: [247, 247],
                  headerRows: 1,
                  body: [
                    [{text:'Name of the Faculty',fontSize: 9},{text:''+fullName,fontSize: 9,bold:true}],
                    [{text:'Total in Minutes	 ',fontSize: 9},{text:''+totalMinutes,fontSize: 9,bold:true}],
                    [{text:'Total in Hours	 ',fontSize: 9},{text:''+totalHours,fontSize: 9,bold:true}],
                    [{text:'Rate per hour ',fontSize: 9},{text:''+ratePerHour,fontSize: 9,bold:true}],
                    [{text:'Gross Total',fontSize: 9}, {text:''+grossPay,fontSize: 9,bold:true}],
                    [{text:'TDS ',fontSize: 9}, {text:''+TDS,fontSize: 9,bold:true}],
                    [{text:'PT ',fontSize: 9}, {text:''+PT,fontSize: 9,bold:true}],
                    [{text:'Net Total ',fontSize: 9}, {text:''+netPay,fontSize: 9,bold:true}],
                  ]
                },
                layout: {
                    hLineColor: function (i, node) {
                     return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                    },
                    vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                   },
                  
                }
              }, 
            ],
            [''],
          ]
        },
        layout: 'noBorders',
      },
      {
          text:'Your faithfully,',
          alignment: 'left',
          margin: [ 5, 25]
       },
       {
           image: currentPath+"/src/public/pdfImages/signature.png",
           alignment: 'left',
           width: 120,
           height: 65,
       },
       {
          text:'Faculty Signature',
          alignment:'right',
      },
       {
           stack:[
             { text:'For School of Data Science and Business Intelligence', alignment: 'left'},
             { text:'Authorized Signature', alignment: 'left'},
              {text:' Date :'+moment().format("DD MM YYYY"), alignment: 'left'},
           ]
          
       },
 ],
 footer: {
  margin: [0, 0, 0, 40],
  height: -60,
   columns:[ 
      { image: currentPath+"/src/public/pdfImages/footer.png",
           alignment: 'top',
           height: 100, 
           width: 600
   },
   ],
  
   },
    defaultStyle: {
      alignment: 'justify',
      fontSize: 10
    }
  };

  var currentPath = process.cwd();
  var dir = currentPath+'/src/payment_PDF/'+user_id;

      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }

  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(dir+'/'+invoiceNumber+'pay.pdf'));
  pdfDoc.on('end',async function(){
        facultyPayment.find({
          invoiceNumber:invoiceNumber,
          specialization:specialization,
          subjects: subjecth,
          teacherId:user_id,
          type:'pay',
          fileName:invoiceNumber+'pay.pdf',
          month:monthName,
          year:year
      }).then(file=>{
          if(file ==''||file==undefined||file == null){

              facultyPayment.create({
                  invoiceNumber:invoiceNumber,
                  specialization:specialization,
                  subjects: subject,
                  teacherId:user_id,
                  type:'pay',
                  fileName:invoiceNumber+'pay.pdf',
                  month:monthName,
                  year:year,
                  })
          }else{
              var query={
                  invoiceNumber:invoiceNumber,
                  subjects:subject,
                  teacherId:user_id,
                  month:monthName,
                  year:year,
                  type:'pay',
              }
              update1={
                  $set:{
                      fileName:invoiceNumber+'pay.pdf',
                  }
              }    
      facultyPayment.updateOne(query, update1, function (err, payment) {

      })
          }
      })
        // var user = await getId.getUserId(user_id,'')
        //       var Subject = await getId.getSubjectId(subject) //remaining
        //      models.facultypayments.find({
        //       where:{
        //         invoiceNumber:invoiceNumber,
        //         specialization:specialization,
        //         subjectId:Subject.id,
        //         teacherId:user.id,
        //         type:'pay',
        //         fileName:invoiceNumber+'pay.pdf',
        //         month:monthName,
        //         year:year
        //       }
        //     }).then(file=>{
        //         if(file ==''||file==undefined||file == null){
        //           models.facultypayments.create({
        //             invoiceNumber:invoiceNumber,
        //             specialization:specialization,
        //             subjectId:Subject.id,
        //             teacherId:user.id,
        //             type:'pay',
        //             fileName:invoiceNumber+'pay.pdf',
        //             month:monthName,
        //             year:year,
        //           }).then(facultypayments=>{
        //             console.log("facultypayments")
        //           })
        //         }else{
        //           file.update({
        //             invoiceNumber:invoiceNumber,
        //             subjectId: Subject.id,
        //             teacherId:user.id,
        //             month:monthName,
        //             year:year,
        //             type:'pay',
        //           }).then(facultypayments=>{
        //             console.log("facultypaymentsUpdate")
        //           })
        //         }
        //     })
  })
  pdfDoc.end();
  callback();
},




lectureListPdf:async function(user_id,fullName,dateRange,monthName,year,createDate,invoiceNumber,specialization,subject,data,callback){
  var PdfPrinter = require('pdfmake/src/printer');
  var currentPath = process.cwd();   
  var fonts = {
       Roboto: { 
         normal: currentPath+'/src/fonts/Roboto-Regular.ttf',
         bold: currentPath+'/src/fonts/Roboto-Medium.ttf',
         italics: currentPath+'/src/fonts/Roboto-Italic.ttf',
         bolditalics: currentPath+'/src/fonts/Roboto-MediumItalic.ttf'
       }
     };
     
       var printer = new PdfPrinter(fonts);
       var fs = require('fs');
       var teacher = fullName.split(' ');
         var docDefinition = {
           pageMargins:[40,150,40,112],
           header:{
                 image: currentPath+"/src/public/pdfImages/header.png",
                       alignment: 'center',
                       height: 120, 
                       width: 600
           },
           footer: {
              margin: [0, 0, 0, 40],
               height: -60,
               columns:[  { image: currentPath+"/src/public/pdfImages/footer.png",
                        alignment: 'top',
                        height: 100, 
                        width: 600
                },
                ],
               
                },
           content:[
           { table:{
             widths:[250,250],
             headerRows: 1,
 
             body:[
            [ { text:'Invoice Number :'+invoiceNumber, alignment: 'left'},
             { text:'Date :'+moment().format("DD MM YYYY"), alignment: 'right'}]
 
            ]},
            layout: 'noBorders',
           },
             {
               style:{
                 fontSize: 10,
                 bold: false,
               } ,
               table: {
                 widths: [150,180,170,'auto','auto'],
                 headerRows: 1,
                 body: [
                   ['','',''],
                   ['',{text:''+specialization,alignment:'center',bold:true,fontSize:10},''],
                   ['','',''],
                   ['',{text:'Conducted Lecture List of : '+subject,alignment:'center',bold:true,fontSize: 10} ,''],
                   ['','',''],
                   ['',{text:''+dateRange,alignment:'center',bold:true,fontSize: 10} ,''],
                 ]
               },
               layout: 'noBorders',
             },
             {
               style:{
                 fontSize: 9,
                 bold: false,
               } ,
               table: {
                 widths: [500],
                 headerRows: 1,
                 body: [
                   [''],
                   [
                     {
                       style:{
                         fontSize: 9,
                         bold: false,
                       } ,
                       table: {
                         widths: [150, 150,150],
                         headerRows: 1,
                         alignment:'center',
                         body: [
                           [{text:'Name of the Faculty : '+fullName,fontSize: 9,bold:true,colSpan:3, alignment:'center'},{},{}],
                           [{text:'Lecture Date',alignment:'center'}, {text:'Lecture Time',alignment:'center'}, {text:'Time(mins)',alignment:'center'}],
   ]
                       },
                       layout: {
                           hLineColor: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                           },
                           vLineColor: function (i, node) {
                           return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                          },
                         
                       }
                     }, 
                   ],
                   [''],
                 ]
               },
               layout: 'noBorders',
             },
          
             
           ],
             defaultStyle: {
             alignment: 'justify',
             fontSize: 10
           }
         };
       
         data.forEach((lect)=>{
       docDefinition.content.push([
                {
                     table: {
                     widths: [150, 150,150],
                     headerRows : 1,
                     alignment:'center',
                     body: [
                         [{text:' '+lect.date,alignment:'center'},{text: ' '+lect.fromTime+"-"+lect.toTime,alignment:'center'},{text: ' '+lect.totalTime,alignment:'center'}]
                     
                       
                     ]
                   }
                 },
       ])
     })
 
         docDefinition.content.push([
             {
                 text:'Your faithfully,',
                 alignment: 'left',           
                 margin: [ 5, 25]
  
              },
              {
                  image: currentPath+"/src/public/pdfImages/signature.png",
                  alignment: 'left',
                  width: 120,
                  height: 65,
              },
              {
                  text:'Faculty Signature',
                  alignment:'right',
                  marginRight:30
              },
              {
                stack:[  {text:'For School of Data Science and Business Intelligence', alignment: 'left'},
                  {text:'Authorized Signature', alignment: 'left'},
                  {text:'Date:'+moment().format("DD MM YYYY"), alignment: 'left'},
              ]
              },
         ])
         var fs = require('fs');
         var currentPath = process.cwd();
         var dir = currentPath+'/src/payment_PDF/'+user_id;
 
         if (!fs.existsSync(dir)){
             fs.mkdirSync(dir);
         }
         
             var pdfDoc = printer.createPdfKitDocument(docDefinition);
             pdfDoc.pipe(fs.createWriteStream(dir+'/'+invoiceNumber+'L.pdf'));
             pdfDoc.on('end',function(){
               facultyPayment.find({
                 invoiceNumber:invoiceNumber,
                 specialization:specialization,
                 subjects: subject,
                 teacherId:user_id,
                 type:'lecture',
                 fileName:invoiceNumber+'L.pdf',
                 month:monthName,
                 year:year
             }).then(file=>{
                 if(file ==''||file==undefined||file == null){
 
                     facultyPayment.create({
                         invoiceNumber:invoiceNumber,
                         specialization:specialization,
                         subjects: subject,
                         teacherId:user_id,
                         type:'lecture',
                         fileName:invoiceNumber+'L.pdf',
                         month:monthName,
                         year:year,
                         })
                 }else{
                     var query={
                         invoiceNumber:invoiceNumber,
                         subjects:subject,
                         teacherId:user_id,
                         month:monthName,
                         year:year,
                         type:'lecture',
                     }
                     update1={
                         $set:{
                             fileName:invoiceNumber+'L.pdf',
                         }
                     }    
         facultyPayment.updateOne(query, update1, function (err, payment) {
             
         })
                 }
             })
             })
            //    var user = await getId.getUserId(user_id,'')
            //     var Subject = await getId.getSubjectId(subject)//remaining 
            //  models.facultypayments.find({
            //    where:{
            //      invoiceNumber:invoiceNumber,
            //      specialization:specialization,
            //      subjectId:Subject.id,
            //      teacherId:user.id,
            //      type:'lecture',
            //      fileName:invoiceNumber+'L.pdf',
            //      month:monthName,
            //      year:year
            //    }
            //  }).then(file=>{
            //      if(file ==''||file==undefined||file == null){
            //        models.facultypayments.create({
            //          invoiceNumber:invoiceNumber,
            //          specialization:specialization,
            //          subjectId:Subject.id,
            //          teacherId:user.id,
            //          type:'lecture',
            //          fileName:invoiceNumber+'L.pdf',
            //          month:monthName,
            //          year:year,
            //        }).then(facultypayments=>{
            //          console.log("facultypayments")
            //        })
            //      }else{
            //        file.update({
            //          invoiceNumber:invoiceNumber,
            //          subjectId:Subject.id,
            //          teacherId:user.id,
            //          month:monthName,
            //          year:year,
            //          type:'lecture',
            //        }).then(facultypayments=>{
            //          console.log("facultypaymentsUpdate")
            //        })
            //      }
            //  })
             pdfDoc.end();
             docDefinition=null;
             callback();
         
         
     },

    monthWiseTeacherLectureData:function(data){
      var PdfPrinter = require('pdfmake/src/printer');
      var currentPath = process.cwd();   
      var fonts = {
           Roboto: { 
             normal: currentPath+'/src/fonts/Roboto-Regular.ttf',
             bold: currentPath+'/src/fonts/Roboto-Medium.ttf',
             italics: currentPath+'/src/fonts/Roboto-Italic.ttf',
             bolditalics: currentPath+'/src/fonts/Roboto-MediumItalic.ttf'
           }
         };

         var printer = new PdfPrinter(fonts);
         var fs = require('fs');

          var docDefinition = {
          pageMargins:[40,150,40,112],
          header:{
                image: currentPath+"/src/public/pdfImages/header.png",
                      alignment: 'center',
                      height: 120, 
                      width: 600
          },
          footer: {
             margin: [0, 0, 0, 40],
              height: -60,
              columns:[  { image: currentPath+"/src/public/pdfImages/footer.png",
                       alignment: 'top',
                       height: 100, 
                       width: 600
               },
               ],
              
               },
          content:[
          { table:{
            widths:[250,250],
            headerRows: 1,

            body:[
           [ { text:'Date :'+moment().format("DD MM YYYY"), alignment: 'right'}]

           ]},
           layout: 'noBorders',
          },
            {
              style:{
                fontSize: 10,
                bold: false,
              } ,
              table: {
                widths: [150,180,170,'auto','auto'],
                headerRows: 1,
                body: [
                  ['','',''],
                  ['',{text:''+moment().subtract(1, 'months').format('MMMM'),alignment:'center',bold:true,fontSize:10},'']
                ]
              },
              layout: 'noBorders',
            },
            {
              style:{
                fontSize: 9,
                bold: false,
              } ,
              table: {
                widths: [500],
                headerRows: 1,
                body: [
                  [''],
                  [
                    {
                      style:{
                        fontSize: 9,
                        bold: false,
                      } ,
                      table: {
                        widths: [150, 150,150],
                        headerRows: 1,
                        alignment:'center',
                        body: [
                          [{text:'Teacher Name',alignment:'center'}, {text:'Course',alignment:'center'}, {text:'Batch',alignment:'center'},{text:'Semester',alignment:'center'},{text:'Subject',alignment:'center'},{text:'Total Hours',alignment:'center'},{text:'Remaining Hours',alignment:'center'}] 
                        ]
                      },
                      layout: {
                          hLineColor: function (i, node) {
                           return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                          },
                          vLineColor: function (i, node) {
                          return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                         },
                        
                      }
                    }, 
                  ],
                  [''],
                ]
              },
              layout: 'noBorders',
            },
         
            
          ],
            defaultStyle: {
            alignment: 'justify',
            fontSize: 10
          }
        };
        data.forEach((elm)=>{
          docDefinition.content.push([
                   {
                        table: {
                        widths: [150, 150,150],
                        headerRows : 1,
                        alignment:'center',
                        body: [
                            [{text:' '+elm.teacherName,alignment:'center'},{text: ' '+elm.courseName,alignment:'center'},{text: ' '+elm.batchName+"("+elm.batchYear+")",alignment:'center'},{text: ' '+elm.semesterName,alignment:'center'},{text: ' '+elm.subject,alignment:'center'},{text: ' '+elm.hours+"-"+elm.min,alignment:'center'},{text: ' '+elm.remaining,alignment:'center'}]  
                        ]
                      }
                    },
          ])
        })

        docDefinition.content.push([
          {
              text:'Your faithfully,',
              alignment: 'left',           
              margin: [ 5, 25]

           },
           {
               image: currentPath+"/src/public/pdfImages/signature.png",
               alignment: 'left',
               width: 120,
               height: 65,
           },
           {
             stack:[  {text:'For School of Data Science and Business Intelligence', alignment: 'left'},
               {text:'Authorized Signature', alignment: 'left'},
               {text:'Date:'+moment().format("DD MM YYYY"), alignment: 'left'},
           ]
           },
      ])
  var fs = require('fs');
  var currentPath = process.cwd();
  var dir = currentPath+'/src/LectureData'
  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(dir+'/LectureMonth-'+moment().subtract(1, 'months').format('MMMM')+'.pdf'));
  var filePath = currentPath+'/src/LectureData/LectureMonth-'+moment().subtract(1, 'months').format('MMMM')+'.pdf'
  pdfDoc.on('end',function(){
    sendgrid.setApiKey(sengrid_key);
    attachment = fs.readFileSync(filePath).toString("base64");
    sendgrid.send({
      to: ['info@sdbi.in'],
      from: 'updates@sdbi.in',
      subject: `Schedule: ${startdate} to ${enddate}`,
      html: `Hello Admin,`
        + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is for monthly scheduled data.`
        + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please find the attachment given below for data from ${startdate} to ${enddate}`
        + `<br><br>Thank you,`
        + `<br>LMS Support Team`,

      attachments: [
        {
          content: attachment,
          filename: '("lecture")monthlyhours.pdf',
          type: "application/pdf",
          disposition: "attachment"
        }
      ]
    }).then(() => {
      console.log('Email sent')
    })
      .catch((error) => {
        console.error(error)
      })

})
      
    },

    weekWiseTeacherLectureData:function(data){
      var PdfPrinter = require('pdfmake/src/printer');
      var currentPath = process.cwd();   
      var fonts = {
           Roboto: { 
             normal: currentPath+'/src/fonts/Roboto-Regular.ttf',
             bold: currentPath+'/src/fonts/Roboto-Medium.ttf',
             italics: currentPath+'/src/fonts/Roboto-Italic.ttf',
             bolditalics: currentPath+'/src/fonts/Roboto-MediumItalic.ttf'
           }
         };

         var printer = new PdfPrinter(fonts);
         var fs = require('fs');

          var docDefinition = {
          pageMargins:[40,150,40,112],
          header:{
                image: currentPath+"/src/public/pdfImages/header.png",
                      alignment: 'center',
                      height: 120, 
                      width: 600
          },
          footer: {
             margin: [0, 0, 0, 40],
              height: -60,
              columns:[  { image: currentPath+"/src/public/pdfImages/footer.png",
                       alignment: 'top',
                       height: 100, 
                       width: 600
               },
               ],
              
               },
          content:[
          { table:{
            widths:[250,250],
            headerRows: 1,

            body:[
           [ { text:'Date :'+moment().format("DD MM YYYY"), alignment: 'right'}]

           ]},
           layout: 'noBorders',
          },
            {
              style:{
                fontSize: 10,
                bold: false,
              } ,
              table: {
                widths: [150,180,170,'auto','auto'],
                headerRows: 1,
                body: [
                  ['','',''],
                  ['',{text:'Weekly Till'+moment().format("DD MM YYYY"),alignment:'center',bold:true,fontSize:10},'']
                ]
              },
              layout: 'noBorders',
            },
            {
              style:{
                fontSize: 9,
                bold: false,
              } ,
              table: {
                widths: [500],
                headerRows: 1,
                body: [
                  [''],
                  [
                    {
                      style:{
                        fontSize: 9,
                        bold: false,
                      } ,
                      table: {
                        widths: [150, 150,150],
                        headerRows: 1,
                        alignment:'center',
                        body: [
                          [{text:'Teacher Name',alignment:'center'}, {text:'Course',alignment:'center'}, {text:'Batch',alignment:'center'},{text:'Semester',alignment:'center'},{text:'Subject',alignment:'center'},{text:'Total Hours',alignment:'center'},{text:'Remaining Hours',alignment:'center'}] 
                        ]
                      },
                      layout: {
                          hLineColor: function (i, node) {
                           return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                          },
                          vLineColor: function (i, node) {
                          return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                         },
                        
                      }
                    }, 
                  ],
                  [''],
                ]
              },
              layout: 'noBorders',
            },
         
            
          ],
            defaultStyle: {
            alignment: 'justify',
            fontSize: 10
          }
        };
        data.forEach((elm)=>{
          docDefinition.content.push([
                   {
                        table: {
                        widths: [150, 150,150],
                        headerRows : 1,
                        alignment:'center',
                        body: [
                            [{text:' '+elm.teacherName,alignment:'center'},{text: ' '+elm.courseName,alignment:'center'},{text: ' '+elm.batchName+"("+elm.batchYear+")",alignment:'center'},{text: ' '+elm.semesterName,alignment:'center'},{text: ' '+elm.subject,alignment:'center'},{text: ' '+elm.hours+"-"+elm.min,alignment:'center'},{text: ' '+elm.remaining,alignment:'center'}]  
                        ]
                      }
                    },
          ])
        })

        docDefinition.content.push([
          {
              text:'Your faithfully,',
              alignment: 'left',           
              margin: [ 5, 25]

           },
           {
               image: currentPath+"/src/public/pdfImages/signature.png",
               alignment: 'left',
               width: 120,
               height: 65,
           },
           {
             stack:[  {text:'For School of Data Science and Business Intelligence', alignment: 'left'},
               {text:'Authorized Signature', alignment: 'left'},
               {text:'Date:'+moment().format("DD MM YYYY"), alignment: 'left'},
           ]
           },
      ])

      var fs = require('fs');
      var currentPath = process.cwd();
      var dir = currentPath+'/src/LectureData'
      var pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(dir+'/LectureMonth-'+moment().subtract(1, 'months').format('MMMM')+'.pdf'));
      var filePath = currentPath+'/src/LectureData/LectureMonth-'+moment().subtract(1, 'months').format('MMMM')+'.pdf'
      pdfDoc.on('end',function(){
        sendgrid.setApiKey(sengrid_key);
        attachment = fs.readFileSync(filePath).toString("base64");
        sendgrid.send({
          to: ['info.sdbi.in'],
          from: 'updates@sdbi.in',
          subject: `Schedule: ${startdate} to ${enddate}`,
          html: `Hello Admin,`
            + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is for monthly scheduled data.`
            + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please find the attachment given below for data from ${startdate} to ${enddate}`
            + `<br><br>Thank you,`
            + `<br>LMS Support Team`,
    
          attachments: [
            {
              content: attachment,
              filename: '("lecture")weeklyhours.pdf',
              type: "application/pdf",
              disposition: "attachment"
            }
          ]
        }).then(() => {
          console.log('Email sent')
        })
          .catch((error) => {
            console.error(error)
          })
    
      })
    },
    TriggerTeacherLectureData:function(email,data){
      var PdfPrinter = require('pdfmake/src/printer');
      var currentPath = process.cwd();   
      var fonts = {
           Roboto: { 
             normal: currentPath+'/src/fonts/Roboto-Regular.ttf',
             bold: currentPath+'/src/fonts/Roboto-Medium.ttf',
             italics: currentPath+'/src/fonts/Roboto-Italic.ttf',
             bolditalics: currentPath+'/src/fonts/Roboto-MediumItalic.ttf'
           }
         };

         var printer = new PdfPrinter(fonts);
         var fs = require('fs');

          var docDefinition = {
          pageMargins:[40,150,40,112],
          header:{
                image: currentPath+"/src/public/pdfImages/header.png",
                      alignment: 'center',
                      height: 120, 
                      width: 600
          },
          footer: {
             margin: [0, 0, 0, 40],
              height: -60,
              columns:[  { image: currentPath+"/src/public/pdfImages/footer.png",
                       alignment: 'top',
                       height: 100, 
                       width: 600
               },
               ],
              
               },
          content:[
          { table:{
            widths:[250,250],
            headerRows: 1,

            body:[
           [ { text:'Date :'+moment().format("DD MM YYYY"), alignment: 'right'}]

           ]},
           layout: 'noBorders',
          },
            {
              style:{
                fontSize: 10,
                bold: false,
              } ,
              table: {
                widths: [150,180,170,'auto','auto'],
                headerRows: 1,
                body: [
                  ['','',''],
                  ['',{text:''+moment().subtract(1, 'months').format('MMMM'),alignment:'center',bold:true,fontSize:10},'']
                ]
              },
              layout: 'noBorders',
            },
            {
              style:{
                fontSize: 9,
                bold: false,
              } ,
              table: {
                widths: [500],
                headerRows: 1,
                body: [
                  [''],
                  [
                    {
                      style:{
                        fontSize: 9,
                        bold: false,
                      } ,
                      table: {
                        widths: [150, 150,150],
                        headerRows: 1,
                        alignment:'center',
                        // margin:[5],
                        body: [
                          [{text:'Teacher Name',alignment:'center'}, {text:'Course',alignment:'center'}, {text:'Batch',alignment:'center'},{text:'Semester',alignment:'center'},{text:'Subject',alignment:'center'},{text:'Total Hours',alignment:'center'},{text:'Remaining Hours',alignment:'center'}] 
                        ]
                      },
                      layout: {
                          hLineColor: function (i, node) {
                           return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                          },
                          vLineColor: function (i, node) {
                          return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                         },
                        
                      }
                    }, 
                  ],
                  [''],
                ]
              },
              layout: 'noBorders',
            },
         
            
          ],
            defaultStyle: {
            alignment: 'justify',
            fontSize: 10
          }
        };
        data.forEach((elm)=>{
          docDefinition.content.push([
                   {
                        table: {
                        widths: [150, 150,150],
                        headerRows : 1,
                        alignment:'center',
                        body: [
                            [{text:' '+elm.teacherName,alignment:'center'},{text: ' '+elm.courseName,alignment:'center'},{text: ' '+elm.batchName+"("+elm.batchYear+")",alignment:'center'},{text: ' '+elm.semesterName,alignment:'center'},{text: ' '+elm.subject,alignment:'center'},{text: ' '+elm.hours+"-"+elm.min,alignment:'center'},{text: ' '+elm.remaining,alignment:'center'}]  
                        ]
                      }
                    },
          ])
        })

        docDefinition.content.push([
          {
              text:'Your faithfully,',
              alignment: 'left',           
              margin: [ 5, 25]

           },
           {
               image: currentPath+"/src/public/pdfImages/signature.png",
               alignment: 'left',
               width: 120,
               height: 65,
           },
           {
             stack:[  {text:'For School of Data Science and Business Intelligence', alignment: 'left'},
               {text:'Authorized Signature', alignment: 'left'},
               {text:'Date:'+moment().format("DD MM YYYY"), alignment: 'left'},
           ]
           },
      ])
      if(email){
          var fs = require('fs');
          var currentPath = process.cwd();
          var dir = currentPath+'/src/LectureData'
          var pdfDoc = printer.createPdfKitDocument(docDefinition);
          pdfDoc.pipe(fs.createWriteStream(dir+'/LectureMonth-'+moment().subtract(1, 'months').format('MMMM')+'.pdf'));
          var filePath = currentPath+'/src/LectureData/LectureMonth-'+moment().subtract(1, 'months').format('MMMM')+'.pdf'
          pdfDoc.on('end',function(){
            sendgrid.setApiKey(sengrid_key);
            attachment = fs.readFileSync(filePath).toString("base64");
            sendgrid.send({
              to: email,
              from: 'updates@sdbi.in',
              subject: `Schedule: ${startdate} to ${enddate}`,
              html: `Hello Admin,`
                + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is for monthly scheduled data.`
                + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please find the attachment given below for data from ${startdate} to ${enddate}`
                + `<br><br>Thank you,`
                + `<br>LMS Support Team`,
        
              attachments: [
                {
                  content: attachment,
                  filename: '("lecture")monthlyhours.pdf',
                  type: "application/pdf",
                  disposition: "attachment"
                }
              ]
            }).then(() => {
              console.log('Email sent')
            })
              .catch((error) => {
                console.error(error)
              })
        
          })
      }else{
        data.forEach(elm=>{
          var fs = require('fs');
          var currentPath = process.cwd();
          var dir = currentPath+'/src/LectureData'
          var pdfDoc = printer.createPdfKitDocument(docDefinition);
          pdfDoc.pipe(fs.createWriteStream(dir+'/LectureMonth-'+moment().subtract(1, 'months').format('MMMM')+'.pdf'));
          var filePath = currentPath+'/src/LectureData/LectureMonth-'+moment().subtract(1, 'months').format('MMMM')+'.pdf'
          pdfDoc.on('end',function(){
            sendgrid.setApiKey(sengrid_key);
            attachment = fs.readFileSync(filePath).toString("base64");
            sendgrid.send({
              to: elm.user[0].email,
              from: 'updates@sdbi.in',
              subject: `Schedule: ${startdate} to ${enddate}`,
              html: `Hello Admin,`
                + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is for monthly scheduled data.`
                + `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please find the attachment given below for data from ${startdate} to ${enddate}`
                + `<br><br>Thank you,`
                + `<br>LMS Support Team`,
        
              attachments: [
                {
                  content: attachment,
                  filename: '("lecture")monthlyhours.pdf',
                  type: "application/pdf",
                  disposition: "attachment"
                }
              ]
            }).then(() => {
              console.log('Email sent')
            })
              .catch((error) => {
                console.error(error)
              })
        
          })
        })
      }

      
    },

   
}





