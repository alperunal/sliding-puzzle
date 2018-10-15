(function (imagePath: string, rows: number, cols: number) {

    interface IPoint {
        row: number;
        col: number;
    }

    interface ITile {
        position: IPoint;
        empty: boolean;
    }

    function shuffle(a: any[]): void {
        for (let i = a.length - 1; i > 0; i--) {
            for(let j=a[i].length-1; j>0; j--) {
                const randRow = Math.floor(Math.random() * (i + 1));
                const randCol = Math.floor(Math.random() * (j + 1));

                let temp = a[i][j];
                a[i][j] = a[randRow][randCol];
                a[randRow][randCol] = temp;
            }
        }
    }

    class SlidingPuzzle {
        board: any[] = [];
        private rows: number;
        private cols: number;
        private readonly DIRECTIONS = [
            { x: 0, y: -1 }, // Down
            { x: 0, y: 1 }, // Up
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 } // Right
        ];
        image = new Image();

        constructor(path: string, rows: number, cols: number) {
            this.rows = rows;
            this.cols = cols;
            this.image.src = path;
            this.initializeBoard();
        }

        initializeBoard(): void {
            for(let i=0; i<this.rows; i++) {
                this.board[i] = [];
                for(let j=0; j<this.cols; j++) {
                    this.board[i][j] = {
                        position: {
                            row:i,
                            col:j
                        },
                        empty: false
                    }
                }
            }
            this.board[this.rows-1][this.cols-1].empty = true;
            shuffle(this.board);
            this.createBoard();
        }

        createBoard(): void {
            const table = document.getElementById('slidingPuzzle');
            for(let i=0; i<this.rows; i++) {
                const tr = document.createElement('tr');
                for(let j=0; j<this.cols; j++) {
                    const td = document.createElement('td');
                    td.setAttribute('id', `puzzle${(this.rows * (i)) + (j+1)}`);
                    td.addEventListener('click', this.move.bind(this, i, j));
                    tr.appendChild(td);
                }
                if(table) {
                    table.appendChild(tr);
                }
            }
            this.draw();
        }

        draw(): void {
            const width = this.image.width / this.cols,
                height = this.image.height / this.rows;

            for(let i=0; i<this.board.length; i++) {
                for(let j=0; j<this.board[i].length; j++) {
                    const td = document.getElementById(`puzzle${(this.rows * (i)) + (j+1)}`);
                    if(td) {
                        td.setAttribute('style', `width: ${width}px; height: ${height}px; background: ${this.board[i][j].empty ? 'none' : "url('" + imagePath + "') no-repeat -" + (this.board[i][j].position.col * width) + 'px -' + (this.board[i][j].position.row * height) + 'px'}`);
                    }
                }
            }
        }

        move(row: number, col: number): void {
            function change(this: SlidingPuzzle, x: number, y: number, row: number, col: number): void {
                let temp = this.board[row][col];
                this.board[row][col] = this.board[row + y][col + x];
                this.board[row + y][col + x] = temp;
            }

            this.DIRECTIONS.forEach(direction => {
                if(this.board[row + direction.y] && this.board[row + direction.y][col + direction.x] && this.board[row + direction.y][col + direction.x].empty) {
                    change.call(this, direction.x, direction.y, row, col);
                }
            });

            if(this.isCompleted()) {
                const wrapper = document.getElementById('slidingPuzzleWrapper');
                const puzzle = document.getElementById('slidingPuzzle');
                const img = document.createElement('img');
                img.setAttribute('src', imagePath);
                if(wrapper && puzzle){
                    wrapper.removeChild(puzzle);
                    wrapper.appendChild(img);
                }
            } else {
                this.draw();
            }
        }
        
        isCompleted(): boolean {
            let completed = true;
            for(let row=0; row<this.rows; row ++) {
                for(let col=0; col<this.cols; col++) {
                    if(this.board[row][col].position.row !== row || this.board[row][col].position.col !== col) {
                        completed = false;
                    }
                }
            }
            return completed;
        }
    }

    return new SlidingPuzzle(imagePath, rows, cols);

})('./assets/monks.jpg', 3, 3);