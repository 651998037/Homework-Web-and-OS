const controller ={};
const { validationResult } = require('express-validator');
const moment = require('moment');

// const { InfluxDB, Point } = require("@influxdata/influxdb-client");
// const token =
//   "AGB55bvbOoYPsmuYb8lv4GIBKC2vmb-Ut8x4by_FlJNdf0_mCWbIVwWyBJ0X4XMODH2qAroVGHzetsoLuHxnQg==";
// const url = "https://us-east-1-1.aws.cloud2.influxdata.com";
// const client = new InfluxDB({ url, token });
// let org = `74554ba6d34f8f12`;
// let bucket = `dashboard37`;


// let writeClient = client.getWriteApi(org, bucket, 'ns')

// let point = new Point('dashboard37')
// .tag('device','abc')
// .intField('temp',50)
// void setTimeout(() => {
// writeClient.writePoint(point)
// }, 1000) // separate points by 1 second
// void setTimeout(() => {
// writeClient.flush()
// }, 5000)

controller.show37=(req,res) => {

    // res.send('Hello IOT');
//   var projectvalue = null;
//   let queryClient = client.getQueryApi(org);
//   let fluxQuery = `from(bucket: "dashboard37")
// |> range(start: -5m)
// |> filter(fn: (r) => r._measurement == "dashboard37")
// |> filter(fn: (r) => r["device"] == "abc")
// |> filter(fn: (r) => r["_field"] == "Sonic")
// |> last()`;
//   var j = 0;
//   queryClient.queryRows(fluxQuery, {
//     next: (row, tableMeta) => {
//       const tableObject = tableMeta.toObject(row);
//       console.log(tableObject._value);
//       projectvalue = tableObject._value;
//       j++;
//     },
//     error: (error) => {
//       console.error("\nError", error);
//     },
//     complete: () => {
//       const step = (prop) => {
//         return new Promise((resolve) => {
//           setTimeout(() => resolve(`done ${prop}`), 100);
//         });
//       };


    req.getConnection((err,conn) =>{
        conn.query('SELECT * FROM device37',(err,device37)=>{
            if(err){
                res.status(500).json(err);
                return;
            }
            res.render('device37View',{
                data:device37,session:req.session
            });
        });
    });
}

// });

// };


controller.add = (req, res) => {
    res.render('device37add',{
        session:req.session
    });
};

controller.add37 = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors = errors;
        req.session.success = false;
        return res.redirect('/device37/add');
    }

    req.session.success = true;
    req.session.topic = "เพิ่มข้อมูลสำเร็จ!";
    const data = req.body;
    req.getConnection((err, conn) => {
        if (err) {
            console.error(err);
            res.status(500).json(err);
            return;
        }

        conn.query('INSERT INTO device37 SET ?', [data], (err, device37) => {
            if (err) {
                console.error(err);
                req.session.errors = [{ msg: 'มีข้อผิดพลาดในการเพิ่มข้อมูล' }];
                req.session.success = false;
                return res.redirect('/device37/add');
            }

            console.log('Inserted into device37:', device37);
            res.redirect('/device37/list');
        });
    });
};



controller.delete=(req, res) => {
    const data = req.body.data;
    res.render('confirmDel_device37',{
        data:data,session:req.session
    });
};

controller.delete37 = (req, res) => {
    req.session.success = true;
    req.session.topic = "ลบข้อมูลสำเร็จ!";
    const didToDelete = req.params.did;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM device37 WHERE did = ?', [didToDelete], (err, device37) => {
            if (err) {
                // ในกรณีที่เกิด error ในการลบข้อมูล
                console.error(err);
                return res.status(500).json(err);
            }
            // ปิด session หลังจากลบข้อมูลเสร็จ
            req.session.success = false;
            req.session.topic = "";
            
            console.log('Deleted from device37:', device37); // เพิ่มบรรทัดนี้
            
            return res.redirect('/device37/list');
        });
    });
};



controller.edit37 = (req, res) => {
    const didToEdit = req.params.did;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM device37 WHERE did = ?', [didToEdit], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            // กำหนด locale ให้เป็น 'th'
            moment.locale('th');

            console.log('device37', data); // แก้ device37 เป็น data
            res.render('device37Edit', { data: data[0], moment: moment, session: req.session });
        });
    });
};


controller.editPost37 = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.session.errors=errors;
        req.session.success =false;
        return  res.redirect('/editdevice37/'+ req.params.did)
    }else{
        req.session.success=true;
        req.session.topic="แก้ไขข้อมูลสำเร็จ!";
        const didToEdit = req.params.did;
        const updatedData = {
        
            Name: req.body.Name,
            mac: req.body.mac,
            Mode: req.body.Mode,
            version: req.body.version,
            
    };
    req.getConnection((err, conn) => {
        conn.query('UPDATE device37 SET ? WHERE did = ?', [updatedData, didToEdit], (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.redirect('/device37/list'); 
        });
    });
}};




module.exports=controller;