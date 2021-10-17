// you need two people for this sketch!

let video;
let poseNet;
let poses = [];
let accuracy = 50;
let screenWidth = 1400;
let ScreeHeight = 1000;
function setup() {
  createCanvas(screenWidth, ScreeHeight);//createCanvas(640, 480);

  video = createVideo('../assets/momwithbaby.mp4'); //createCapture(VIDEO);
  video.volume(0);
  //video.size(width, height);

  // Create a new poseNet method with a multiple detection
  poseNet = ml5.poseNet(video, 'multiple', modelReady);

  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.loop();
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function mousePressed() {
  console.log(JSON.stringify(poses))
}

function draw() {
  // reverse the canvas context to mirror your image
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  strokeWeight(2);

  if ( (poses.length > 1) && (poses[0].pose.score*100>accuracy) && (poses[1].pose.score*100>accuracy) ) {
    height = ScreeHeight;
    // pose information for 1st person
    let person0 = poses[0].pose;
    // Draw a red ellipse for key point
    //fill(240, 0, 0);
    let point0 = person0.nose;
    //ellipse(point0.x, point0.y, 40, 40);

    // pose information for 2nd person
    let person1 = poses[1].pose;
    // Draw a blue ellipse for key point
    //fill(0, 0, 240);
    let point1 = person1.nose;
    //ellipse(point1.x, point1.y, 40, 40);
    var maxPerson;
    if(point0.y<point1.y){
      maxPerson = person0;
    }else{
      maxPerson = person1;
    }
    drawSqaure(maxPerson);

  }
  pop();
}
function drawSqaure(maxPerson) {
  stroke(0, 0, 255);
  noFill();
  let d = dist(maxPerson.nose.x, maxPerson.nose.y, maxPerson.rightWrist.x, maxPerson.rightWrist.y);
  
  square(maxPerson.nose.x - (d/2) , maxPerson.nose.y- (d/2), d);
}