function endpoint(app, connpool) {

    app.post("/api/cantanti", (req, res) => {
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
            nomearte:req.body.nominativo,
            nome:req.body.nome,
            cognome:req.body.cognome,
            età: req.body.età
        }

        var sql = 'INSERT INTO cantante (nomearte,nome,cognome,età) VALUES (?,?)'
        var params = [data.nomearte, data.nome, data.cognome, data.età]
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



    app.get("/api/cantanti", (req, res, next) => {
        var sql = "select * from cantante"
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


    app.get("/api/cantanti/:id", (req, res) => {
        var sql = "select * from cantante where idcantante = ?"
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


    app.put("/api/cantanti/:id", (req, res) => {
        var data = {
            nomearte: req.body.nomearte,
            nome: req.body.nome,
            nomearte: req.body.nomearte,
            età:req.body.età
        }
        connpool.execute(
            `UPDATE cantante set 
               nomearte = COALESCE(?,nomearte), 
               nome = COALESCE(?,nome),
               cognome = COALESCE(?,cognome),
               età = COALESCE(?,età)
               WHERE idcantante = ?`,
            [data.nomearte, data.nome,data.cognome,data.età, req.params.id],
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



    app.delete("/api/cantanti/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM cantante WHERE idcantante = ?',
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