var Input = {
    mouse : null,
    keyboard : {
        shiftKey : false,
    }
}
var Game = {
    camera : null,
    playerController : null,
    pivot : null,
    app : null,
}

$(document).ready(function(){
    // from: https://playcanvas.github.io/#/physics/falling-shapes

    let canvas = document.getElementById('application');
    let webGlVersion = 'webgl2';
    example(canvas,webGlVersion);
});

function example(canvas, deviceType) {
    pc.WasmModule.setConfig("Ammo", {
        glueUrl: "/static/lib/ammo/ammo.wasm.js",
        wasmUrl: "/static/lib/ammo/ammo.wasm.wasm",
        fallbackUrl: "/static/lib/ammo/ammo.js",
    });

    pc.WasmModule.getInstance("Ammo", demo);

    function demo() {
        const assets = {
            torus: new pc.Asset("torus", "container", {
                url: "/static/assets/models/torus.glb",
            }),
        };

        const gfxOptions = {
            deviceTypes: [deviceType],
            glslangUrl: "/static/lib/glslang/glslang.js",
            twgslUrl: "/static/lib/twgsl/twgsl.js",
        };

        pc.createGraphicsDevice(canvas, gfxOptions).then((device) => {
            const createOptions = new pc.AppOptions();
            createOptions.graphicsDevice = device;
            createOptions.keyboard = new pc.Keyboard(document.body);

            createOptions.componentSystems = [
                // @ts-ignore
                pc.RenderComponentSystem,
                // @ts-ignore
                pc.CameraComponentSystem,
                // @ts-ignore
                pc.LightComponentSystem,
                // @ts-ignore
                pc.ScriptComponentSystem,
                // @ts-ignore
                pc.CollisionComponentSystem,
                // @ts-ignore
                pc.RigidBodyComponentSystem,
                // @ts-ignore
                pc.ElementComponentSystem,
            ];

            createOptions.resourceHandlers = [
                // @ts-ignore
                pc.TextureHandler,
                // @ts-ignore
                pc.ContainerHandler,
                // @ts-ignore
                pc.ScriptHandler,
                // @ts-ignore
                pc.JsonHandler,
                // @ts-ignore
                pc.FontHandler,
            ];

            const app = new pc.AppBase(canvas);
            Game.app = app;
            app.init(createOptions);

            // Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
            app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
            app.setCanvasResolution(pc.RESOLUTION_AUTO);

            const assetListLoader = new pc.AssetListLoader(
                Object.values(assets),
                app.assets
            );
            assetListLoader.load(() => {
                app.start();

                app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

                // Set the gravity for our rigid bodies
                app.systems.rigidbody.gravity.set(0, -9.81, 0);

                function createMaterial(color) {
                    const material = new pc.StandardMaterial();
                    material.diffuse = color;
                    // we need to call material.update when we change its properties
                    material.update();
                    return material;
                }

                // create a few materials for our objects
                const red = createMaterial(new pc.Color(1, 0.3, 0.3));
                const gray = createMaterial(new pc.Color(0.7, 0.7, 0.7));

                // ***********    Create our floor   *******************

                const floor = new pc.Entity();
                floor.addComponent("render", {
                    type: "box",
                    material: gray,
                });

                // scale it
                floor.setLocalScale(100, 1, 100);

                // add a rigidbody component so that other objects collide with it
                floor.addComponent("rigidbody", {
                    type: "static",
                    restitution: 0.5,
                });

                // add a collision component
                floor.addComponent("collision", {
                    type: "box",
                    halfExtents: new pc.Vec3(50, 0.5, 50),
                });

                // add the floor to the hierarchy
                app.root.addChild(floor);

                // ***********    Create lights   *******************

                // make our scene prettier by adding a directional light
                const light = new pc.Entity();
                light.addComponent("light", {
                    type: "directional",
                    color: new pc.Color(1, 1, 1),
                    castShadows: true,
                    shadowBias: 0.2,
                    shadowDistance: 25,
                    normalOffsetBias: 0.05,
                    shadowResolution: 2048,
                });

                // set the direction for our light
                light.setLocalEulerAngles(45, 30, 0);

                // Add the light to the hierarchy
                app.root.addChild(light);

                // ***********    Create camera    *******************

                // Create an Entity with a camera component
                const camera = new pc.Entity();
                Game.mainCamera = camera;
                camera.addComponent("camera", {
                    clearColor: new pc.Color(0.5, 0.5, 0.8),
                    farClip: 500,
                });

                // add the camera to the hierarchy
                app.root.addChild(camera);

                // Move the camera a little further away
                camera.translate(0, 10, 15);
                camera.lookAt(0, 2, 0);

                // helper function which creates a template for a collider
                const createTemplate = function (
                    type,
                    collisionOptions,
                    template
                ) {
                    // add a render component (visible mesh)
                    if (!template) {
                        template = new pc.Entity();
                        template.addComponent("render", {
                            type: type,
                        });
                    }

                    // ...a rigidbody component of type 'dynamic' so that it is simulated by the physics engine...
                    template.addComponent("rigidbody", {
                        type: "dynamic",
                        mass: 50,
                        restitution: 0.5,
                    });

                    // ... and a collision component
                    template.addComponent("collision", collisionOptions);

                    return template;
                };

                // ***********    Create templates    *******************

                // Create a template for a falling box
                const boxTemplate = createTemplate("box", {
                    type: "box",
                    halfExtents: new pc.Vec3(0.5, 0.5, 0.5),
                });

                // A sphere...
                const sphereTemplate = createTemplate("sphere", {
                    type: "sphere",
                    radius: 0.5,
                });

                // A capsule...
                const capsuleTemplate = createTemplate("capsule", {
                    type: "capsule",
                    radius: 0.5,
                    height: 2,
                });

                // A cylinder...
                const cylinderTemplate = createTemplate("cylinder", {
                    type: "cylinder",
                    radius: 0.5,
                    height: 1,
                });

                // A torus mesh...
                const container = assets.torus.resource;
                const meshTemplate = container.instantiateRenderEntity();

                createTemplate(
                    null,
                    {
                        type: "mesh",
                        renderAsset: container.renders[0],
                    },
                    meshTemplate
                );

                // add all the templates to an array so that
                // we can randomly spawn them
                const templates = [
                    boxTemplate,
                    sphereTemplate,
                    capsuleTemplate,
                    cylinderTemplate,
                    meshTemplate,
                ];

                // disable the templates because we don't want them to be visible
                // we'll just use them to clone other Entities
                templates.forEach(function (template) {
                    template.enabled = false;
                });

                // ***********    Update Function   *******************

                // initialize variables for our update function
                let timer = 0;
                let count = 40;

                // Set an update function on the application's update event
                app.on("update", function (dt) {
                    // create a falling box every 0.2 seconds
                    if (count > 0) {
                        timer -= dt;
                        if (timer <= 0) {
                            count--;
                            timer = 0.2;

                            // Clone a random template and position it above the floor
                            const template =
                                templates[
                                    Math.floor(Math.random() * templates.length)
                                ];
                            const clone = template.clone();
                            // enable the clone because the template is disabled
                            clone.enabled = true;

                            app.root.addChild(clone);

                            clone.rigidbody.teleport(
                                pc.math.random(-1, 1),
                                10,
                                pc.math.random(-1, 1)
                            );
                            clone.rigidbody.angularVelocity = new pc.Vec3(
                                Math.random() * 10 - 5,
                                Math.random() * 10 - 5,
                                Math.random() * 10 - 5
                            );
                        }
                    }

                    // Show active bodies in red and frozen bodies in gray
                    app.root
                        .findComponents("rigidbody")
                        .forEach(function (body) {
                            if (body && body.entity.render){
                                body.entity.render.meshInstances[0].material =
                                    body.isActive() ? red : gray;
                                    }
                        });

                });



                // END example scripts

                let staticDir = '/static/js/'
                app.assets.loadFromUrl(staticDir+"thirdPersonController.js",'script',function(err,asset){
                    if (err){ console.log("FAILED to load thirdPersonController.js. err:"+err); }
                });
                app.assets.loadFromUrl(staticDir+"mouse.js",'script',function(err,asset){
                    if (err){ console.log("FAILED to load mouse.js. err:"+err); }
                });



                const mouseEntity = new pc.Entity();
                app.root.addChild(mouseEntity); 
                // Attach the ThirdPeonController script to the cube entity
                Input.mouse = mouseEntity.addComponent('script');
                Input.mouse.create('mouse', {});
     
                        // Parent the camera to it
                let box = new pc.Entity("cube");
                box.addComponent('model', {
                    type: 'box'
                });
                app.root.addChild(box);
                box.setPosition(new pc.Vec3(4,2,-10));
                 let box2  = new pc.Entity("cube");
                box2.addComponent('model', {
                    type: 'box'
                });
                app.root.addChild(box2);

                 let pivot = new pc.Entity("pivot");
                 Game.pivot = pivot;
                box2.addComponent('model', {
                    type: 'box'
                });
                app.root.addChild(pivot);
                pivot.reparent(box2);


                box.reparent(box2);
                  Game.mainCamera.reparent(pivot);
                Game.playerController = box2.addComponent('script');
                Game.playerController.create('thirdPersonController', {
                    attributes : {
                        camera : Game.mainCamera,
                        pivot : pivot,
                        moveSpeed : 4,
                        turnSpeed : 1.2
                  }
                 });
        //         Game.playerController.turnSpeed = 1.2;
                Game.playerController.camera = Game.mainCamera;
                Game.playerController.pivot = pivot;
                console.log("pivot:"+Game.playerController.pivot.name);
                let rb = box2.addComponent("rigidbody"); // Without options, this defaults to a 'static' body
                box2.addComponent("collision"); // Without options, this defaults to a 1x1x1 box shape
                rb.type = pc.BODYTYPE_DYNAMIC;
                Scenes.cubeScene(app);         
            });
        });
    }
}

var Scenes = {
    cubeScene(app)  {
        for(let i=0;i<25;i++){
            for(let j=0;j<25;j++){
                // Create a grid            
                let box = new pc.Entity("cube");
                box.addComponent('model', {
                    type: 'box'
                });
                app.root.addChild(box);
                box.setPosition(new pc.Vec3(i*1.2,j*1.2,-40));
                console.log("cubes added");
            }
        }
    }
}

$(document).on("keydown", function (e) {
    let ee = String.fromCharCode(e.which);
    //console.log('e:'+ee +", sh:"+e.shiftKey);
    Input.keyboard.shiftKey = e.shiftKey

    if (ee = 'b'){
        return;
        const box = new pc.Entity('cube');
        box.addComponent('model', {
            type: 'box'
        });
        Game.app.root.addChild(box);
        box.setPosition(Math.random(),Math.random(),Math.random())
    }
    // use e.which
});


