(function(){
    
    const FP = (function(){
        let currImg = null,
            wrapper = null,
            shadow = null,
            currPos = {},
            transitionDuration = 300;

        const wait = duration => new Promise(res => { setTimeout( res, duration ) });

        const scrollHandler = (function () {
            let previousTop = 0,
                currentTop;
            return function (e) {
                currentTop = this.scrollTop;

                // if scroll to edge
                if ( currentTop <= 0 || currentTop + this.clientHeight >= this.scrollHeight) {
                    zoomOut();
                }

                previousTop = currentTop;
            }
        })()

        function getObj () {
            if (!currImg) {
                currImg = new Image();
                currImg.classList.add('fp-curr-img');

                wrapper = document.createElement('div');
                wrapper.classList.add('fp-wrapper');
                wrapper.appendChild(currImg);

                shadow = document.createElement('div');
                shadow.classList.add('fp-shadow', 'hidden');
                shadow.appendChild(wrapper);

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
                document.body.removeAttribute('style');
                res();
            })
            .then(() => wait(transitionDuration))
            .then(() => {
                shadow.classList.add('hidden');
            })
        }

        function zoomIn() {
            let screenW = window.innerWidth || 1,
                screenH = window.innerHeight || 1,
                imgOriginW = currImg.width || 0,
                imgOriginH = currImg.height || 0,
                paddingTop = (imgOriginH + 40) >= screenH ? 20 : (screenH - imgOriginH) / 2,
                scrollHeight = 40,
                scale = 1,
                x,
                y;

            x = (screenW - imgOriginW) / 2 >= 0 ? (screenW - imgOriginW) / 2 : 40;
            y = paddingTop;

            // emit transition, tried Promise but seems only setTimeout works
            let transFunc = () => { currImg.setAttribute('style', `transform: translate3d( ${x}px, ${y + scrollHeight}px, 0 ) scale(${scale}); `); }
            setTimeout(transFunc, 0);

            // transform wrapper
            wrapper.setAttribute('style', `height: ${imgOriginH + paddingTop * 2 + scrollHeight * 2}px; `)

            // make scroll space;
            shadow.scrollTop = scrollHeight;

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