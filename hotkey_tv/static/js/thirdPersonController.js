var ThirdPersonController = pc.createScript('thirdPersonController');

ThirdPersonController.attributes.add('camera', { type: 'entity', title: 'Camera' });
ThirdPersonController.attributes.add('pivot', {type: 'entity'});
ThirdPersonController.attributes.add('moveSpeed', { type: 'number', default: 4, title: 'Move Speed' });
ThirdPersonController.attributes.add('lookSpeed', { type: 'number', default: 1, title: 'Turn Speed' });

ThirdPersonController.prototype.initialize = function () {
    console.log("INIT 3rd person controller prototype");
    // Enable the mouse to control the camera rotation
    Game.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    Game.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    
    // Initialize the character's movement direction
    this.direction = new pc.Vec3(); 
    this.eulers = new pc.Vec3();
    this.force = new pc.Vec3();
    console.log("ths pivot:"+Game.playerController.pivot); 
    // WHY are Game.playerController and "this" different  ?
//    console.log(Game.playerController);
  //  console.log(this);
    this.pivot = Game.playerController.pivot;
    this.camera = Game.playerController.camera;
};

ThirdPersonController.prototype.update = function (dt) {
    // on update the eulers
    this.pivot.setLocalEulerAngles(this.eulers.x, this.eulers.y, 0);

    // movement
    var x = 0;
    var z = 0;
    var app = this.app;
    var right = this.camera.right;
    var forward = this.camera.forward;

    // Use W-A-S-D keys to move player
    // Check for key presses
    if (app.keyboard.isPressed(pc.KEY_A) || app.keyboard.isPressed(pc.KEY_Q)) {
        x -= right.x;
        z -= right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_D)) {
        x += right.x;
        z += right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_W)) {
        x += forward.x;
        z += forward.z;
    }

    if (app.keyboard.isPressed(pc.KEY_S)) {
        x -= forward.x;
        z -= forward.z;
    }
    
    if (x !== 0 || z !== 0) {
        this.force.set(x, 0, z).normalize().scale(100);
        this.entity.rigidbody.applyForce(this.force);
    }

};
ThirdPersonController.prototype.onMouseDown = function (e) {
    this.app.mouse.enablePointerLock();
}

ThirdPersonController.prototype.onMouseMove = function (e) {
    if (pc.Mouse.isPointerLocked() == false) return;
    this.eulers.y -= this.lookSpeed * e.dx;
    this.eulers.x -= this.lookSpeed * e.dy;
    this.eulers.x %= 360;
    // clamp btw -21 and 47
    let min = -21;
    let max = 46;
    this.eulers.x = clamp(this.eulers.x,min,max); 
};
