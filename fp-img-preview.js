(function(){
    
    const FP = (function(){
        let currImg = null,
            shadow = null;

        function getObj () {
            if (!currImg) {
                currImg = new Image();
                currImg.classList.add('fp-curr-img');
                shadow = document.createElement('div');
                shadow.classList.add('fp-shadow');
                shadow.appendChild(currImg);
                currImg.onload = function () {

                }
            }

            return currImg;
        }

        function setAttrs (img, src, pos) {
            debugger;
            img.src = src;
            let s = img.style;
            img.setAttribute('style', `transform: translate3d( ${pos.left}px, ${pos.top}px, 0 )`);
        }

        return {
            init (src, pos) {
                const img = getObj();
                setAttrs(img, src, pos);
                document.body.appendChild(shadow);

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

            FP.init(src, pos);
        })
    })

})()