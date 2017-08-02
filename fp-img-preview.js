(function(){
    
    const FP = (function(){
        let currImg = null,
            shadow = null,
            currPos = {},
            transitionDuration = 300;

        const wait = duration => new Promise(res => { setTimeout( res, duration ) });

        function getObj () {
            if (!currImg) {
                currImg = new Image();
                currImg.classList.add('fp-curr-img');
                shadow = document.createElement('div');
                shadow.classList.add('fp-shadow', 'hidden');
                shadow.appendChild(currImg);

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
            currImg.removeAttribute('style');
            currImg.setAttribute('style', `transform: translate3d( ${currPos.left}px, ${currPos.top}px, 0 ); `);

            shadow.classList.remove('hidden');

            // body overflow hidden
            document.body.setAttribute('style', 'overflow: hidden;');
        }

        function zoomOut () {
            let transFunc = () => { currImg.setAttribute('style', `transform: translate3d( ${currPos.left}px, ${currPos.top}px, 0 ); `); }
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

        return {
            init (src, pos) {
                const currImg = getObj();
                setInitAttrs(src, pos);
                document.body.appendChild(shadow);

                return this;
            },

            zoomIn () {
                let screenW = window.innerWidth || 0,
                    paddingTop = 20,
                    xProportion = .85,
                    scale,
                    x,
                    y;

                // calculate transform vals
                scale =  screenW * xProportion / currPos.width;
                x = (screenW  * ( 1 - xProportion) / 2 );
                y = paddingTop;
                let transFunc = () => { currImg.setAttribute('style', `transform: translate3d( ${x}px, ${y}px, 0 ) scale(${scale}); `); }

                // do transition, tried Promise but seems only setTimeout works
                setTimeout( transFunc, 0); 
                
                // set class
                currImg.classList.add('active')
                
                return this;
            }
        }
    })()

    const imgs = document.querySelectorAll('img');

    imgs.forEach(function (img) {
        img.addEventListener('click', function () {
            const src = this.src,
                rect = this.getBoundingClientRect(),
                pos = {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                }

            FP.init(src, pos).zoomIn();
        })
    })

})()