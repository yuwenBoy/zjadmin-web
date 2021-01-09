// function resetScreenSize(dw, dh) {
//     let init = () => {
//         let _el = document.getElementById('datapage');
//         var w = dw / 1920, h = dh / 1080, trX = (window.innerWidth - _el.offsetWidth) / 2, trY = (window.innerHeight - _el.offsetHeight) / 2;
//         //_el.style.transformOrigin = '0 0';
//         var scaleWidth=  _el.getBoundingClientRect().width;
//         var scaleHeight=  _el.getBoundingClientRect().height;
//         _el.style.transform = `translate(${trX}px, ${trY}px) scale(${window.innerHeight/_el.offsetHeight})`;
//         _el.style.width = _el.offsetWidth
//         _el.style.height = _el.offsetHeight
//         console.log('scaleWidth'+scaleWidth)
//         console.log('scaleHeight'+scaleHeight)
//     }
//     let lazyFun;
//     window.onresize = () => {
//         clearTimeout(lazyFun);
//         lazyFun = setTimeout(() => {
//             init()
//         }, 600)
//     }
// }

// export default resetScreenSize

let resizeDebounceHdl = null;
function RefreshSize(immediate = false) {
    clearTimeout(resizeDebounceHdl);
    return new Promise((resolve) => {
        resizeDebounceHdl = window.setTimeout(() => {
            const clientWidth = window.innerWidth, clientHeight = window.innerHeight, baseHeight = 1080, ratioRange = [1.6, 2.5];
            let height = 0, width = 0, zoom = 0;
            if (!ratioRange) {
                height = clientHeight;
                width = clientWidth;
            } else if (Array.isArray(ratioRange)) {
                height = Math.min(clientWidth / ratioRange[0], clientHeight);
                width = Math.min(height * ratioRange[1], clientWidth);
            } else {
                height = Math.min(clientWidth / ratioRange, clientHeight);
                width = Math.min(height * ratioRange, clientWidth);
            }
            if (Array.isArray(baseHeight)) {
                if (height > baseHeight[1]) zoom = height / baseHeight[1];
                else if (height < baseHeight[0]) zoom = height / baseHeight[0];
                else zoom = 1;
            } else {
                zoom = height / baseHeight;
            }
            SET_ZOOM(zoom, width / zoom, height / zoom, (clientWidth - width) / 2, (clientHeight - height) / 2);
            resolve(zoom);
        }, immediate ? 0 : 500);
    })
}
function SET_ZOOM(zoom, width, height, offsetX, offsetY) {
    // let style = document.getElementById('viewport-scale-style');
    // if (!style) {
    //     style = document.createElement('style');
    //     document.head.appendChild(style);
    //     style.id = 'viewport-scale-style';
    // }
    let _el = document.getElementById('datapage');
    _el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoom.toFixed(6)})`;
    _el.style.width = width.toFixed(2)+'px'
    _el.style.height = height.toFixed(2)+'px'
}

window.addEventListener('resize', () => RefreshSize(), { passive: true });
// document.addEventListener('touchmove', (event: any) => { if (event.scale !== 1) event.preventDefault(); }, { passive: false });

export default RefreshSize;


