
let bg;                //Store the background color
let colorSet;          //Store all colors
let rings = [];       //Save the random parameters (position/radius/color matching) of each circle

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
     // 下落进度 t（0~1）：用于控制光晕的缩放与淡出 
    // 圆形图形从画布上方开始，穿过画布后接近 1
    const t = constrain((ring.y + ring.r) / (height + ring.r * 2), 0, 1);

     // 在圆形图形下面绘制扩散并渐隐的光晕
    drawAura(ring, t);

    // 圆形图形保持固定大小（不随 t 缩放）
      if (ring.style === 'dots') {
      drawDotMandala(ring);
    } else {
      drawCircle(ring);
    }

    // 更新下落位置
    fallAndReset(ring);     
  }
}

// 光晕随下落放大并淡出 
function drawAura(ring, t) {
  if (t <= 0) return;

  // 选取调色板中的一种颜色
  const c = ring.palette[1];

  // alpha 随下落从 120 渐变到 0
  const alpha = map(t, 0, 1, 120, 0);

  // 半径从 1.0 倍扩大到约 2.6 倍
  const rr = ring.r * (1 + 1.6 * t);

  noStroke();
  fill(red(c), green(c), blue(c), alpha);
  circle(ring.x, ring.y, rr * 2);
}

// 控制圆形图形下落与重置 
function fallAndReset(ring){
  ring.y += ring.vy;  // Update the position through speed

  if (ring.y > height + ring.r){ //When the circle extends beyond the canvas
    ring.y =- ring.r;  //Let the small ball keep falling
    ring.x = random(ring.r, width-ring.r); //Random x position
    ring.vy = random(1,3);  //New falling velocity
    
    //random color
    ring.palette = [
      random(colorSet.slice(1)),
      random(colorSet.slice(1)),
      random(colorSet.slice(1)),
      random(colorSet.slice(1)),
      random(colorSet.slice(1)),
    ];
  }
}


// ===== generate the data of the circle (position/radius/color scheme) =====
function generateLayout(){
  rings = [];
  const S = min(width, height);

  // The quantity of the two types of circles
  const N_SPOKES = 5;
  const N_DOTS   = 7;

  // The size range of the two types of circles
  const Rmin_spokes = S * 0.08;
  const Rmax_spokes = S * 0.13;
  const Rmin_dots   = S * 0.05;
  const Rmax_dots   = S * 0.08;

  const pool = colorSet.slice(1);  // Color library (excluding background)

  // 1.Spokes type: 
  // It has spokes, an outer ring and a dot matrix ring, with a double-layer dot ending at the center.
  for (let i = 0; i < N_SPOKES; i++){
    let r = random(Rmin_spokes, Rmax_spokes);
    let x = random(r + 20, width  - r - 20);
    let y = random(- height, height);
    let vy = random(3.2, 4.2); //falling velocity
    let palette = [
      random(pool),
      random(pool),
      random(pool),
      random(pool),
      random(pool)
    ];
     rings.push({ x, y, r, palette, style: 'spokes', vy });
  }

  // Dots type: A circle composed of concentric dot matrix rings and radiating rays.
  for (let i = 0; i < N_DOTS; i++){
    let r = random(Rmin_dots, Rmax_dots);
    let x = random(r + 20, width  - r - 20);
    let y = random(r + 20, height - r - 20);
    let vy = random(1.7, 3.2);
    let palette = [
      random(pool),
      random(pool),
      random(pool),
      random(pool),
      random(pool)
    ];
    rings.push({ x, y, r, palette, style: 'dots', vy });
  }
}

// ===== 窗口尺寸变化 =====
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  generateLayout();
}


// ===== draw a Spokes type circle (outer ring/spoke/middle ring/lattice/center cap) =====
function drawCircle(ring){
  // outer ring
  strokeWeight(max(2, ring.r * 0.08));
  stroke(ring.palette[0]);
  noFill();
  circle(ring.x, ring.y, ring.r * 2);

  // spoke
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

    // middle ring
  strokeWeight(max(2, ring.r * 0.04));
  stroke(ring.palette[2]);
  noFill();
  circle(ring.x, ring.y, ring.r * 1.2);


  // lattice
  // lattice A（outer ring）
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


  // lattice B（inter ring）
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


  // center cap
  noStroke();
  fill(ring.palette[4]);
  circle(ring.x, ring.y, ring.r * 0.24);
  fill(random(colorSet));
  circle(ring.x, ring.y, ring.r * 0.12);
}

// ===== draw a Dots type circle (outer ring/spoke/middle ring/lattice/center cap) =====
function drawDotMandala(ring){

    // spoke
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


  // ---- inter ring ----
  let n1 = 8;                      // The number of inner circle points
  let r1 = ring.r * 0.22;          // Inner circle radius
  let s1 = ring.r * 0.10;          // The size of the inner circle point
  fill(ring.palette[2]);

  for (let i = 0; i < n1; i++){
    let a = i * TWO_PI / n1;
    let x = ring.x + r1 * cos(a);
    let y = ring.y + r1 * sin(a);
    circle(x, y, s1);
  }

  //---- middle ring ----
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

  // ---- outer ring ----
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

  // small circle in the center
  fill(ring.palette[0]);
  circle(ring.x, ring.y, ring.r * 0.20);
}
