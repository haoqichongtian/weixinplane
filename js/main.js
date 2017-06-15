function $id(id) {
    return document.getElementById(id);
}
// 这是玩家的飞机构造对象
function myPlane(x, y, width, height, attack, live, normal, boom) {
    // X,Y是飞机的左上角相当于屏幕的坐标为位置
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.attack = attack;
    this.live = live;
    this.normal = normal;
    this.boom = boom;
    this.isDie=false;
    // this.destory=function (main) {
    //     if (!this.dieTimer) {
    //         var p=this;
    //         this.dieTimer=setTimeout(function () {
    //             if (p.element.parentNode) {
    //                 main.removeChild(p.element);
    //             }
    //         },1000)
    //     }
    // }
}
// 这是敌机的飞机构造对象
function enemyPlane(x, y, width, height, attack, live, speed, normal, boom, score) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.attack = attack;
    this.live = live;
    this.speed = speed;
    this.normal = normal;
    this.boom = boom;
    this.score = score;
    this.isDie = false;
    this.destory=function (main) {
        if (!this.dieTimer) {
            var p=this;
            this.dieTimer=setTimeout(function () {
                if (p.element.parentNode) {
                    main.removeChild(p.element);
                }
                var index=enemySmallArray.indexOf(p);
                enemySmallArray.splice(index,1)
            },1000)
        }
    }
}
// 这是子弹的飞机构造对象
function Bullet(x, y, width, height, attack, normal) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.attack = attack;
    this.normal = normal;
}
// 判断一个点是否在另一个区域内
function isPosInRange(point, range) {
    if (point.x >= range.x && point.y > range.y && point.x <= range.x + range.width && point.y <= range.y + range.height) {
        return true;
    }
    return false;
}
// 判断两个区域是否有碰撞，即四个点是否在一个区域内
function isRangeInRange(range1, range2) {
    var rp1 = {x: range1.x, y: range1.y};
    var rp2 = {x: range1.x + range1.width, y: range1.y};
    var rp3 = {x: range1.x, y: range1.y + range1.height};
    var rp4 = {x: range1.x + range1.width, y: range1.y + range1.height};
    var r2p1 = {x: range2.x, y: range2.y};
    var r2p2 = {x: range2.x + range2.width, y: range2.y};
    var r2p3 = {x: range2.x, y: range2.y + range2.height};
    var r2p4 = {x: range2.x + range2.width, y: range2.y + range2.height};
    if (isPosInRange(rp1, range2) || isPosInRange(rp2, range2) || isPosInRange(rp3, range2) || isPosInRange(rp4, range2)) {
        return true;
    }
    if (isPosInRange(r2p1, range1) || isPosInRange(r2p2, range1) || isPosInRange(r2p3, range1) || isPosInRange(r2p4, range1)) {
        return true;
    }
    return false;
}
//储存对象的数组
var bulletArray = [];
var enemySmallArray = [];
var enemyMiddleArray = [];
var enemyBigArray = [];
var score = 0;
window.onload = function () {
    // 获取元素
    var btn = $id("start");
    var main = $id("main");
    var marks=main.children[1];
    var end=$id("end");
    btn.onclick = function () {
        this.style.display = "none";
        main.style.background = "url(images/bg-gamming.png) repeat-y";
        bgMove();
        // x=320/2-66/2 y=568-bottom-80;

        var Plane = new myPlane(127, 450, 66, 80, 10, 10, "images/img-player.gif", "images/img-player-boom.gif");
        var playerPlane = createObject(Plane);
        // console.log(playerPlane.x);
        main.appendChild(playerPlane);
        // 这是飞机移动的方法
        if (!playerPlane.isDie) {
            main.onmousemove = function (event) {
                // 由事件获取鼠标相对于浏览器页面的x,y坐标
                var px = event.pageX;
                var py = event.pageY;
                //让鼠标控制playerPlane的中心
                //   获取mian外边界的距离
                var tempx = parseFloat(getStyle(main).marginLeft);
                // 由鼠标的坐标得出图片的左上角相对于mian的x,y坐标
                var x = px - tempx - 33;
                var y = py - 0 - 40;
                // 注意不要打两个等号
                if (x < 0) {
                    x = 0;
                }
                if (x > 320 - 66) {
                    x = 320 - 66;
                }
                if (y < 0) {
                    y = 0;
                }
                if (y > 568 - 80) {
                    y = 568 - 80;
                }
                Plane.x = x;
                Plane.y = y;
                playerPlane.style.left = x + "px";
                playerPlane.style.top = y + "px";
            }
            planeShoot(Plane);

            bulletMove();

            makeEnemy();

            enemyMove(Plane);
        }
    }
    // 这是背景移动的方法
    function bgMove() {
        var main = $id("main");
        setInterval(function () {
            var y = parseFloat(getStyle(main).backgroundPositionY);
            y += 0.5;
            main.style.backgroundPositionY = y + "px";
        }, 10);
    }

// 创建对象的方法
    function createObject(obj) {
        var element = document.createElement("img");
        obj.element = element;
        element.src = obj.normal;
        element.style.position = "absolute";
        element.style.left = obj.x + "px";
        element.style.top = obj.y + "px";
        return element;
    }

// 这是动态获取元素的属性的方法
    function getStyle(element) {
        return getComputedStyle(element, null);
    }

// 飞机发射子弹的方法
    function planeShoot(plane) {
        var main = $id("main");
        setInterval(function () {
            var x = plane.x + 30;
            var y = plane.y - 14;
            var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
            bulletArray.push(bullet);
            // 由子弹对象创建出子弹element,并和子弹对象关联
            var mybullet = createObject(bullet);
            main.appendChild(mybullet);
        }, 80)
    }

// 这是子弹移动的方法
    function bulletMove() {
        var step = 10;
        setInterval(function () {
            for (var i = 0; i < bulletArray.length; i++) {
                var bullets = bulletArray[i]
                bullets.y -= step;
                bullets.element.style.top = bullets.y + "px";
                if (bullets.y < -14) {
                    main.removeChild(bullets.element);
                    bulletArray.splice(i, 1);
                    i--;
                }
            }
        }, 20)
    }

//	这是创造敌机的方法
    function makeEnemy() {
        // 这是小敌机
        setInterval(function () {
            var count = Math.random() * 3 + 1;
            for (var i = 0; i < count; i++) {
                var width = 34;
                var height = 24;
                var y = -height;
                var x = Math.random() * (320 - width);
                var speed = Math.random() * 200 + 100;
                var enemyPlaneSmall = new enemyPlane(x, y, width, height, 10, 10, speed, "images/enemy1_fly_1.png", "images/small-boom.gif",100);
                var smallPlane = createObject(enemyPlaneSmall);
                main.appendChild(smallPlane);
                enemySmallArray.push(enemyPlaneSmall);
            }
        }, 3000)
        // 这是中敌机
        setInterval(function () {
            var count = Math.random() * 2 + 1;
            for (var i = 0; i < count; i++) {
                var width = 46;
                var height = 60;
                var y = -height;
                var x = Math.random() * (320 - width);
                var speed = Math.random() * 100 + 100;
                var enemyPlaneMiddle = new enemyPlane(x, y, width, height, 10, 100, speed, "images/enemy3_fly_1.png", "images/img-m-boom.gif",500);
                var middlePlane = createObject(enemyPlaneMiddle);
                main.appendChild(middlePlane);
                enemyMiddleArray.push(enemyPlaneMiddle);
            }
        }, 6000)

        //这是大敌机
        IntervalCreatePlane();
    }

    // 这是敌机移动的方法
    function enemyMove(playerPlane) {
        setInterval(function () {
            // 这是遍历小敌机
            for (var i = 0; i < enemySmallArray.length; i++) {
                var ePlane = enemySmallArray[i];
                if (!ePlane.isDie) {
                    var step = ePlane.speed / 1000 * 20;
                    ePlane.y += step;
                    ePlane.element.style.top = ePlane.y + "px";
                    // 判断敌机是否和子弹碰撞
                    for (var j = 0; j < bulletArray.length; j++) {
                        var bullet = bulletArray[j];
                        // 子弹和敌机发生碰撞，子弹消失
                        if (isRangeInRange(bullet, ePlane)) {
                            main.removeChild(bullet.element);
                            bulletArray.splice(j, 1);
                            j--;
                            // 敌机扣血
                            ePlane.live -= bullet.attack;
                            if (ePlane.live <= 0) {
                                ePlane.isDie = true;
                               // setTimeout(function () {
                                   ePlane.element.src = ePlane.boom;
                               //     flag=true;
                               // },1000)

                                score += 100;//ePlane.score
                                marks.innerText="score:"+score;
                                ePlane.destory(main);
                                    // main.removeChild(ePlane.element);
                                    // enemySmallArray.splice(i,1);
                                    // i--;

                            }
                        }

                    }
                    //敌机和操作者飞机碰撞
                    if (!playerPlane.isDie) {
                        if (isRangeInRange(playerPlane, ePlane)) {
                            ePlane.isDie=true;
                            ePlane.element.src = ePlane.boom;
                            ePlane.destory(main);
                            playerPlane.live -= ePlane.attack;
                            if (playerPlane.live<=0) {
                                playerPlane.isDie=true;
                                playerPlane.element.src=playerPlane.boom;
                                setTimeout(function () {
                                    end.style.display="block";
                                    end.children[0].style.display="block";
                                    main.onmousemove=null;
                                },1000)
                            }
                        }
                    }

                    //敌机飞出屏幕消失
                    if (ePlane.y > (568 + 24)) {
                        main.removeChild(ePlane.element);
                        enemySmallArray.splice(i,1);
                        i--;
                    }
                }

            }

            enemyMoveJudge(enemyMiddleArray,playerPlane);

            enemyMoveJudge(enemyBigArray,playerPlane);
        }, 20)
    }
    // 这是遍历敌机数组判断敌机碰撞的方法
    function enemyMoveJudge(Array,playerPlane) {
        for (var i = 0; i < Array.length; i++) {
            console.log(Array.length);
            var ePlane = Array[i];
            if (!ePlane.isDie) {
                var step = ePlane.speed / 1000 * 20;
                ePlane.y += step;
                ePlane.element.style.top = ePlane.y + "px";
                // 判断敌机是否和子弹碰撞
                for (var j = 0; j < bulletArray.length; j++) {
                    var bullet = bulletArray[j];
                    // 子弹和敌机发生碰撞，子弹消失
                    if (isRangeInRange(bullet, ePlane)) {
                        main.removeChild(bullet.element);
                        bulletArray.splice(j, 1);
                        j--;
                        // 敌机扣血
                        ePlane.live -= bullet.attack;
                        if (ePlane.live <= 0) {
                            ePlane.isDie = true;
                            ePlane.element.src = ePlane.boom;
                            score +=ePlane.score;
                            marks.innerText="score:"+score;
                            ePlane.destory(main);
                        }
                    }
                }
                //敌机和操作者飞机碰撞
                if (!playerPlane.isDie) {
                    if (isRangeInRange(playerPlane, ePlane)) {
                        ePlane.isDie=true;
                        ePlane.element.src = ePlane.boom;
                        ePlane.destory(main);
                        playerPlane.live -= ePlane.attack;
                        if (playerPlane.live<=0) {
                            playerPlane.isDie=true;
                            playerPlane.element.src=playerPlane.boom;
                            setTimeout(function () {
                                end.style.display="block";
                                end.children[0].style.display="block";
                                main.onmousemove=null;
                            },1000)
                        }
                    }
                }

                //敌机飞出屏幕消失
                if (ePlane.y > (568 + 24)) {
                    main.removeChild(ePlane.element);
                    Array.splice(i,1);
                    i--;
                }
            }

        }
    }

    //这是隔一段时间创造敌机并添加入数组中的方法
    function IntervalCreatePlane() {
        setInterval(function () {
            var count = Math.random() * 1 + 1;
            for (var i = 0; i < count; i++) {
                var width = 110;
                var height = 170;
                var y = -height;
                var x = Math.random() * (320 - width);
                var speed = Math.random() * 50 + 100;
                var enemyPlaneBig = new enemyPlane(x, y, width, height, 10, 150, speed, "images/enemy2_fly_1.png", "images/img-large-boom.gif",1000);
                var bigPlane = createObject(enemyPlaneBig);
                main.appendChild(bigPlane);
                enemyBigArray.push(enemyPlaneBig);
            }
        }, 9000)
    }
}































