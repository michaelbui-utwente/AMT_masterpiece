/*
------------COURSE: ART, MATHEMATICS, AND TECHNOLOGY-------------
----------------MICHAEL BUI - UNIVERSITY OF TWENTE---------------
---------------------------JUNE, 2020----------------------------
*/

/*
----------------------INTERFACE VARIABLES------------------------
*/
var enperiod_button;           // Enable periodic fractal motion
var disperiod_button;          // Disable periodic fractal motion
var loop_bool;                 // Boolean to enable/disable
var update_a;                  // Updated angle of rotation 

var erperlin_button;           // Enable perlin noise fractal motion
var disperlin_button;          // Disable perlin noise fractal motion

var enmove_button;             // Enable particle movement
var dismove_button;            // Disable particle movement
var move_bool;                 // Boolean to enable/disable

var slider_angle;              // Modify fractal angle
var angle;                     // Fractal angle

var sel_traj;                  // Hypotrochoid drop down menu

var shift_x;                   // X offset variable for GUI
var shift_y;                   // Y offset variable for GUI

var xoff = 0;                  // 1D Perlin noise offset
var max_map;                   // Maximum Perlin noise range
var min_map;                   // Minimum Perlin noise range

/*
----------------------PARTICLE VARIABLES-------------------------
*/
var light;                     // Light image
var size;                      // Image size
var xpos; var ypos;            // Image positions

/*
--------------------HYPOTROCHOID VARIABLES-----------------------
*/
var theta; var R; var r; var d; 

/*
------------------PARTICLE TRAIL PARAMETERS----------------------
*/
var num = 15;                  // Number of particles in the trail
var mx = [];                   // Array of (past) x-coordinates
var my = [];                   // Array of (past) y-coordinates

function preload() {
  light = loadImage('light.png');
}

function setup() {
  canvas_x = 1400; canvas_y = 700;
  createCanvas(canvas_x, canvas_y);
  imageMode(CENTER);
  blendMode(BLEND);
  rectMode(CENTER);
  
  // Initialize variables and parameters
  shift_x = 150; shift_y = 30;
  size = 20; xpos = 0; ypos = 0;
  // add_theta determines the velocity of the hypotrochoid
  theta = 0; R = 200; r = 1; d = 0; add_theta = 0.09; 
  xoff = 0; max_map = 0.02; min_map = -0.02;
  update_a = 0; loop_bool = false;

  /*
  ----------------------------INTERFACE----------------------------
  */
  
  // Fractal angle slider
  slider_angle = createSlider(0, PI, PI/2, 0.01);
  slider_angle.position(width-shift_x, height-(shift_y+12));
  
  // Particle movement button
  move_bool = false;
  enmove_button = createButton('ENABLE');
  enmove_button.position(width-shift_x, height-(2*shift_y+12));
  dismove_button = createButton('DISABLE');
  dismove_button.position(width-shift_x+70, height-(2*shift_y+12));
  
  // Fractal angle modification through Perlin noise
  enperlin_button = createButton('ENABLE');
  enperlin_button.position(width-shift_x, height-(3*shift_y+12));
  disperlin_button = createButton('DISABLE');
  disperlin_button.position(width-shift_x+70, height-(3*shift_y+12));
  
  // Periodic fractal angle modification 
  enperiod_button = createButton('ENABLE');
  enperiod_button.position(width-shift_x, height-(4*shift_y+12));
  disperiod_button = createButton('DISABLE');
  disperiod_button.position(width-shift_x+70, height-(4*shift_y+12));
  
  // Hypotrochoid drop down menu
  sel_traj = createSelect();
  sel_traj.position(width-shift_x, height-(5*shift_y+12));
  sel_traj.option('CIRCLE');
  sel_traj.option('STAR');
  sel_traj.option('ROSE');
  sel_traj.selected('CIRCLE');

  // Append indices to the end of the particle trail array
  for (var i = 0; i < num; i++) {
    mx.push(i);
    my.push(i);
  }
}


