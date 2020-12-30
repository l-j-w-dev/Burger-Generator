const $draw = document.querySelector('.origin');
const $grid = $draw.querySelector('#grid');
const $dots = $draw.querySelector('#dots');

const $copy = document.querySelector('.clone');
const $copyGrid = $copy.querySelector('#grid');
const $copyDots = $copy.querySelector('#dots');

const $result = document.querySelector('.result');

const $thick = document.querySelector('#thick');
const $radius = document.querySelector('#radius');
const $size = document.querySelector('#size');

$thick.addEventListener('input', e => {
    const $lines = $draw.querySelectorAll('.line')
    const $linescopy = $copy.querySelectorAll('.line')
    for (let i = 0; i < $lines.length; i++) {
        $lines[i].style.height = $thick.value + 'px';
        $linescopy[i].style.height = $thick.value + 'px';
    }
})

$radius.addEventListener('input', e => {
    const $lines = $draw.querySelectorAll('.line')
    const $linescopy = $copy.querySelectorAll('.line')

    for (let i = 0; i < $lines.length; i++) {
        $lines[i].style.borderRadius = $radius.value + 'px';
        $linescopy[i].style.borderRadius = $radius.value + 'px';
    }
})
$size.addEventListener('input', e => {
    $result.style.width = $size.value + 'px';
    $result.style.height = $size.value + 'px';
})


$draw.addEventListener('input', e => {
    $copy.innerHTML = $draw.innerHTML;
})

const calcDist = (x, y, tx, ty) => {
    return Math.sqrt((tx - x) ** 2 + (ty - y) ** 2)
}

let target = null;
const createDot = (x, y, x2, y2) => {
    const dotwrap = document.createElement('div');
    dotwrap.className = 'dotwrap';

    const dot1 = document.createElement('div');
    dot1.className = 'dot selected';
    dot1.style.left = x + 'px';
    dot1.style.top = y + 'px';
    dot1.addEventListener('mousedown', e => {
        target = e.target;
    })

    const dot2 = document.createElement('div');
    dot2.className = 'dot normal';
    dot2.style.left = x2 + 'px';
    dot2.style.top = y2 + 'px';
    dot2.addEventListener('mousedown', e => {
        target = e.target;
    })

    const line = document.createElement('div');
    line.className = 'line';
    line.style.left = x + 'px';
    line.style.top = y + 'px';
    line.style.width = calcDist(x, y, x2, y2) + 'px';
    line.style.height = 20 +'px';
    line.style.borderRadius = '5px';
    line.style.transform = 'translateY(-50%)';


    dotwrap.appendChild(dot1);
    dotwrap.appendChild(dot2);
    dotwrap.appendChild(line);

    $dots.appendChild(dotwrap);
    $copy.innerHTML = $draw.innerHTML;
    for (let i = 0; i < $copy.querySelectorAll('.dot').length; i++) {
        $copy.querySelectorAll('.dot')[i].addEventListener('mousedown', e => {
            target = e.target;
        })
    }
}

window.addEventListener('mouseup', e => {
    if (target != null) {
        target = null;
    }
})

window.addEventListener('mousemove', e => {
    if (target != null) {

        let cells
        let isClone = false;
        if (target.parentNode.parentNode.parentNode == $draw) {
            cells = document.querySelectorAll('.origin .cell');
        }else{
            isClone = true;
            cells = document.querySelectorAll('.clone .cell');
        }
        for (let i = 0; i < cells.length; i++) {
            const rect = cells[i].getBoundingClientRect();
            if (calcDist(e.clientX, e.clientY, rect.x, rect.y) < 10) {
                target.style.left = cells[i].offsetLeft + "px";
                target.style.top = cells[i].offsetTop + "px";
                let target2 = target.parentNode.children[1];
                if (target.parentNode.children[1] == target) {
                    target2 = target.parentNode.children[0];
                    
                }
                target2.classList.remove('selected')
                target2.classList.add('normal')
                target.classList.remove('normal')
                target.classList.add('selected')
                const line = target.parentNode.children[2];
                const rotate = Math.atan2(target2.style.top.split('px')[0] - target.style.top.split('px')[0], target2.style.left.split('px')[0] - target.style.left.split('px')[0]);
                let deg = rotate * 180 / Math.PI;
                
                line.style.left = Number(target.style.left.split('px')[0]) + 'px';
                if(Math.abs(deg) > 90){
                    line.style.transform = 'translateX(1px) translateY(-50%) rotate(' + deg + 'deg)';
                    line.style.left = Number(target.style.left.split('px')[0]) + -1 + 'px';
                }else{
                    line.style.transform = 'translateY(-50%) rotate(' + deg + 'deg)';
                }
                line.style.top = target.style.top.split('px')[0] + 'px';
                line.style.width = calcDist(target.style.left.split('px')[0], target.style.top.split('px')[0], target2.style.left.split('px')[0], target2.style.top.split('px')[0]) +'px';
                break;
            }
        }
    }
})



