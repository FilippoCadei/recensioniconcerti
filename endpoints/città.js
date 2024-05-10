function endpoint(app, connpool) {

    app.post("/api/città", (req, res) => {
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
        }

        var sql = 'INSERT INTO città (nome) VALUES (?)*'
        var params = [data.nome]
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



    app.get("/api/città", (req, res, next) => {
        var sql = "select * from città"
        var params = []
        connpool.query(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    });


    app.get("/api/città/:id", (req, res) => {
        var sql = "select * from città where idcittà = ?"
        var params = [req.params.id]
        connpool.query(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows[0]
            })
        });
    });


    app.put("/api/città/:id", (req, res) => {
        var data = {
            nome: req.body.nome,
        }
        connpool.execute(
            `UPDATE città set 
               nome = COALESCE(?,nome)
               WHERE idcittà = ?`,
            [data.nome, req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
                console.log(result)
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
            });
    })



    app.delete("/api/città/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM città WHERE idcittà = ?',
            [req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
                res.json({ "message": "deleted", changes: result.affectedRows })
            });
    })


}





module.exports = endpoint;