function draw() {
  background(0);
  var which = frameCount % num;
  xoff = xoff+0.005;
  angle = slider_angle.value();
  /*
  ----------------------------INTERFACE----------------------------
  */
  noStroke(); fill(255, 50);
  rect(width-shift_x, height-canvas_y/2, 300, height);
  fill(255); textStyle(BOLD);
  textSize(30);
  text('CONTROL PANEL', width-2*shift_x+10, shift_y);
  
  textSize(12);
  text('BRANCH ANGLE', width-2*shift_x+10, height-shift_y);
  text('MOTION OF LIGHTS', width-2*shift_x+10, height-2*shift_y);
  text('PERLIN DYNAMICS', width-2*shift_x+10, height-3*shift_y);
  text('PERIODIC DYNAMICS', width-2*shift_x+10, height-4*shift_y);
  text('MOTION TRAJECTORY', width-2*shift_x+10, height-5*shift_y);
  
  stroke(255, 120);
  translate(width/2-shift_x, height/2);
  branch(100, 8.5, angle, update_a, size, xpos, ypos);
  
  // Hypotrochoid parametrization
  if (move_bool == true) {
    theta += add_theta;
    xpos = (R-r)*cos(theta)+d*cos(theta*(R-r)/r);
    ypos = (R-r)*sin(theta)-d*sin(theta*(R-r)/r);
  }
  
  // Enable periodic motion if loop_bool = true, otherwise idle
  if (loop_bool == true) {
    update_a += 0.02;
  } else {
    update_a = map(noise(xoff), 0, 1, min_map, max_map);
  }
  
  enmove_button.mousePressed(enable_move);
  dismove_button.mousePressed(disable_move);
  
  enperlin_button.mousePressed(enable_dynamics);
  disperlin_button.mousePressed(disable_dynamics);
  
  enperiod_button.mousePressed(enable_periodic);
  disperiod_button.mousePressed(disable_periodic);
  
  sel_traj.changed(select_trajectory);
}


/*
---------------------FUNCTIONS LISTED HERE-----------------------
*/

// Fractal algorithm
function branch(len, l_width, a, a_update, pulse_size, pulse_x, pulse_y) {
  strokeWeight(l_width);
  line(0, 0, 0, -len);
  if (l_width > 1.8) {
    translate(0, -len);
    trail();
    push();
    rotate(a+a_update);
    branch(len, l_width*0.67, a, a_update, pulse_size, pulse_x, pulse_y);
    pop();
    push();
    rotate(-a-a_update);
    branch(len, l_width*0.67, a, a_update, pulse_size, pulse_x, pulse_y);
    pop();
    
    translate(0, 2*len);
    line(0, 0, 0, -len);
    push();
    rotate(a+PI+a_update);
    branch(len, l_width*0.67, a, a_update, pulse_size, pulse_x, pulse_y);
    pop();
    push();
    rotate(-a-PI-a_update);
    branch(len, l_width*0.67, a, a_update, pulse_size, pulse_x, pulse_y);
    pop();
  }
}

function enable_move() {
  move_bool = true;
}

function disable_move() {
  move_bool = false;
  xpos = 0; ypos = 0;
}

function enable_dynamics() {
  loop_bool = false;
  max_map = 3;
  min_map = -3;
}

function disable_dynamics() {
  max_map = 0.02;
  min_map = -0.02;
}

function enable_periodic() {
  loop_bool = true;
  max_map = 0.02;
  min_map = -0.02;
}

function disable_periodic() {
  loop_bool = false;
  xpos = 0; ypos = 0;
}

function select_trajectory() {
  let traj_item = sel_traj.value();
  if (traj_item == 'STAR') {
    R = 120*1; r = 120*(3/5); d = 120*1; add_theta = 0.15;
  } else if (traj_item == 'ROSE') {
    R = 120*1; r = 120*(7/5); d = 120*(5/13); add_theta = 0.15;
  } else if (traj_item == 'CIRCLE') {
    R = 200; r = 1; d = 0; add_theta = 0.07;
  }
}

function trail() {
  var which = frameCount % num;
  mx[which] = xpos;
  my[which] = ypos;
 
  for (var i = 0; i < num; i++) {
    // which+1 is the smallest (the oldest in the array)
    var index = (which + 1 + i) % num;
    image(light, mx[index], my[index], 40/(num-(i*0.9)), 40/(num-(i*0.9)));
  }
}
