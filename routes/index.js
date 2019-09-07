var Board = require('../models/board');

module.exports = function(app,passport) {

    app.get('/board',function(req,res) {
        Board.find(function(err,boardList) {
            if(err) return res.status(500).send({error:'database failure'});
            console.log(boardList);
            res.render('contents/list',{
                boardList : boardList
            });
        });
    });
    
    app.get('/board/form',function(req,res) {
        res.render('contents/form');
    });

    app.post('/board/insert',function(req,res) {
        var board = new Board();
        
        board.title = req.body.title;
        board.sub_title = req.body.subTitle;
        board.contents = req.body.content;
        board.board_type = req.body.boardType;

        board.save(function(err) {
            if(err) {
                console.error(err);
                res.json({result:0});
                return;
            }
            res.json({result:1});
            

        });
    });
}