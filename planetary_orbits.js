//Animated planetary orbits!
//See https://codepen.io/erk529/pen/WRJLzb
//Can be run as either geo-centric or helio-centric

$(document).ready(function(){

var G = 6.67e-11
function Planet(x, v, mass, name, col, rad){
	this.pos = x
	this.vel = v
	this.mass = mass
	this.name = name
	this.force = [0,0,0]
	this.radius=rad;
	this.color=col
	this.step = function(dt){
		for (i=0;i<3;i++){
			accel = this.force[i] / this.mass
			this.vel[i] += 0.5*accel*dt
			this.pos[i] += this.vel[i]*dt
					
		}
		var newF = getForce(System, this.pos, this.mass);
		for (i=0;i<3;i++){
			accel = newF[i] / this.mass
			this.vel[i] += 0.5*accel*dt;
		}
	}
	this.draw = function(){
		var scaled = scaleCoords(this.pos);
		ctx.beginPath();
		ctx.arc(scaled[0], scaled[1], this.radius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}
  	this.draw2 = function(other){
      var new_cord = [0,0,0]
      
      for (i=0;i<3;i++){new_cord[i] = this.pos[i] - other[i]}
      var scaled = scaleCoords(new_cord);
      
      ctx.beginPath();
      ctx.arc(scaled[0], scaled[1], this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
	
	
}
function getForce(p_list, pos, mass){
	F = [0,0,0]
	N = p_list.length;
	for (i=0;i<N;i++){
		R = [0,0,0]
		Rsq = 0
		for (d=0;d<3;d++){
			R[d] = pos[d] - p_list[i].pos[d]
			Rsq += R[d]*R[d]
		}
		if (Rsq > 1000){
			for (d=0;d<3;d++){
				F[d] += -G*mass*p_list[i].mass*(R[d]/Math.sqrt(Rsq)) / Rsq
			}
		}
	}
	return F;
}

function Forces(p_list){
	N = p_list.length;
	for (i=0;i<N;i++){
		p_list[i].force = [0,0,0];
		for (j=0;j<N;j++){
			if (i != j){
				rsq = 0
				R = [0,0,0]
				for (d=0;d<3;d++){
					R[d] = p_list[i].pos[d] - p_list[j].pos[d]
					rsq += R[d]*R[d]
				}
				for (d=0;d<3;d++){
					p_list[i].force[d] += -G*p_list[i].mass*p_list[j].mass*(R[d]/Math.sqrt(rsq)) * 1/(rsq)
				}
			}
		}
	}
}

var Earth = new Planet([-1.38193861e+11,5.29040395e+10,2.39498595e+07], 
						[-1.09953949e+04,-2.79882154e+04,2.30785673e+00], 5.972e24, 'Earth','blue', 15)
var Sun = new Planet([0,0,0], [0,0,0], 1.99e30, 'Sun', 'yellow', 25)
var Mars = new Planet([  1.42318187e+11,1.69059636e+11,2.53858418e+07], 
						[-17617.43438328,17688.15636696, 802.77731327], 6.4185e+23, 'Mars', 'red', 12)
var Venus = new Planet([-8.57548862e+10,6.45559847e+10,5.82983212e+09], 
						[-20993.09883949, -28301.90103956,    822.97248269], 4.8685e+24, 'Venus', 'orange', 14)
var Mercury = new Planet([4.64371222e+10, -3.95797708e+10, -7.52590352e+09], 
						[22448.20129905,  38952.86760572,   1122.16430577], 3.302e23, 'Venus', 'brown', 9)
var Moon = new Planet([ -1.37821113e+11,   5.28839942e+10,  -3.78549401e+07],[-10974.74448003, -26935.85310393, -85.37848782], 734.9e20, 'Moon', 'gray', 4)

var System = [Earth,Venus, Mars,Mercury,Sun, Moon];

function RunSim(n_steps){
	for (n=0;n<n_steps;n++){
		Forces(System);
		for (p=0;p<System.length;p++){
			System[p].step(1000);
		}
		console.log(scaleCoords(Earth.pos));
	}
}
var dim = Math.min($( document ).width(), $( document ).height())
$("#space").css("width",dim+"px");
$("#space").css("height",dim+"px");
var X_max = dim;
var Y_max = dim;

function scaleCoords(X){
	var newx, newy;
	newx = (X[0] + 6e11) *X_max / 12e11
	newy = (X[1] + 6e11) *Y_max / 12e11
	return [newx, newy]
}


function draw(){
	//ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	Forces(System);
	for (p=0;p<System.length;p++){
			System[p].step(24*3600);
			System[p].draw2(Earth.pos);//Geocentric!
      //System[p].draw(); -- uncomment for heliocentric
			
	}
	raf = window.requestAnimationFrame(draw);
}
  
  
	var canvas = document.getElementById('space')
	var ctx = canvas.getContext('2d');
	var raf;
	draw();
});

