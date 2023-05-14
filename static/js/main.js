// detect key pressed. Wehn a key is pressed, populate the iframe with that youtube video.
var app;
$(document).ready(function(){
    console.log("Doc ready.");
    // create a playcanvas application
    const canvas = document.getElementById('application');
    app = new pc.Application(canvas,{mouse: new pc.Mouse(canvas),  keyboard: new pc.Keyboard(window),});
    const staticDir = "/static/js/"

    // fill the available space at full resolution
    app.setCanvasFillMode(pc.fillmode_fill_window);
    app.setCanvasResolution(pc.resolution_auto);

    // ensure canvas is resized when window changes size
    window.addEventListener('resize', () => app.resizeCanvas());

    // create box entity
    const box = new pc.Entity("cube");

    box.addComponent('model', {
        type: 'box'
    });
    app.root.addChild(box);

    // create camera entity
    const camera = new pc.Entity('camera');
    camera.name = "MainCamera";
    camera.addComponent('camera', {
        clearcolor: new pc.Color(0.1, 0.1, 0.1)
    });
    app.root.addChild(camera);
    camera.setPosition(0, 0, 3);

    // create directional light entity
    const light = new pc.Entity('light');
    light.addComponent('light');
    app.root.addChild(light);
    light.setEulerAngles(45, 0, 0);


    app.start();
    $('#application').attr('width','600').attr('height','400') /// ughh wtf


    // Chat GPT stuff
    // Create a cube entity
    const cube = new pc.Entity();
    cube.addComponent('model', {
        type: 'box'
    });
    app.root.addChild(cube);

    app.assets.loadFromUrl(staticDir+"mouse.js",'script',function(err,asset){
        if (!err){
            console.log("MOUSE loaded.");
        } else {
            console.log("MOUSE nott.");
        }
        const mouseEntity = new pc.Entity();
          app.root.addChild(mouseEntity); 
            // Attach the ThirdPeonController script to the cube entity
            const mouse= mouseEntity.addComponent('script');
            mouse.create('mouse', {
             });


    });
    app.assets.loadFromUrl(staticDir+"thirdPersonController.js",'script',function(err,asset){
        if (!err){
              const cube = new pc.Entity();
              cube.addComponent('model', {
                  type: 'box'
              });
              app.root.addChild(cube); 
                // Attach the ThirdPeonController script to the cube entity
                const thirdPersonController = cube.addComponent('script');
                thirdPersonController.create('thirdPersonController', {
                    attributes : {
                        camera : camera, // Set the camera entity reference here
                        moveeed: 4,
                        turpeed: 100
                  }
                 });

        } else {
            console.log("err:"+err)

        }

    });
    app.on('update', dt => box.rotate(10 * dt, 20 * dt, 30 * dt));
    app.mouse.enablePointerLock()



});

$(document).on("keypress", function (e) {
    return;
    let ee = String.fromCharCode(e.which);
    // console.log('e:'+ee );
    if (ee = 'b'){
        const box = new pc.Entity('cube');
        box.addComponent('model', {
            type: 'box'
        });
        app.root.addChild(box);
        box.setPosition(Math.random(),Math.random(),Math.random())


    }
    // use e.which
});

