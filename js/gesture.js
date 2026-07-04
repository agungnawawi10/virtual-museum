// =======================================================
// MANUAL GESTURE CONTROL
// =======================================================

let activeModel = null;

let rotationY = 0;

let scale = 1;

let dragging = false;

let lastX = 0;

let lastDistance = 0;


// mencari model yang sedang tampil
function getActiveModel() {

    if (!activeEl) return null;

    return activeEl.querySelector(".ar-model");

}


// ketika marker ditemukan
marker.addEventListener("markerFound", () => {

    activeModel = getActiveModel();

    if (!activeModel) return;

    const s = activeModel.getAttribute("scale");

    scale = s.x;

});


// ==========================
// DESKTOP ROTATE
// ==========================

window.addEventListener("mousedown", (e)=>{

    if(!activeModel) return;

    dragging=true;

    lastX=e.clientX;

});


window.addEventListener("mouseup",()=>{

    dragging=false;

});


window.addEventListener("mousemove",(e)=>{

    if(!dragging) return;

    if(!activeModel) return;

    const delta=e.clientX-lastX;

    rotationY+=delta*0.5;

    activeModel.setAttribute(
        "rotation",
        `0 ${rotationY} 0`
    );

    lastX=e.clientX;

});



// ==========================
// MOBILE ROTATE
// ==========================

window.addEventListener("touchstart",(e)=>{

    if(!activeModel) return;

    if(e.touches.length!=1) return;

    dragging=true;

    lastX=e.touches[0].clientX;

});


window.addEventListener("touchend",()=>{

    dragging=false;

    lastDistance=0;

});


window.addEventListener("touchmove",(e)=>{

    if(!activeModel) return;

    // ROTATE
    if(e.touches.length==1 && dragging){

        const x=e.touches[0].clientX;

        const delta=x-lastX;

        rotationY+=delta*0.4;

        activeModel.setAttribute(
            "rotation",
            `0 ${rotationY} 0`
        );

        lastX=x;

    }


    // PINCH
    if(e.touches.length==2){

        e.preventDefault();

        const dx=e.touches[0].clientX-e.touches[1].clientX;

        const dy=e.touches[0].clientY-e.touches[1].clientY;

        const distance=Math.sqrt(dx*dx+dy*dy);

        if(lastDistance){

            scale+=(distance-lastDistance)*0.002;

            scale=Math.max(
                0.15,
                Math.min(scale,1.5)
            );

            activeModel.setAttribute(
                "scale",
                `${scale} ${scale} ${scale}`
            );

        }

        lastDistance=distance;

    }

},{passive:false});




// ==========================
// DESKTOP ZOOM
// ==========================

window.addEventListener("wheel",(e)=>{

    if(!activeModel) return;

    e.preventDefault();

    scale+=e.deltaY*-0.0005;

    scale=Math.max(
        0.15,
        Math.min(scale,1.5)
    );

    activeModel.setAttribute(
        "scale",
        `${scale} ${scale} ${scale}`
    );

},{passive:false});