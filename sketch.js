
let bg;                //存放背景颜色
let colorSet;          //存放所有颜色
let rings = [];       // 保存每个圆的随机参数（位置/半径/配色）

function setup() {
  //Create a canvas as large as the current browser window
  createCanvas(windowWidth, windowHeight);

  colorSet = [
    color(10,13,24),     // bg
    color(255, 90, 0),   // hot orange
    color(255, 0, 110),  // magenta
    color(80, 220, 100), // mint
    color(255, 200, 0),  // yellow
    color(0, 210, 255),  // cyan
    color(140,110,255),  // violet
    color(255, 80,170),  // pink
    color(255,120, 40),  // orange2
    color(40, 255,200)   // aqua
  ];
  bg = colorSet[0];
  
  generateLayout(); 
}

function draw() {
  background(bg);
  for (let ring of rings){
    if (ring.style === 'dots') {
      drawDotMandala(ring);   // 小圆点同心图
    } else {
      drawCircle(ring);       // 辐条圆
    }

    moveAndBounce(ring);   // 更新位置 + 边缘反弹
  }
}

// 移动 + 边缘反弹
function moveAndBounce(ring){
  ring.x += ring.vx;
  ring.y += ring.vy;

  // 左右边界
  if (ring.x < ring.r) {
    ring.x = ring.r;
    ring.vx *= -1;
  } else if (ring.x > width - ring.r) {
    ring.x = width - ring.r;
    ring.vx *= -1;
  }

  // 上下边界
  if (ring.y < ring.r) {
    ring.y = ring.r;
    ring.vy *= -1;
  } else if (ring.y > height - ring.r) {
    ring.y = height - ring.r;
    ring.vy *= -1;
  }
}

// ===== 生成圆的数据（位置/半径/配色） =====
function generateLayout(){
  rings = [];
  const S = min(width, height);

  // 两类圆的数量
  const N_SPOKES = 5;
  const N_DOTS   = 7;

  // 两类圆的尺寸范围
  const Rmin_spokes = S * 0.08;
  const Rmax_spokes = S * 0.13;
  const Rmin_dots   = S * 0.05;
  const Rmax_dots   = S * 0.08;

  const pool = colorSet.slice(1);  // 颜色库（除背景）

  // 第一类：spokes
  for (let i = 0; i < N_SPOKES; i++){
    let r = random(Rmin_spokes, Rmax_spokes);
    let x = random(r + 20, width  - r - 20);
    let y = random(r + 20, height - r - 20);

    let palette = [
      random(pool),
      random(pool),
      random(pool),
      random(pool),
      random(pool)
    ];

    // 设置spokes的速度和方向
    let Vmin = S * 0.002;     // 最慢速度
    let Vmax = S * 0.010;     // 最快速度
    let baseK = S * 0.3;      // 速度基准
    let speed = baseK / r;    // 半径越大速度越慢
    speed = constrain(speed, Vmin, Vmax);
    let ang = random(TWO_PI); // 随机方向
    let vx = cos(ang) * speed;
    let vy = sin(ang) * speed;

    rings.push({ x, y, r, palette, style: 'spokes', vx, vy });
  }

  // 第二类：dots
  for (let i = 0; i < N_DOTS; i++){
    let r = random(Rmin_dots, Rmax_dots);
    let x = random(r + 20, width  - r - 20);
    let y = random(r + 20, height - r - 20);

    let palette = [
      random(pool),
      random(pool),
      random(pool),
      random(pool),
      random(pool)
    ];

 // set these dots speed和方向
    let Vmin = S * 0.002;
    let Vmax = S * 0.010;
    let baseK = S * 0.7;
    let speed = baseK / r;
    speed = constrain(speed, Vmin, Vmax);
    let ang = random(TWO_PI);
    let vx = cos(ang) * speed;
    let vy = sin(ang) * speed;

    rings.push({ x, y, r, palette, style: 'dots', vx, vy });
  }
}

// ===== 窗口尺寸变化 =====
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  generateLayout();
}


