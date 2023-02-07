// detect key pressed. Wehn a key is pressed, populate the iframe with that youtube video.
$(document).ready(function(){
//    alert('hi')
});

$(document).on("keypress", function (e) {
    let ee = String.fromCharCode(e.which);
    console.log('e:'+ee );
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

