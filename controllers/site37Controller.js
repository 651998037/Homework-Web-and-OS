const controller ={};
const { validationResult } = require('express-validator');
const moment = require('moment');

controller.show37=(req,res) => {
    req.getConnection((err,conn) =>{
        conn.query('SELECT * FROM site37',(err,site37)=>{
            if(err){
                res.status(500).json(err);
                return;
            }
            res.render('site37View',{
                data:site37,session:req.session
            });
        });
    });
};


controller.add = (req, res) => {
    res.render('site37add',{
        session:req.session
    });
};

controller.add37 = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors = errors;
        req.session.success = false;
        return res.redirect('/site37/add');
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

        conn.query('INSERT INTO site37 SET ?', [data], (err, site37) => {
            if (err) {
                console.error(err);
                req.session.errors = [{ msg: 'มีข้อผิดพลาดในการเพิ่มข้อมูล' }];
                req.session.success = false;
                return res.redirect('/site37/add');
            }

            console.log('Inserted into site37:', site37);
            res.redirect('/site37/list');
        });
    });
};



controller.delete=(req, res) => {
    const data = req.body.data;
    res.render('confirmDel_site37',{
        data:data,session:req.session
    });
};

controller.delete37 = (req, res) => {
    req.session.success = true;
    req.session.topic = "ลบข้อมูลสำเร็จ!";
    const sidToDelete = req.params.sid;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM site37 WHERE sid = ?', [sidToDelete], (err, site37) => {
            if (err) {
                // ในกรณีที่เกิด error ในการลบข้อมูล
                console.error(err);
                return res.status(500).json(err);
            }
            // ปิด session หลังจากลบข้อมูลเสร็จ
            req.session.success = false;
            req.session.topic = "";
            
            console.log('Deleted from site37:', site37); // เพิ่มบรรทัดนี้
            
            return res.redirect('/site37/list');
        });
    });
};



controller.edit37 = (req, res) => {
    const sidToEdit = req.params.sid;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM site37 WHERE sid = ?', [sidToEdit], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            // กำหนด locale ให้เป็น 'th'
            moment.locale('th');

            console.log('site37', data); // แก้ site37 เป็น data
            res.render('site37Edit', { data: data[0], moment: moment, session: req.session });
        });
    });
};


controller.editPost37 = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.session.errors=errors;
        req.session.success =false;
        return  res.redirect('/editsite37/'+ req.params.sid)
    }else{
        req.session.success=true;
        req.session.topic="แก้ไขข้อมูลสำเร็จ!";
        const sidToEdit = req.params.sid;
        const updatedData = {
        
            Name: req.body.Name,
            address: req.body.address
            
    };
    req.getConnection((err, conn) => {
        conn.query('UPDATE site37 SET ? WHERE sid = ?', [updatedData, sidToEdit], (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.redirect('/site37/list'); 
        });
    });
}};




module.exports=controller;