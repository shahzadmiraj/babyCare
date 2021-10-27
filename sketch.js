// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
let poseNet;
let pose;
let skeleton;
var posesAndSkeleton = [];
var PoseAccuracyScore = 50;
function setup() {
  //createCanvas(0, 0);
  createCanvas(1400, 1000);
  video = createCapture(VIDEO);//createVideo('assets/momwithbaby.mp4');
  video.volume(0);
  video.size(width, height);
  video.loop();
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 1) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    var posesAndSkeletonnew = [];
    poses.filter(poseindex=>{
        if((poseindex.pose.score*100)>PoseAccuracyScore){
          posesAndSkeletonnew.push(poses);
        }
      } 
    );
    posesAndSkeleton = posesAndSkeletonnew;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  image(video, 0, 0);

  if (posesAndSkeleton.length>1) {
    console.log(posesAndSkeleton);
    pointTheBody(posesAndSkeleton[0][0].pose);
    pointTheBody(posesAndSkeleton[1][0].pose);
  }
}

function pointTheBody(pose){
  let eyeR = pose.rightEye;
  let eyeL = pose.leftEye;
  let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
  fill(255, 0, 0);
  ellipse(pose.nose.x, pose.nose.y, d);
  fill(0, 0, 255);
  ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
  ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

  for (let i = 0; i < pose.keypoints.length; i++) {
    let x = pose.keypoints[i].position.x;
    let y = pose.keypoints[i].position.y;
    fill(0, 255, 0);
    ellipse(x, y, 16, 16);
  }

  for (let i = 0; i < skeleton.length; i++) {
    let a = skeleton[i][0];
    let b = skeleton[i][1];
    strokeWeight(2);
    stroke(255);
    line(a.position.x, a.position.y, b.position.x, b.position.y);
  }
}
