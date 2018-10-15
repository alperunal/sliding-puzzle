(function (imagePath, rows, cols) {
    'use strict';
    function shuffle(a) {
        for (var i = a.length - 1; i > 0; i--) {
            for (var j = a[i].length - 1; j > 0; j--) {
                var randRow = Math.floor(Math.random() * (i + 1));
                var randCol = Math.floor(Math.random() * (j + 1));
                var temp = a[i][j];
                a[i][j] = a[randRow][randCol];
                a[randRow][randCol] = temp;
            }
        }
    }
    var SlidingPuzzle = /** @class */ (function () {
        function SlidingPuzzle(path, rows, cols) {
            this.board = [];
            this.DIRECTIONS = [
                { x: 0, y: -1 },
                { x: 0, y: 1 },
                { x: -1, y: 0 },
                { x: 1, y: 0 } // Right
            ];
            this.image = new Image();
            this.rows = rows;
            this.cols = cols;
            this.image.src = path;
            this.initializeBoard();
        }
        SlidingPuzzle.prototype.initializeBoard = function () {
            for (var i = 0; i < this.rows; i++) {
                this.board[i] = [];
                for (var j = 0; j < this.cols; j++) {
                    this.board[i][j] = {
                        position: {
                            row: i,
                            col: j
                        },
                        empty: false
                    };
                }
            }
            this.board[this.rows - 1][this.cols - 1].empty = true;
            shuffle(this.board);
            this.createBoard();
        };
        SlidingPuzzle.prototype.createBoard = function () {
            var table = document.getElementById('slidingPuzzle');
            for (var i = 0; i < this.rows; i++) {
                var tr = document.createElement('tr');
                for (var j = 0; j < this.cols; j++) {
                    var td = document.createElement('td');
                    td.setAttribute('id', "puzzle" + ((this.rows * (i)) + (j + 1)));
                    td.addEventListener('click', this.move.bind(this, i, j));
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            this.draw();
        };
        SlidingPuzzle.prototype.draw = function () {
            var width = this.image.width / this.cols, height = this.image.height / this.rows;
            for (var i = 0; i < this.board.length; i++) {
                for (var j = 0; j < this.board[i].length; j++) {
                    var td = document.getElementById("puzzle" + ((this.rows * (i)) + (j + 1)));
                    td.setAttribute('style', "width: " + width + "px; height: " + height + "px; background: " + (this.board[i][j].empty ? 'none' : "url('" + imagePath + "') no-repeat -" + (this.board[i][j].position.col * width) + 'px -' + (this.board[i][j].position.row * height) + 'px'));
                }
            }
        };
        SlidingPuzzle.prototype.move = function (row, col) {
            var _this = this;
            function change(x, y, row, col) {
                var temp = this.board[row][col];
                this.board[row][col] = this.board[row + y][col + x];
                this.board[row + y][col + x] = temp;
            }
            this.DIRECTIONS.forEach(function (direction) {
                if (_this.board[row + direction.y] && _this.board[row + direction.y][col + direction.x] && _this.board[row + direction.y][col + direction.x].empty) {
                    change.call(_this, direction.x, direction.y, row, col);
                }
            });
            if (this.isCompleted()) {
                var wrapper = document.getElementById('slidingPuzzleWrapper');
                var img = document.createElement('img');
                img.setAttribute('src', imagePath);
                wrapper.removeChild(document.getElementById('slidingPuzzle'));
                wrapper.appendChild(img);
            }
            else {
                this.draw();
            }
        };
        SlidingPuzzle.prototype.isCompleted = function () {
            var completed = true;
            for (var row = 0; row < this.rows; row++) {
                for (var col = 0; col < this.cols; col++) {
                    if (this.board[row][col].position.row !== row || this.board[row][col].position.col !== col) {
                        completed = false;
                    }
                }
            }
            return completed;
        };
        return SlidingPuzzle;
    }());
    return new SlidingPuzzle(imagePath, rows, cols);
})('./assets/monks.jpg', 3, 3);
