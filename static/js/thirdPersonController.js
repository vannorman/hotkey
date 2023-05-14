var ThirdPersonController = pc.createScript('thirdPersonController');

ThirdPersonController.attributes.add('camera', { type: 'entity', title: 'Camera' });
ThirdPersonController.attributes.add('moveSpeed', { type: 'number', default: 4, title: 'Move Speed' });
ThirdPersonController.attributes.add('turnSpeed', { type: 'number', default: 1, title: 'Turn Speed' });

ThirdPersonController.prototype.initialize = function () {
    console.log("INIT 3rd person controller prototype.");
    // Enable the mouse to control the camera rotation
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    
    
    // Initialize the character's movement direction
    this.direction = new pc.Vec3();
};

ThirdPersonController.prototype.update = function (dt) {
    // Get the current keyboard input
    var keyboard = this.app.keyboard;
    // Calculate the character's movement direction based on keyboard input
    this.direction.set(0, 0, 0);
    if (keyboard.isPressed(pc.KEY_W)) {
        this.direction.z -= 1;
    }
    if (keyboard.isPressed(pc.KEY_S)) {
        this.direction.z += 1;
    }
    if (keyboard.isPressed(pc.KEY_A)) {
        this.direction.x -= 1;
    }
    if (keyboard.isPressed(pc.KEY_D)) {
        this.direction.x += 1;
    }

    // Normalize the direction vector and multiply by move speed
    this.direction.normalize().scale(this.moveSpeed * dt);

    // Move the character based on the direction vector
    this.entity.translate(this.direction);

    // Rotate the character based on mouse movement
    if (this.camera) {
        var mouse = this.app.mouse;
        var x = mouse.dx * this.turnSpeed * dt;
        console.log("mouse dx:"+mouse.dx);
        this.entity.rotate(0, x, 0);
    } else {
        console.log("not move mouse. mouse:"+this.app.mouse+", camera;"+this.camera);
    }
};

ThirdPersonController.prototype.onMouseMove = function (event) {
    // Rotate the camera based on mouse movement
    if (this.camera ){ // && this.app.mouse.isPointerLocked()) {
        var mouse = this.app.mouse;
        var y = mouse.dy * this.turnSpeed;
        this.camera.rotateLocal(-y, 0, 0);
    }
};