const createGrid = _ => {
    const width = $grid.clientWidth / 16;
    const height = $grid.clientHeight / 16;
    for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (y == 0) cell.classList.add('top');
            if (x == 0) cell.classList.add('left');
            $grid.appendChild(cell);
            if (x == 15) {
                const empty = document.createElement('div')
                empty.className = 'cell empty';
                $grid.appendChild(empty);
            };
        }
    }
    for (let i = 0; i < 16; i++) {
        const empty = document.createElement('div')
        empty.className = 'cell empty_bottom';
        $grid.appendChild(empty);
    }
    const empty = document.createElement('div')
    empty.className = 'cell empty';
    $grid.appendChild(empty);
}

function create(size){
    size = $size.value;
    $result.innerHTML = $draw.innerHTML;
    if(document.head.querySelector('style') != null)
    document.head.querySelector('style').remove();
    $result.querySelector('#grid').remove();
    for(let item of $result.querySelectorAll('.cell')){
        item.remove();
    }
    let isRight = false;
    let i = 0;
    for(let item of $result.querySelectorAll('.dot')){
        item.remove();
    }
    console.log(isRight)

    for(let item of $result.querySelectorAll('.line')){
        $result.appendChild(item);
    }
    let str = `.result {
    width:${size}px !important;
    height:${size}px !important;
}
.result .line{
    transition: 0.5s;
    left:0;
    top:0;
    pointer-events: none;
    background-color:gray;
    transform-origin:left 50%;
}
`
    $result.querySelector('#dots').remove();
    for(let i = 0; i < $result.querySelectorAll('.line').length; i++){
        const l = $result.querySelectorAll('.line')[i].style;
        const o = $draw.querySelectorAll('.line')[i].style;
        str += `
.result .line:nth-child(${i + 1}){
    position : absolute;
    left : ${(Number(o.left.split('px')[0]) * size/360).toFixed(0)}px !important;
    top : ${(Number(o.top.split('px')[0]) * size/360).toFixed(0)}px !important;
    width : ${(Number(o.width.split('px')[0]) * size/360).toFixed(1)}px !important;
    height : ${(Number(o.height.split('px')[0]) * size/360).toFixed(0)}px !important;
    border-radius : ${(Number(o.borderRadius.split('px')[0]) * size/360).toFixed(0)}px !important;
    transform : ${o.transform = o.transform || "\'\'"} !important;
}
`
    }

    for(let i = 0; i < $result.querySelectorAll('.line').length; i++){
        const l = $result.querySelectorAll('.line')[i].style;
        const c = $copy.querySelectorAll('.line')[i].style;
        str += `
.result:hover .line:nth-child(${i + 1}){
    position : absolute;
    left : ${(Number(c.left.split('px')[0]) * size/360).toFixed(0)}px !important;
    top : ${(Number(c.top.split('px')[0]) * size/360).toFixed(0)}px !important;
    width : ${(Number(c.width.split('px')[0]) * size/360).toFixed(1)}px !important;
    height : ${(Number(c.height.split('px')[0]) * size/360).toFixed(0)}px !important;
    border-radius : ${(Number(c.borderRadius.split('px')[0]) * size/360).toFixed(0)}px !important;
    transform : ${c.transform = c.transform || "\'\'"} !important;
}
`
    }
    document.head.innerHTML += "<style>" + str + "</style>";
    document.querySelector('textarea').value = str.split(' !important').join('');
    const h =`<div class='result'>
    <div class='line'></div>
    <div class='line'></div>
    <div class='line'></div>
</div>
`
    document.querySelector('.print textarea').value = str.split(' !important').join('').split('.result').join('.'+document.querySelector('#className').value+'');
    document.querySelector('.print.a textarea').value = h.split('result').join(document.querySelector('#className').value);
}


window.onload = () => {
    createGrid();
    createDot(80, 80, 280, 80);
    createDot(80, 180, 280, 180);
    createDot(80, 280, 280, 280);
    create();
}
