var Board = require('../models/board');

/*
* @todo     : 다음 인증 과정인 '권한'에 대한 메서드 작성
* @true     : 콜백함수인 bookFind의 파라미터에 respond 객체 전송
* @false    : response 객체에 로그인 페이지를 담고 이동
* @param    : id(session값), res(response 객체) 
*/
const auth = (id,res) => {
    if (id) bookFind(res);
    else res.rend('/login');
}

/*
* DB에서 전체 게시판 리스트를 찾아서 json 타입으로 담음
* @param        : response 객체를 통해 게시판 메인 페이지로 이동
* @returnType   : res 객체에 이동할 페이지 url과 json 객체를 담음
*/
const bookFind = (res) => {

    // 게시판 전체 리스트 조회 쿼리
    Board.find((err,boardList) =>{

        //DB 오류
        if(err) return res.status(500).send({error:'database failure'});
        
        //페이지 리턴
        res.render('contents/list',{
            BoardList : boardList
        });
    });
}


/* 
* @param    : app(express 객체), passport(natural passport 객체)
*/
module.exports = (app,passport)=> {

    // 게시판 메인 url 접근
    app.get('/board',(req,res) => {

        //인증관련 validation
        var id = req.isAuthenticated();

        //인증 메서드
        auth(id,res);
        
    });
    
    app.get('/board/form',(req,res) => {
        res.render('contents/form');
    });

    app.post('/board/insert',(req,res) => {
        var board = new Board();
        
        board.title = req.body.title;
        board.sub_title = req.body.subTitle;
        board.contents = req.body.content;
        board.board_type = req.body.boardType;

        board.save((err) => {
            if(err) {
                console.error(err);
                res.json({result:0});
                return;
            }
            res.json({result:1});
            

        });
    });
}