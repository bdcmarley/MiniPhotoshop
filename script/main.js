document.addEventListener("DOMContentLoaded",function () {

    // Déclarations des variables

        // canvas principal
        let canvas = document.getElementById("canvas");
        //console.log("canvas ",canvas);

        //get l'image sélectionné
        let selectedImage = document.getElementById('selectedImage');

        // scale image
        let scaleSlider = document.getElementById("scaleSlider");
        let scale = 1.0;
        let MINIMUM_SCALE = 1.0;
        let MAXIMUM_SCALE = 3.0;

        // opacite
        let opaciteRange = document.getElementById("opaciteRange");
        let scaleOpa = 1.0;

        // saturation
        let saturationRange = document.getElementById("saturationRange");
        let scaleSat = 1.0;

        // blur
        let blurRange = document.getElementById("blurRange");
        let scaleBlur = 1.0;

        //contrast
        let contrastRange = document.getElementById("contrastRange");
        let scaleContrast = 1.0;

        //hue
        let hueRange = document.getElementById("hueRange");
        let scaleHue = 1.0;

        //ombre
        let ombreRange = document.getElementById("ombreRange");
        let scaleOmbre = 1.0;

        // bouton photo, ajout de photo sur l'index
        let boutonPhoto = document.getElementById("boutonPhoto");
        let ctx = canvas.getContext('2d');

        // canvas width et height
        let width = canvas.width;
        let height = canvas.height;

        // Cadre sans image sélectionné
        ctx.fillStyle ="white";
        ctx.fillRect(0,0,width,height);

    // Fin déclaration de variable

    // ecoute sur le fichier image selectionnée
    selectedImage.addEventListener("change",function () {

        // verifie si fichier est une image
        function img_verification(file) {
            let imgtype = file.type.split("/")[1];
            return (["jpeg", "png"].indexOf(imgtype) >= 0);
        }

        // lecture d'image avec fileReader.
        function load_img_FileReader(file, image) {
            let reader = new FileReader();
            reader.addEventListener('load', function() {
                image.src = reader.result;
            });
            reader.readAsDataURL(file);
        }

        // recupération du fichier image
        let file = this.files[0];

        if(img_verification(file)){

            // une Image
            let image = new Image();
            load_img_FileReader(file,image);

            ///initialisation de l'image
            ctx.fillStyle = "cornflowerblue";
            ctx.shadowColor = "rgba(50,50,50,1.0)";
            ctx.shadowBlur = 10;

           // drawImage(image);
            image.addEventListener('load',function() {
                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.drawImage(this,0,0,width,height);
                for(let i = 0; i <3; i++){
                    imagesFiltres(this,i);
                }
            });

            // function scale image, vue sur un tutoriel
            function scaleImage(scale,image) {
                let w = canvas.width;
                let h = canvas.height;
                let sw = w * scale;
                let sh = h * scale;

                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.drawImage(image,-sw/2 + w/2, -sh/2 + h/2, sw,sh);
            }

            // function drawImage
            function drawImage(image){
                image.addEventListener('load',function() {
                    let sw = width * scale;
                    let sh = height* scale;
                    ctx.clearRect(0,0,width,height);
                    ctx.drawImage(image, -sw/2 + w/2, -sh/2 + h/2, sw, sh);
                });
            }

            // scale image
            scaleSlider.onchange = function(e) {
                scale = e.target.value;
                scaleImage(scale,image);
            };

            // changement de l'opacite
            opaciteRange.onchange = function(e) {
                scaleOpa = e.target.value;
                ctx.filter = 'opacity(' +scaleOpa +'%)';
                ctx.drawImage(image,0,0,width,height);
            };

            // changement saturation
            saturationRange.onchange = function(e) {
                scaleSat = e.target.value;
                ctx.filter ='saturate('+scaleSat+'%)';
                ctx.drawImage(image,0,0,width,height);
            };

            // changemenet blur
            blurRange.onchange = function(e) {
                scaleBlur = e.target.value;
                ctx.filter ='blur('+scaleBlur+'px)';
                ctx.drawImage(image,0,0,width,height);

            };

            //changement contrast
            contrastRange.onchange = function(e) {
                scaleContrast = e.target.value;
                ctx.filter='contrast('+scaleContrast+'%)';
                ctx.drawImage(image,0,0,width,height);
            };

            // changement hue
            hueRange.onchange = function(e) {
                scaleHue = e.target.value;
                ctx.filter='hue-rotate('+scaleHue+'deg)';
                ctx.drawImage(image,0,0,width,height);
            };

            //changement ombre
            ombreRange.onchange = function(e) {
                scaleOmbre = e.target.value;
                ctx.filter='drop-shadow(16px 16px 20px red) invert('+scaleOmbre+'%)';
                ctx.drawImage(image,0,0,width,height);
            };

            // le bouton black and white
            let button = document.getElementById("blackwhite");
            button.addEventListener("click",function () {
                imgBlacWhite();
            });

            // bouton couleur
            let boutonCouleur = document.getElementById("filterColor");
            boutonCouleur.addEventListener("click",function() {
                imgCouleur(image);
            });

            // bouton negative color
            let boutonNegativeColor = document.getElementById("negativeColor");
            boutonNegativeColor.addEventListener("click",function() {
                negativeFilter();
            });
        }
    });

    // filtre b&w
    function imgBlacWhite(context = null,canv = null) {
        if (context != null && canv != null) {
            let data = undefined,
                i = 0;
            let imageData = context.getImageData(0,0,canv.width, canv.height);
            data = imageData.data;
            for(i= 0; i < data.length -4; i+=4){
                let average = (data[i] + data[i+1]+ data[i+2])/3;
                data[i] = average;
                data[i+1] = average;
                data[i+2] = average;
            }
            context.putImageData(imageData,0,0);
        }
        else {
            let data = undefined,
                i = 0;
            let imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
            data = imageData.data;
            for(i = 0; i < data.length -4; i+=4){
                let average = (data[i] + data[i+1]+ data[i+2])/3;
                data[i] = average;
                data[i+1] = average;
                data[i+2] = average;
            }
            ctx.putImageData(imageData,0,0);
        }
    }

    // filtre couleur, bouton original, reset
    function imgCouleur(image,context, canv) {
        if(context != null && canv != null){
            context.drawImage(image,0,0,image.width,image.height,0,0,
            context.canv.width,context.canv.height);
        }
        else {
            ctx.drawImage(image,0,0,image.width,image.height,0,0,
            ctx.canvas.width,ctx.canvas.height);
        }
    }

    // filtre negative
    function negativeFilter(context = null,canv = null) {
        if (context != null && canv != null) {
            let imageData = context.getImageData(0,0,canv.width, canv.height),
                data = imageData.data;
            for(let i = 0; i <= data.length - 4; i+=4) {
                data[i] = 255 - data[i];
                data[i+1] = 255 - data[i+1];
                data[i+2] = 255 - data[i+2];
            }
            context.putImageData(imageData,0,0);
        }
        else {
            let imageData = ctx.getImageData(0,0,canvas.width, canvas.height),
                data = imageData.data;
            for(let i=0; i <= data.length - 4; i+=4){
                data[i] = 255 - data[i];
                data[i+1] = 255 - data[i+1];
                data[i+2] = 255 - data[i+2];
        }
        ctx.putImageData(imageData,0,0);
        }
    }
});
