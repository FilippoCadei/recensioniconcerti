function endpoint(app, connpool) {

    app.post("/api/recensioni", (req, res) => {
        var errors = []
        /* controllo dati inseriti
        if (!req.body.description) {
            errors.push("No description specified");
        }
        if (req.body.status === "") {
            errors.push("No status specified");
        }
        */
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        var data = {
            idutente: req.body.idutente,
            idconcerto: req.body.idconcerto,
            data: req.body.data,
            voto: req.body.voto,
            descrizione: req.body.descrizione,
        }

        var sql = 'INSERT INTO recensione (idutente, idconcerto, data, voto, descrizione) VALUES (?,?,?,?,?)*'
        var params = [data.idutente, data.idconcerto, data.data, data.voto, data.descrizione]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.insertID
            })
            console.log(results)
        });

    })



    app.get("/api/recensioni", (req, res, next) => {
        var sql = "select * from recensione"
        var params = []
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
          });
    });


    app.get("/api/recensioni/:id", (req, res) => {
        var sql = "select * from recensione where idutente = ?"
        var params = [req.params.id]
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows[0]
            })
          });
    });


    app.put("/api/recensioni/:id", (req, res) => {
        var data = {
            idutente: req.body.idutente,
            idconcerto: req.body.idconcerto,
            data: req.body.data,
            voto: req.body.voto,
            descrizione: req.body.descrizione,
        }
        connpool.execute(
            `UPDATE concerto set 
               idutente = COALESCE(?,idutente),
               idconcerto = COALESCE(?,idconcerto),
               data = COALESCE(?,data),
               voto = COALESCE(?,voto), 
               descrizione = COALESCE(?,descrizione) 
               WHERE idconcerto = ?`,
            [data.idutente, data.idconcerto, data.data, data.voto, data.descrizione, req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                console.log(result )
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
        });
    })



    app.delete("/api/recensioni/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM recensione WHERE idutente = ?',
            [req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({"message":"deleted", changes: result.affectedRows})
        });
    })


}





module.exports = endpoint;