var Mouse = pc.createScript('mouse');

Mouse.attributes.add('redMaterial', {
    type: 'asset',
    assetType: 'material'
});

Mouse.attributes.add('greenMaterial', {
    type: 'asset',
    assetType: 'material'
});

Mouse.attributes.add('blueMaterial', {
    type: 'asset',
    assetType: 'material'
});

// initialize code called once per entity
Mouse.prototype.initialize = function() {
    console.log("MOUSE Init");
    this.pos = new pc.Vec3();
    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    this.app.mouse.disableContextMenu();
    this.cameraEntity = this.app.root.findByName('MainCamera');

    // Use the on() method to attach event handlers.
    // The mouse object supports events on move, button down and
    // up, and scroll wheel.
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);


    console.log("mouse bound.");
};

Mouse.prototype.onMouseMove = function (event) {
    // Use the camera component's screenToWorld function to convert the
    // position of the mouse into a position in 3D space
    var depth = 10;
    this.cameraEntity.camera.screenToWorld(event.x, event.y, depth, this.pos);
    console.log("cam x:"+event.x);
    // Finally update the cube's world-space position
//    this.entity.setPosition(this.pos);
};

Mouse.prototype.onMouseDown = function (event) {
    console.log("eV:"+event);
    this.app.mouse.enablePointerLock()

    // If the left mouse button is pressed, change the cube color to red
//    if (event.button === pc.MOUSEBUTTON_LEFT) {
//        this.entity.render.meshInstances[0].material = this.redMaterial.resource;
//    }

};