// ===== 绘制圆（外环/辐条/中环/点阵/中心帽） =====
function drawCircle(ring){
  // 外粗环
  strokeWeight(max(2, ring.r * 0.08));
  stroke(ring.palette[0]);
  noFill();
  circle(ring.x, ring.y, ring.r * 2);

  // 放射线条
  let nSpokes = 15;  //线条数量
  strokeWeight(2);
  stroke(ring.palette[1]);

  for (let i = 0; i < nSpokes; i++){
    let ang = i * TWO_PI / nSpokes; 
    let x1 = ring.x + ring.r * 0.12 * cos(ang);
    let y1 = ring.y + ring.r * 0.12 * sin(ang);
    let x2 = ring.x + ring.r * 0.88 * cos(ang);
    let y2 = ring.y + ring.r * 0.88 * sin(ang);
    line(x1, y1, x2, y2);
  }

    // 中环
  strokeWeight(max(2, ring.r * 0.04));
  stroke(ring.palette[2]);
  noFill();
  circle(ring.x, ring.y, ring.r * 1.2);


  // 点阵圈
  // 点阵圈 A（外圈）
  noStroke();
  fill(ring.palette[3]);       // 原来的颜色
  let dotsA = max(7, int(ring.r / 5));  
  let rA = ring.r * 0.38;

  for (let i = 0; i < dotsA; i++){
    let a = i * TWO_PI / dotsA;
    let x = ring.x + rA * cos(a);
    let y = ring.y + rA * sin(a);
    circle(x, y, 7);           // 固定大小
  }


  // 点阵圈 B（内圈）
  noStroke();
  fill(ring.palette[1]);       // 用辐条色，形成层次感
  let dotsB = max(3, int(ring.r / 5));
  let rB = ring.r * 0.26;      // 半径明显大于内圈

  for (let i = 0; i < dotsB; i++){
    let a = i * TWO_PI / dotsB; 
    let x = ring.x + rB * cos(a);
    let y = ring.y + rB * sin(a);
    circle(x, y, 6);           
  }


  // 中心帽
  noStroke();
  fill(ring.palette[4]);
  circle(ring.x, ring.y, ring.r * 0.24);
  fill(random(colorSet));
  circle(ring.x, ring.y, ring.r * 0.12);
}


function drawDotMandala(ring){

    // 放射线条
  let nSpokes = 8;  //线条数量
  strokeWeight(2);
  stroke(ring.palette[1]);

  for (let i = 0; i < nSpokes; i++){
    let ang = i * TWO_PI / nSpokes; 
    let x1 = ring.x + ring.r * 0.12 * cos(ang);
    let y1 = ring.y + ring.r * 0.12 * sin(ang);
    let x2 = ring.x + ring.r * 0.80 * cos(ang);
    let y2 = ring.y + ring.r * 0.80 * sin(ang);
    line(x1, y1, x2, y2);
  }


  // ---- 内圈 ----
  let n1 = 8;                      // 内圈点数量
  let r1 = ring.r * 0.22;          // 内圈半径
  let s1 = ring.r * 0.10;          // 内圈点大小
  fill(ring.palette[2]);

  for (let i = 0; i < n1; i++){
    let a = i * TWO_PI / n1;
    let x = ring.x + r1 * cos(a);
    let y = ring.y + r1 * sin(a);
    circle(x, y, s1);
  }

  // ---- 中圈 ----
  let n2 = 19;
  let r2 = ring.r * 0.52;
  let s2 = ring.r * 0.08;
  fill(ring.palette[3]);

  for (let i = 0; i < n2; i++){
    let a = i * TWO_PI / n2;
    let x = ring.x + r2 * cos(a);
    let y = ring.y + r2 * sin(a);
    circle(x, y, s2);
  }

  // ---- 外圈 ----
  let n3 = 24;
  let r3 = ring.r * 0.55;
  let s3 = ring.r * 0.09;
  fill(ring.palette[4]);

  for (let i = 0; i < n3; i++){
    let a = i * TWO_PI / n3;
    let x = ring.x + r3 * cos(a);
    let y = ring.y + r3 * sin(a);
    circle(x, y, s3);
  }

  // 中心一个小圆
  fill(ring.palette[0]);
  circle(ring.x, ring.y, ring.r * 0.20);
}
