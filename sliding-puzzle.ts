class SlidingPuzzle{
    private imageObj:Object;
    private board:Array<any>;
    readonly BOARD_SIZE:number = 4;
    private image:any;
    private imagePieces: any;

    constructor() {
        this.board = [];
        this.imagePieces = [];

    }

    createBoard() {

        this.image = new Image();
        this.image.onload = () => {
            for(let i=0; i<4; i++) {
                for(let j=0; j<4; j++) {

                    let canvas = document.createElement('canvas');
                    canvas.width = 128;
                    canvas.height = 128;
                    let context = canvas.getContext('2d');
                    context.drawImage(this.image, j * 128, i * 128, 128, 128, 0, 0, canvas.width, canvas.height);

                    this.imagePieces.push({
                        image: canvas.toDataURL(),
                        originalPosition: {
                            x: j,
                            y: i
                        }
                    });

                }
            }
            this.drawBoard();
        };
        this.image.src = "assets/monks.jpg";

    }

    shuffle(a) {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
    }

    drawBoard() {

        let game = document.createElement("div");
        game.setAttribute("class", "wrapper");
        this.shuffle(this.imagePieces);
        for(let i=0; i<this.imagePieces.length; i++) {
            if(typeof this.imagePieces[i] != "undefined") {
                let img = document.createElement("img");
                if(this.imagePieces[i].originalPosition.x == 3 && this.imagePieces[i].originalPosition.y == 3) {
                    img.id = "emptyImage";
                } else {
                    img.src = this.imagePieces[i].image;
                }
                img.width = 128;
                img.height = 128;
                img.setAttribute("position", i.toString());
                img.setAttribute("currentX", (i%4)+"");
                img.setAttribute("currentY", Math.floor(i/4).toString());
                img.setAttribute("originalX", this.imagePieces[i].originalPosition.x);
                img.setAttribute("originalY", this.imagePieces[i].originalPosition.y);
                img.setAttribute("originalPosition", (4*this.imagePieces[i].originalPosition.y+this.imagePieces[i].originalPosition.x).toString());
                img.setAttribute("onClick","SlidingPuzzle.clickHandler(this)");
                let imgContainer = document.createElement("div");
                imgContainer.setAttribute("id","imgContainer" + i);
                imgContainer.setAttribute("class", "imageBox");
                imgContainer.appendChild(img);
                game.appendChild(imgContainer);
            }
        }
        document.body.appendChild(game);
    }

    static move(selected, empty) {

        let selectedOuterDiv = document.getElementById("imgContainer" + selected.getAttribute("position"));
        let emptyOuterDiv = document.getElementById("imgContainer" + empty.getAttribute("position"));


        let temp = {
            position: selected.getAttribute("position"),
            x: selected.getAttribute("currentX"),
            y: selected.getAttribute("currentY")
        };

        selected.setAttribute("position", empty.getAttribute("position"));
        selected.setAttribute("currentX", empty.getAttribute("currentX"));
        selected.setAttribute("currentY", empty.getAttribute("currentY"));

        empty.setAttribute("position", temp.position);
        empty.setAttribute("currentX", temp.x);
        empty.setAttribute("currentY", temp.y);


        selectedOuterDiv.innerHTML = "";
        selectedOuterDiv.appendChild(empty);
        emptyOuterDiv.innerHTML = "";
        emptyOuterDiv.appendChild(selected);

        SlidingPuzzle.isCompleted();

    }

    static clickHandler(selected) {

        let emptyImage = document.getElementById("emptyImage");

        let target = {
            x: parseInt(selected.getAttribute("currentX")),
            y: parseInt(selected.getAttribute("currentY"))
        };

        let empty = {
            x: parseInt(emptyImage.getAttribute("currentX")),
            y: parseInt(emptyImage.getAttribute("currentY"))
        };

        if(target.x-1 == empty.x && target.y == empty.y ||
            target.x+1 == empty.x && target.y == empty.y ||
            target.x == empty.x && target.y-1 == empty.y ||
            target.x == empty.x && target.y+1 == empty.y) {

            SlidingPuzzle.move(selected, emptyImage);
        }
    }


    static isCompleted() {

        let images = document.getElementsByTagName("img");

        for(let i=0; i<images.length; i++) {
            console.log(images[i]);
            if(images[i].getAttribute("position") != images[i].getAttribute("originalPosition")){
                return;
            }
        }

        let originalImage = document.createElement("img");
        originalImage.src = "assets/monks.jpg";
        document.body.innerHTML = "";
        document.body.appendChild(originalImage);

        alert("Congratulations!");
    }
}

