(function(){
    
    const FP = (function(){
        let currImg = null,
            shadow = null,
            currPos = {},
            transitionDuration = 300;

        const wait = duration => new Promise(res => { setTimeout( res, duration ) });

        function scrollHandler (e) {}

        function getObj () {
            if (!currImg) {
                currImg = new Image();
                currImg.classList.add('fp-curr-img');
                shadow = document.createElement('div');
                shadow.classList.add('fp-shadow', 'hidden');
                shadow.appendChild(currImg);

                shadow.onscroll = scrollHandler;

                shadow.onclick = function () {
                    zoomOut();
                } 

                currImg.onload = function () {
                    // TODO what?
                }
            }

            return currImg;
        }

        function setInitAttrs (src, pos) {
            currImg.src = src;
            currPos = pos;

            let scale = currPos.width / currImg.width ;
            
            currImg.setAttribute('style', `transform: translate3d( ${currPos.left}px, ${currPos.top}px, 0 ) scale(${scale}); `);

            shadow.classList.remove('hidden');

            // body overflow hidden
            document.body.setAttribute('style', 'overflow: hidden;');
        }

        function zoomOut () {
            let scale = currPos.width / currImg.width ;            
            // debugger
            const transFunc = () => { currImg.setAttribute('style', `transform: translate3d( ${currPos.left}px, ${currPos.top}px, 0 ) scale(${scale}); `); }
            currImg.classList.remove('active')
        
            new Promise(res => {
                setTimeout(transFunc, 0)
                res();
            })
            .then(() => wait(transitionDuration))
            .then(() => {
                shadow.classList.add('hidden');
                document.body.removeAttribute('style');
            })
        }

        function zoomIn() {
            let screenW = window.innerWidth || 1,
                screenH = window.innerHeight || 1,
                imgOriginW = currImg.width || 0,
                imgOriginH = currImg.height || 0,
                paddingTop = (imgOriginH + 40) >= screenH ? 20 : (screenH - imgOriginH) / 2,
                scale = 1,
                x,
                y;

            x = (screenW - imgOriginW) / 2 >= 0 ? (screenW - imgOriginW) / 2 : 20;
            y = paddingTop;

            // emit transition, tried Promise but seems only setTimeout works
            let transFunc = () => { currImg.setAttribute('style', `transform: translate3d( ${x}px, ${y}px, 0 ) scale(${scale}); `); }
            setTimeout(transFunc, 0);

            // set class
            currImg.classList.add('active')

            return this;
        }

        return {
            init (src, pos) {
                const currImg = getObj();
                setInitAttrs(src, pos);
                document.body.appendChild(shadow);

                zoomIn()
                return this;
            },
        }
    })()

    const imgs = document.querySelectorAll('img');

    imgs.forEach(function (img) {
        img.classList.add('fp-zoom-in')
        img.addEventListener('click', function () {
            const src = this.src,
                rect = this.getBoundingClientRect(),
                pos = {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                }
            FP.init(src, pos);
        })
    })

})()