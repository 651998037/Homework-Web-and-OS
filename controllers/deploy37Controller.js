const controller ={};
const { name } = require('ejs');
const { validationResult } = require('express-validator');
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const token =
  "AGB55bvbOoYPsmuYb8lv4GIBKC2vmb-Ut8x4by_FlJNdf0_mCWbIVwWyBJ0X4XMODH2qAroVGHzetsoLuHxnQg==";
const url = "https://us-east-1-1.aws.cloud2.influxdata.com";
const client = new InfluxDB({ url, token });
let org = `74554ba6d34f8f12`;
let bucket = `dashboard37`;

let writeClient = client.getWriteApi(org, bucket, 'ns');

let point = new Point('dashboard37')
// .tag('device','abc')
.intField('Sonic', 50);
void setTimeout(() => {
writeClient.writePoint(point)
}, 1000) // separate points by 1 second
void setTimeout(() => {
writeClient.flush()
}, 5000)

controller.Dist = async (req, res) => {
    let Sonicvalue = null; // ประกาศ Sonicvalue ที่นี่

    try {
        const queryClient = client.getQueryApi(org);
        const fluxQuery = `from(bucket: "dashboard37")
          |> range(start: -5m)
          |> filter(fn: (r) => r._measurement == "dashboard37" and r["_field"] == "Sonic")
          |> mean()`;

        await new Promise((resolve, reject) => {
            queryClient.queryRows(fluxQuery, {
                next: (row, tableMeta) => {
                    const tableObject = tableMeta.toObject(row);
                    console.log(tableObject._value);
                    Sonicvalue = tableObject._value;
                },
                error: (error) => {
                    console.error("\nError", error);
                    reject(error);
                },
                complete: () => {
                    resolve();
                },
            });
        });

        if (Sonicvalue !== null) {
            // สร้าง InfluxDB Point ด้วยค่า Sonicvalue ใหม่
            const point = new Point('dashboard37').intField('Sonic', Sonicvalue);

            // กำหนดการทำงานของ write และ flush
            await new Promise(resolve => setTimeout(resolve, 1000));
            writeClient.writePoint(point);

            await new Promise(resolve => setTimeout(resolve, 4000));
            writeClient.flush();
        }

        res.render("Dist", { data: Sonicvalue });
    } catch (error) {
        console.error("Error", error);
        res.render("Dist", { data: null });
    }
};



controller.show37=(req,res) => {
    
    req.getConnection((err,conn) =>{
        conn.query('SELECT deploy37.did_de,device37.Name AS DeviceName,device37.mac,device37.Model,device37.version,deploy37.sid,site37.Name AS SiteName,site37.address,deploy37.install,deploy37.comment FROM deploy37 JOIN device37 ON deploy37.did = device37.did JOIN site37 ON deploy37.sid = site37.sid;',(err,deploy37)=>{
            if(err){
                res.status(500).json(err);
                return;
            }
            res.render('deploy37View',{
                data:deploy37 ,session:req.session
            });
        });
    });
};


controller.add = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT did,Name FROM device37', (err, device37) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            conn.query('SELECT sid,Name FROM site37', (err, site37) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }
            res.render('deploy37add', {
                device37,
                site37,  // แก้ตรงนี้
                session: req.session
            });
        });
    });
});
};


controller.add37 = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.errors = errors.array();
        req.session.success = false;
        return res.redirect('/deploy37/add');
    }

    req.session.success = true;
    req.session.topic = "เพิ่มข้อมูลสำเร็จ!";
    
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error(err);
            req.session.errors = [{ msg: 'มีข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล' }];
            req.session.success = false;
            return res.redirect('/deploy37/add');
        }

        // Assuming 'device37' is a foreign key in 'deploy37' table
        const sql = 'INSERT INTO deploy37 SET ?';

        conn.query(sql, [data], (err, deploy37) => {
            if (err) {
                console.error(err);
                req.session.errors = [{ msg: 'มีข้อผิดพลาดในการเพิ่มข้อมูล' }];
                req.session.success = false;
                return res.redirect('/deploy37/add');
            }

            console.log('Inserted into deploy37:', deploy37);
            res.redirect('/deploy37/list');
        });
    });
};


controller.delete=(req, res) => {
    const data = req.body.data;
    res.render('confirmDel_deploy37',{
        data:data,session:req.session
    });
};

controller.delete37 = (req, res) => {
    req.session.success = true;
    req.session.topic = "ลบข้อมูลสำเร็จ!";
    const did_de = req.params.did_de; // แก้ไขตรงนี้
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM deploy37 WHERE did_de = ?', [did_de], (err, deploy37) => {
            res.redirect('/deploy37/list');
        });
    });
};
controller.edit37 = (req, res) => {
    const idToEdit = req.params.did_de;
    req.getConnection((err, conn) => {
        conn.query('SELECT did,Name FROM device37', (err, device37) => {
            conn.query('SELECT sid,Name FROM site37', (err, site37) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }
                conn.query('SELECT deploy37.did_de, deploy37.did, device37.Name AS DeviceName, device37.mac, device37.Model, device37.version, deploy37.sid, site37.Name AS SiteName, site37.address, deploy37.install AS Install, deploy37.comment FROM deploy37 JOIN device37 ON deploy37.did = device37.did JOIN site37 ON deploy37.sid = site37.sid WHERE deploy37.did_de = ?;', [idToEdit], (err, data) => {


                    if (err) {
                        res.status(500).json(err);
                        return;
                    }
                    res.render('deploy37edit', { data: data[0], device37, site37, session: req.session });
                });
            });
        });
    });
};
controller.editPost37 = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors = errors;
        req.session.success = false;
        return res.redirect('/deploy37edit/' + req.params.did_de); // แก้ไขตรงนี้
    } else {
        req.session.success = true;
        const idToEdit = req.params.did_deid; // แก้ไขตรงนี้
        const updatedData = {

            did: req.body.did,
            sid: req.body.sid,
            install: req.body.install,
            comment: req.body.comment,
        };
        req.getConnection((err, conn) => {
            conn.query('UPDATE deploy37 SET ? WHERE did_de = ?', [updatedData, idToEdit], (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.redirect('/deploy37/list');
            });
        });
    }
};

module.exports = controller;