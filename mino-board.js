/*
Copyright 2021, 'wirelyre'
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/



class MinoBoard extends HTMLElement {

    static colors = {
        // 'background': '#F3F3ED',
        'background': 'rgba(0,0,0,0.1)',
        'shadow': 'rgba(0,0,0,0.2)',
        'regular': {
            'G': '#686868',
            'X': '#686868',
            'I': '#41AFDE',
            'J': '#1883BF',
            'L': '#EF9536',
            'O': '#F7D33E',
            'S': '#66C65C',
            'T': '#B451AC',
            'Z': '#EF624D',
        },
        'top': {
            'G': '#949494',
            'X': '#949494',
            'I': '#43D3FF',
            'J': '#1BA6F9',
            'L': '#FFBF60',
            'O': '#FFF952',
            'S': '#88EE86',
            'T': '#E56ADD',
            'Z': '#FF9484',
        },
    };

    static boardRegex = /^[\sGXIJLOSTZ_]*$/;
    static minoRegex = /[GXIJLOSTZ_]/g;
    static whitespace = /^\s*$/;

    constructor(field) {
        super();

        if (field) {
            this.setup(field);
        } else {
            document.addEventListener('DOMContentLoaded',
                (_event) => this.setup(this.textContent));
        }
    }

    setup(field) {
        const { decoder } = require('tetris-fumen');
        this.innerHTML = '';

        // 13pake: fumen stuff
        const fumen = this.getAttribute('fumen');
        if (fumen) {
            const pages = decoder.decode(fumen);
            let newField = pages[0].field.str({ garbage: 0 });
            // console.log(newField)

            const tenUnderscores = '_'.repeat(10);
            if (newField.replaceAll('\n', '').length == 10) {
                newField = (tenUnderscores + '\n').repeat(4) + newField;
            } else if (newField.replaceAll('\n', '').length == 20) {
                newField = (tenUnderscores + '\n').repeat(3) + newField;
            } else if (newField.replaceAll('\n', '').length == 30) {
                newField = (tenUnderscores + '\n').repeat(2) + newField;
            } else if (newField.replaceAll('\n', '').length == 40) {
                newField = (tenUnderscores + '\n').repeat(1) + newField;
            } 
            // set field
            field = newField;
        }

        if (!MinoBoard.boardRegex.test(field)) {
            const unknown = field.match(/[^\sGXIJLOSTZ_]/)[0];
            this.innerText = 'Cannot draw field. Unknown character: ' + unknown;
            return;
        }

        this.field = field.trim().split('\n');
        this.field.width = Math.max(...this.field.map(s => s.length));
        for (let row = 0; row < this.field.length; row++) {
            if (this.field[row].length !== this.field.width) {
                this.field[row] = this.field[row].padEnd(this.field.width, '_');
            }
        }

        this.setAttribute('data-field', this.field.join('|'));

        const verticalPadding = 1;
        const width = 20 * this.field.width;
        const height = 20 * (this.field.length + verticalPadding);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        this.appendChild(svg);

        const getMino = (field, row, col) => field[row]?.[col];

        function* minos(field) {
            for (let row = 0; row < field.length; row++) {
                for (let col = 0; col < field.width; col++) {
                    const mino = getMino(field, row, col);

                    if (mino != '_') {
                        yield [row, col, mino];
                    }
                }
            }
        }

        function* minoRuns(field) {
            for (let row = 0; row < field.length; row++) {
                let col = 0;
                while (col < field.width) {
                    let mino = getMino(field, row, col);
                    if (mino === '_') {col++; continue;}
                    for (let i = col+1; i <= field.width; i++) {
                        if (getMino(field, row, i) === mino) {continue;}
                        yield [row, col, mino, i-col];
                        col = i;
                        break;
                    }
                }
            }
        }

        function rect(x, y, width, height, fill) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x);
            rect.setAttribute('y', y);
            rect.setAttribute('width', width);
            rect.setAttribute('height', height);
            rect.setAttribute('fill', fill);
            return rect;
        }

        svg.appendChild(rect(0, 0, '100%', '100%', MinoBoard.colors['background']));

        const fieldShadow = this.field.map((s, row) => {
            let l = '';
            for (let col = 0; col < this.field.width; col++) {
                if (getMino(this.field, row, col) !== '_' && (
                    getMino(this.field, row, col+1) === '_' ||
                    getMino(this.field, row+1, col) === '_' ||
                    getMino(this.field, row+1, col+1) === '_')) {
                    l += 'X';
                } else {
                    l += '_';
                }
            }
            return l;
        });
        fieldShadow.width = this.field.width;

        for (const [row, col, mino, run] of minoRuns(fieldShadow)) {
            svg.appendChild(rect(20 * col + 5, 20 * (row + verticalPadding) + 7, 20 * run, 20,
                MinoBoard.colors['shadow']));
        }

        const fieldTop = this.field.map((s, row) => {
            let l = '';
            for (let col = 0; col < this.field.width; col++) {
                if (getMino(this.field, row, col) !== '_' &&
                    (row === 0 || getMino(this.field, row-1, col) === '_')) {
                    l += getMino(this.field, row, col);
                } else {
                    l += '_';
                }
            }
            return l;
        });
        fieldTop.width = this.field.width;

        for (const [row, col, mino, run] of minoRuns(fieldTop)) {
            svg.appendChild(rect(20 * col, 20 * (row + verticalPadding) - 4, 20 * run, 4 + 2,
            MinoBoard.colors['top'][mino]));
        }

        const fieldMain = this.field.map((s, row) => {
            let l = [];
            for (let col = 0; col < this.field.width; col++) {
                let mino = getMino(this.field, row, col);
                if (mino !== '_') {
                    let extend = 'X';
                    if (row === field.length-1 || getMino(this.field, row+1, col) === '_') {
                        extend = '_';
                    }
                    l.push(mino + extend);
                } else {
                    l.push('_');
                }
            }
            return l;
        });
        fieldMain.width = this.field.width;

        for (const [row, col, [mino, extend], run] of minoRuns(fieldMain)) {
            const color = MinoBoard.colors['regular'][mino];
            const extendRight = (col+run !== this.field.width && getMino(this.field, row, col+run) !== '_');

            if (extend === '_') {
                svg.appendChild(rect(20 * col, 20 * (row + verticalPadding),
                    20 * run + (extendRight ? 2 : 0), 20, color));
            } else {
                if (!extendRight || getMino(this.field, row+1, col+run) !== '_') {
                    svg.appendChild(rect(20 * col, 20 * (row + verticalPadding),
                        20 * run + (extendRight ? 2 : 0), 20 + 2, color));
                } else {
                    svg.appendChild(rect(20 * col, 20 * (row + verticalPadding),
                        20 * run, 20 + 2, color));
                    svg.appendChild(rect(20 * (col + run) - 2, 20 * (row + verticalPadding),
                        4, 20, color));
                }
            }
        }

        this.addEventListener("keydown", function (e) {
            if (e.key.toLowerCase == "m") this.mirror();
        });
    }

    // Everything from this point onwards is by Flyspeck101 and is a testament to his lack of coding skills. 
    
    regenerate() {
    this.innerHTML = "";
        this.field = this.getAttribute("data-field").split("|");
        this.field.width = Math.max(...this.field.map(s => s.length));
        for (let row = 0; row < this.field.length; row++) {
            if (this.field[row].length !== this.field.width) {
                this.field[row] = this.field[row].padEnd(this.field.width, '_');
            }
        }

        this.setAttribute('data-field', this.field.join('|'));

        const verticalPadding = 1;
        const width = 20 * this.field.width;
        const height = 20 * (this.field.length + verticalPadding);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        this.appendChild(svg);

        const getMino = (field, row, col) => field[row]?.[col];

        function* minos(field) {
            for (let row = 0; row < field.length; row++) {
                for (let col = 0; col < field.width; col++) {
                    const mino = getMino(field, row, col);

                    if (mino != '_') {
                        yield [row, col, mino];
                    }
                }
            }
        }

        function* minoRuns(field) {
            for (let row = 0; row < field.length; row++) {
                let col = 0;
                while (col < field.width) {
                    let mino = getMino(field, row, col);
                    if (mino === '_') {col++; continue;}
                    for (let i = col+1; i <= field.width; i++) {
                        if (getMino(field, row, i) === mino) {continue;}
                        yield [row, col, mino, i-col];
                        col = i;
                        break;
                    }
                }
            }
        }

        function rect(x, y, width, height, fill) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x);
            rect.setAttribute('y', y);
            rect.setAttribute('width', width);
            rect.setAttribute('height', height);
            rect.setAttribute('fill', fill);
            return rect;
        }

        svg.appendChild(rect(0, 0, '100%', '100%', MinoBoard.colors['background']));

        const fieldShadow = this.field.map((s, row) => {
            let l = '';
            for (let col = 0; col < this.field.width; col++) {
                if (getMino(this.field, row, col) !== '_' && (
                    getMino(this.field, row, col+1) === '_' ||
                    getMino(this.field, row+1, col) === '_' ||
                    getMino(this.field, row+1, col+1) === '_')) {
                    l += 'X';
                } else {
                    l += '_';
                }
            }
            return l;
        });
        fieldShadow.width = this.field.width;

        for (const [row, col, mino, run] of minoRuns(fieldShadow)) {
            svg.appendChild(rect(20 * col + 5, 20 * (row + verticalPadding) + 7, 20 * run, 20,
                MinoBoard.colors['shadow']));
        }

        const fieldTop = this.field.map((s, row) => {
            let l = '';
            for (let col = 0; col < this.field.width; col++) {
                if (getMino(this.field, row, col) !== '_' &&
                    (row === 0 || getMino(this.field, row-1, col) === '_')) {
                    l += getMino(this.field, row, col);
                } else {
                    l += '_';
                }
            }
            return l;
        });
        fieldTop.width = this.field.width;

        for (const [row, col, mino, run] of minoRuns(fieldTop)) {
            svg.appendChild(rect(20 * col, 20 * (row + verticalPadding) - 4, 20 * run, 4 + 2,
            MinoBoard.colors['top'][mino]));
        }

        const fieldMain = this.field.map((s, row) => {
            let l = [];
            for (let col = 0; col < this.field.width; col++) {
                let mino = getMino(this.field, row, col);
                if (mino !== '_') {
                    let extend = 'X';
                    l.push(mino + extend);
                } else {
                    l.push('_');
                }
            }
            return l;
        });
        fieldMain.width = this.field.width;

        for (const [row, col, [mino, extend], run] of minoRuns(fieldMain)) {
            const color = MinoBoard.colors['regular'][mino];
            const extendRight = (col+run !== this.field.width && getMino(this.field, row, col+run) !== '_');

            if (extend === '_') {
                svg.appendChild(rect(20 * col, 20 * (row + verticalPadding),
                    20 * run + (extendRight ? 2 : 0), 20, color));
            } else {
                if (!extendRight || getMino(this.field, row+1, col+run) !== '_') {
                    svg.appendChild(rect(20 * col, 20 * (row + verticalPadding),
                        20 * run + (extendRight ? 2 : 0), 20 + 2, color));
                } else {
                    svg.appendChild(rect(20 * col, 20 * (row + verticalPadding),
                        20 * run, 20 + 2, color));
                    svg.appendChild(rect(20 * (col + run) - 2, 20 * (row + verticalPadding),
                        4, 20, color));
                }
            }
        }
    }

    mirror() {
        this.setAttribute("data-field", this.getAttribute("data-field")
                          .split("")
                          .map(c => { return {"_":"_", "|":"|", "X":"X", "I":"I", "O":"O", "T":"T", "S":"Z", "Z":"S", "J":"L", "L":"J"}[c] })
                          .join("")
                          .split("|")
                          .map(a => a.split("").reverse().join(""))
                          .join("|"));
        this.regenerate();
        this.toggleAttribute("mirrored");
    }

    isMirrored() {
        return this.hasAttribute("mirrored");
    }

}

customElements.define('mino-board', MinoBoard);
