
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
    drawCircle(ring);    // 绘制每一个“同样形状”的圆
  }
}

// ===== 生成圆的数据（位置/半径/配色） =====
function generateLayout(){
  rings = [];
  let attempts = 0; // 建立一个计数器，防止无限循环
  let target = 12;  // 在页面中画10个圆
  while (rings.length < target && attempts < 2000){
    attempts++;

    // 控制半径范围
    let Rmin = min(width,height) * 0.04;   
    let Rmax = min(width,height) * 0.10;   
    let r = random(Rmin, Rmax);

    // 随机位置
    let x = random(r + 20, width  - r - 20);
    let y = random(r + 20, height - r - 20);

    // 为这个圆选 5 个配色，除去背景色
    let pool = colorSet.slice(1);
    let palette = [
      random(pool),   // 外环颜色
      random(pool),   // 辐条颜色
      random(pool),   // 中环颜色
      random(pool),   // 点阵颜色
      random(pool)    // 中心帽颜色
    ];

    // 把这个圆的数据存进数组
    rings.push({ x, y, r,palette });
  }
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