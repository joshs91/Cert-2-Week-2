//particle
var Particle = function()
{
	this.x = 0;
	this.y = 0;
	
	this.vel_x = 0;
	this.vel_y = 0;
	
	this.life_time = 0.5;
	this.cur_life_time = 0.0;
}

//emitter
var Emitter = function()
{
	this.x = 0;
	this.y = 0;
	
	this.alpha = 1.0;
	
	this.image = document.createElement("img");
	this.image.src = "Particle_Coin.png";
	
	this.dir_x = 0.0;
	this.dir_y = 1.0;
	
	this.rand_dir = false;
	
	this.particles  = [];
	
	//particles per second
	this.pps = 0;
	this.particles_to_spawn = 0;
	
	this.cur_particle_index = 0;
}

Emitter.prototype.Initialise = function(x, y, dir_x, dir_y, max_particles, life_time, pps, alpha, is_rand_dir)
{
	this.x = x;
	this.y = y;
	this.dir_x = dir_x;
	this.dir_y = dir_y;
	
	this.rand_dir = is_rand_dir;
	
	this.alpha = alpha;
	
	this.pps = pps;
	
	for (var idx = 0; idx < max_particles; idx++)
	{
		this.particles[idx] = new Particle();
		this.particles[idx].life_time = life_time;
	}
}

Emitter.prototype.update = function(deltaTime)
{
	this.particles_to_spawn += this.pps * deltaTime;
	
	while (Math.floor(this.particles_to_spawn) > 0)
	{
		//spawned particle
		this.particles[this.cur_particle_index].x = this.x;
		this.particles[this.cur_particle_index].y = this.y;
		
		this.particles[this.cur_particle_index].cur_life_time = this.particles[this.cur_particle_index].life_time;
		
		if (this.rand_dir)
		{
			var rand_dir_x = (Math.random() - 0.5) * 2 * 100; 
			var rand_dir_y = (Math.random() - 0.5) * 2 * 100;
			
			var length = Math.sqrt(rand_dir_x * rand_dir_x + 
									rand_dir_y * rand_dir_y)
			if (length == 0)
				rand_dir_x = 1;
			
			this.particles[this.cur_particle_index].vel_x = rand_dir_x / length;
			this.particles[this.cur_particle_index].vel_y = rand_dir_y / length;
		}
		else
		{
			this.particles[this.cur_particle_index].vel_x = this.dir_x;
			this.particles[this.cur_particle_index].vel_y = this.dir_y;
		}
		
		this.cur_particle_index ++;
		if(this.cur_particle_index > this.particles.length)
			this.cur_particle_index = 0;
		
		this.particles_to_spawn --;
	}
	
	//update particles
	for (var idx = 0; idx < this.particles.length; idx++)
	{
		if (this.particles[idx].cur_life_time > 0)
		{
			this.particles[idx].x += this.particles[idx].vel_x;
			this.particles[idx].y += this.particles[idx].vel_y;
			this.particles[idx].cur_life_time -= deltaTime;
		}
	}
}

Emitter.prototype.draw = function(cam_x, cam_y)
{
	for (var idx = 0; idx < this.particles.length; idx++)
	{
		if (this.particles[idx].cur_life_time > 0)
		{
			context.save();
				context.globalAlpha = this.alpha;
				context.drawImage(this.image, 
									this.particles[idx].x - cam_x, 
									this.particles[idx].y - cam_y);
			context.restore();
		}
	}
}

















