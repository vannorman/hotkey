// detect key pressed. Wehn a key is pressed, populate the iframe with that youtube video.
var Input = {
    mouse : null,
    keyboard : {
        shiftKey : false,
    }
}
const staticDir = "/static/js/"
var Game = {
    app : null,
    mainCamera : null,
    player : null,
    playerController : null,
    canvas : null,
    assets : null,
    Init() {
        Game.LoadAmmoWasm(Game.Init2);
    },
    Init2(){
        Game.LoadCanvas(Game.Init3);
    },
    Init3(){
        console.log("init 3.");
        Game.LoadScripts();
        Game.InitCamera();
        Game.InitLights();
        Game.InitMouse();
        Game.InitPlayer();
        Game.InitScene();

        this.app.start();
        $('#application').attr('width','600').attr('height','400') /// ughh wtf
    }, 
     LoadAmmoWasm(callback){
        pc.WasmModule.setConfig("Ammo", {
            glueUrl: "/static/lib/ammo/ammo.wasm.js",
            wasmUrl: "/static/lib/ammo/ammo.wasm.wasm",
            fallbackUrl: "/static/lib/ammo/ammo.js",
        });
        pc.WasmModule.getInstance("Ammo",callback);

    },
  LoadCanvas(callback){
           // create a playcanvas application
        this.canvas = document.getElementById('application');
        this.assets = {
            torus: new pc.Asset("torus", "container", {
                url: "/static/assets/models/torus.glb",
            }),
        };


        let deviceType = 'webgl2'

        const gfxOptions = {
            deviceTypes: [deviceType],
            glslangUrl: "/static/lib/glslang/glslang.js",
            twgslUrl: "/static/lib/twgsl/twgsl.js",
        };
        
        pc.createGraphicsDevice(this.canvas, gfxOptions).then((device) => {
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
            this.app = new pc.AppBase(this.canvas);
            this.app.init(createOptions);
            this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
            this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
            callback();
        })



        // ensure canvas is resized when window changes size
        window.addEventListener('resize', () => app.resizeCanvas());

    },
    InitCamera(){
       // create camera entity
        Game.mainCamera = new pc.Entity('mainCamera');
        Game.mainCamera.name = "MainCamera";
        Game.mainCamera.addComponent('camera', {
            clearcolor: new pc.Color(0.1, 0.1, 0.1)
        });
        this.app.root.addChild(Game.mainCamera);
        Game.mainCamera.setPosition(0, 0, 3);


    },
    InitLights(){
         // create directional light entity
        const light = new pc.Entity('light');
        light.addComponent('light');
        this.app.root.addChild(light);
        light.setEulerAngles(45, 0, 0);
 
    },
    LoadScripts(){
        console.log("Thisa pp:"+this.app);
        this.app.assets.loadFromUrl(staticDir+"thirdPersonController.js",'script',function(err,asset){
            if (err){ console.log("FAILED to load thirdPersonController.js. err:"+err); }
        });
        this.app.assets.loadFromUrl(staticDir+"mouse.js",'script',function(err,asset){
            if (err){ console.log("FAILED to load mouse.js. err:"+err); }
        });

    },
    InitMouse(){
        // shouldn't be its own entity? lets just use app.mouse?
        const mouseEntity = new pc.Entity();
          this.app.root.addChild(mouseEntity); 
            // Attach the ThirdPeonController script to the cube entity
            Input.mouse = mouseEntity.addComponent('script');
            Input.mouse.create('mouse', {});
    },
    InitPlayer(){
        console.log("This:"+this);
                // Parent the camera to it
        let box = new pc.Entity("cube");
        box.addComponent('model', {
            type: 'box'
        });
        this.app.root.addChild(box);
        box.setPosition(new pc.Vec3(4,2,-10));
         let box2  = new pc.Entity("cube");
        box2.addComponent('model', {
            type: 'box'
        });
        this.app.root.addChild(box2);

         let pivot = new pc.Entity("pivot");
        box2.addComponent('model', {
            type: 'box'
        });
        this.app.root.addChild(pivot);
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
//        console.log("pivot:"+Game.playerController.pivot.name);
        let rb = box2.addComponent("rigidbody"); // Without options, this defaults to a 'static' body
        box2.addComponent("collision"); // Without options, this defaults to a 1x1x1 box shape
        rb.type = pc.BODYTYPE_DYNAMIC;
    },
    InitScene(){
        Scenes.cubeScene(Game.app);
    }
}
$(document).ready(function(){
    Game.Init();
    // Create a cube entity

});

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

