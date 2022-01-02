'use strict';

(() => {
  
  class ClockDrawer {
    constructor(canvas) {
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;
    }
    draw(angle,func) {
      this.ctx.save();//translateやrotateで盤面を変更する前の状態を保存しておく。盤面を変更したらrestoreでsaveの状態に戻す。
      this.ctx.translate(this.width / 2, this.height / 2);
      this.ctx.rotate(Math.PI * angle / 180);
      this.ctx.beginPath();
      func(this.ctx);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    }//先にdraw関数を定義する。第一引数はangle、第二引数はfuncとしており、clockクラスのdrawface関数の中で使用している。
    //仮にdraw関数の第一引数をaとし、draw関数内のrotate内のangleをaとしても起動する。

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
  class Clock {
    constructor(drawer) {
      this.drawer = drawer;
      this.r = 100;

    }
    drawFace() {
      for (let angle = 0; angle < 360; angle += 6){
        this.drawer.draw(angle, c => {//引数cにはclockdrawer関数にてthis.ctxが入ることになっているので名前はなんでも良い。
          if (angle % 30 === 0) {
            c.arc(0, this.r, 2, 0, 2 * Math.PI);
            c.font = '10px Arial';
            c.textAlign = 'center';
            c.fillText(angle / 30 || 12, 0, -this.r + 18);
          } else {
            c.arc(0, this.r, 1, 0, 2 * Math.PI);
          }
        });
      }
    }

    drawHands() {
      // hour
      this.drawer.draw(this.h * 30 + this.m * 0.5, ctx => {
        ctx.lineWidth = 6;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 50);
      });
      // minute
      this.drawer.draw(this.m * 6, ctx => {
        ctx.lineWidth = 4;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 30);
      });
      // second
      this.drawer.draw(this.s * 6, ctx => {
        ctx.strokeStyle = 'tomato';
        ctx.lineWidth = 2;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 10);
      });
    }

    update() {
      this.h = (new Date()).getHours();
      this.m = (new Date()).getMinutes();
      this.s = (new Date()).getSeconds();
    }

    run() {
      this.drawer.clear();
      this.update();
      this.drawFace();
      this.drawHands();
      setTimeout(() => {
        this.run();
      }, 100);
    }
  }

    const canvas = document.querySelector('canvas');
  if (typeof canvas.getContext === 'undefined') {
    return;
  }

  const clock = new Clock(new ClockDrawer(canvas));
  clock.run();
})();
