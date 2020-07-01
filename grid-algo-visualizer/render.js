(function (window) {
    var canvas = document.getElementById("board");
    var ctx = canvas.getContext("2d");
    canvas.width = 256 * 5;
    canvas.height = 256 * 5;

    var Board = function (row, col, size, time) {
        this.col = col;
        this.row = row;
        this.size = size;
        this.step = 0;
        canvas.width = col * size;
        canvas.height = row * size;
        this.time = time;

        this.random = function random() {

            const r = Math.floor(Math.random() * 30);
            const g = Math.floor(Math.random() * 30);
            const b = Math.floor(Math.random() * 255);
            this.rgba = "rgba("+r+","+g+","+b+""; //rgba(135,26,31,0.4286748831988356)

            this.board = new Array(row * col);
            for (var j = 0; j < this.board.length; j++) {
                this.board[j] =  (parseFloat(Math.random()+.1).toFixed(3));
                
            }
            
            this.render();
        }

        function sleep(time) {
            
            return new Promise(resolve => setTimeout(resolve, time));
        }

        this.start = async function start() {
            for (var i = 0; i < this.board.length; i++) {
                for (var j = 0; j < this.board.length - i - 1; j++) {
                    if (this.board[j + 1] < this.board[j]) {
                        const tmp = parseFloat(this.board[j + 1]);
                        this.board[j + 1] = parseFloat(this.board[j]);
                        this.board[j] = tmp;
                    }
                   
                }
                await this.drawAndWait();
            }
        };

        this.merge =  async function (l, r) {
            const a = new Array(l.length + r.length);
      
            let k = 0
            let i = 0
            let j = 0
            while (i < l.length && j < r.length) {
                if (l[i] < r[j]) {
                    a[k] = l[i]
                    i = i + 1
                } else {
                    a[k] = r[j]
                    j = j + 1
                }
                k = k + 1
            }

            while (i < l.length) {
                a[k] = l[i]
                i = i + 1
                k = k + 1
            }

            while (j < r.length) {
                a[k] = r[j]
                j = j + 1
                k = k + 1
            }
            
    
            return a
        }
        
        this._mergeSort = async function (array, n) {
        
            const ln = array.length
            if (ln < 2) {
                return array
            }
            let mid = Math.ceil(ln / 2)
            
            let l = array.slice(0, mid)
            let r = array.slice(mid , ln)
            
            l = await this._mergeSort(l, n)
            r = await this._mergeSort(r,n+mid)
            a = await this.merge(l, r)
            
            for(let m = 0; m < a.length; m++){
               this.board[n] = a[m]
               n++
            }
            await this.drawAndWait();
            return a;
        }
        this.mergeSort = async function () {
            await this._mergeSort(this.board, 0, 0);
        }

        this.insertionSort = async function (){
            const arr = this.board
            const ln = arr.length

            for ( let i = 1; i < ln; i++){ // start from 1 to sort before the index
                let v = arr[i] // current value
                let j = i - 1 // before sorted items
                while (j >=0 && v < arr[j]){ // test value less then previous item
                   // await this.drawAndWait();
                    arr[j+1] = arr[j] // override with values with pervious
                    j = j - 1 // j to previous index    
                }
                arr[j+1] = v // assign to last j + 1
                await this.drawAndWait();
            }

        }

        this.render = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const board = this.board;

            for (let i = 0; i < board.length; i += 1) {
                const x = this.size * (i % this.col);
                const y = this.size * Math.floor(i / this.row);
                ctx.beginPath();
                ctx.rect(x, y, this.size, this.size);
                ctx.fillStyle = this.rgba + ", " +(board[i])+")";
                ctx.fill();
                ctx.font = "6px";
                // ctx.fillStyle = "rgba(255,255,255,1)";
                // ctx.fillText((parseFloat(board[i]) * 100).toFixed(0).toString(), x  , y + (size / 2));
            }
        }

        this.quickSort = async function(){
            
            await this._quickSort(this.board, 0, this.board.length-1);
        }

        // const getPivot = function(a, l,h){
        //     let m = Math.floor(l+h/2)
        //     let p = h
        //     if(a[l] < a[m]){
        //         if(a[m]< a[h]){
        //             p = m
        //         }
        //     }
        //     else if (a[l] < a[h]){
        //         p = l
        //     }
        //     return p
        // }

        function swap(arr, l, r){
            let tmp = arr[l]
            arr[l] =  arr[r]
            arr[r] = tmp;
        }
        this._partition = async function _partion(arr, low, high){
            let pv = arr[high]
            let border = low
            
            for(let i = low; i < high;i++){
                if(arr[i]< pv){
                    swap(arr, border, i)
                    border = border +1
                 
                }
          
            }
            
            swap(arr, border, high)            
            return border
        }
        
        this._quickSort = async function _quickSort(arr, low, high){
            // debugger
            if (low < high){
                let p = await this._partition(arr, low, high);
                await this.drawAndWait();
                await this._quickSort(arr, low, p - 1);
                await this._quickSort(arr,  p + 1, high);
            }
        }

        this.drawAndWait = async function drawAndWait() {
            this.render()
            await sleep(this.time);
        };
    };
    window.VisualBoard = Board;
})(window);
