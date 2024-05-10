function endpoint(app, connpool) {

    app.post("/api/concerti", (req, res) => {
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
            nome: req.body.nome,
            città: req.body.città,
        }

        var sql = 'INSERT INTO concerto (nome, città) VALUES (?,?)*'
        var params = [data.nome, data.città]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": results.insertId
            })
            console.log(results)
        });

    })



    app.get("/api/concerti", (req, res, next) => {
        var sql = "select * from concerto"
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


    app.get("/api/concerti/:id", (req, res) => {
        var sql = "select * from concerto where idconcerto = ?"
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


    app.put("/api/concerti/:id", (req, res) => {
        var data = {
            nome: req.body.nome,
            città: req.body.città,
        }
        connpool.execute(
            `UPDATE concerto set 
               nome = COALESCE(?,nome), 
               città = COALESCE(?,città) 
               WHERE idconcerto = ?`,
            [data.nome, data.città, req.params.id],
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



    app.delete("/api/concerti/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM concerto WHERE idconcerto = ?',
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