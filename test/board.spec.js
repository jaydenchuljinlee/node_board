var assert      = require('assert');
var should      = require('should');
var boards      = require('../routes/index');
var Board       = require('../models/board');

describe('', () => {
    it('GET /boad', (done) => {

        var check = true;

         // 게시판 전체 리스트 조회 쿼리
        Board.find((err,boardList) =>{

            //DB 오류
            if(err) {
                check = false;
                return;
            }
            
            //페이지 리턴
            check = true;
        });
        
        check.should.be.equal(true);
        done();
    });

})
