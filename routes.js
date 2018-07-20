const moment = require('moment');
const path = require('path');

module.exports = function(app, database) {
  
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });

  app.get('/get-todos', function (req, res) {
    database.query(
    `SELECT * FROM todos`,
    function (error, results, fields) {

      if (error) throw error;

      // console.log('results: ', results);

      res.send(results);
    });
  });

  app.get('/get-todo/:id', function (req, res) {
    let id = req.params.id;
    database.query(
      `SELECT * FROM todos WHERE id=${id}`,
      function (error, result, fields) {

        if (error) throw error;

        console.log('results: ', result);

        res.send(result);
      });
  });

  app.put('/create-todo', function (req, res) {
    let text = req.body.text;
    let created = moment().format('YYYY-MM-DD HH:mm Z')

    database.query(`
      INSERT INTO todos (text, created) 
      VALUES('${text}', '${created}')
    `, function (error, result, fields) {

        if (error) throw error;

        console.log('results: ', result);
      
        res.send({
          ...result,
          created: created
        });
      });
  });

  app.delete('/delete-todo', function (req, res) {
    let id = req.body.id;

    database.query(
      `DELETE FROM todos WHERE id=${id}`,
      function (error, result, fields) {

        if (error) throw error;

        console.log('results: ', result);

        res.send(result);
      });
  });

  app.post('/update-todo', function (req, res) {
    let id = req.body.id;
    let done = req.body.done;
    database.query(
      `UPDATE todos SET done=${done} WHERE id=${id}`,
      function (error, result, fields) {

        if (error) throw error;

        console.log('results: ', result);

        res.send(result);
      });
  });
}

