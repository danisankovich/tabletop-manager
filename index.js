function generateColumns() {
    const widthInch = screen.width / 96;
    const heightInch = screen.height / 96;
    const GRID = document.getElementById('grid');
    for (let counterHeight = 0; counterHeight < heightInch; counterHeight++) {
        const ROW = document.createElement('div');
        for (let counterWidth = 0; counterWidth < widthInch; counterWidth++) {
            const CELL = document.createElement('div');
            CELL.ondrop = dropHandler;
            CELL.ondragover = dragOverHandler;
            ROW.appendChild(CELL).className = 'cell';
        }
        GRID.appendChild(ROW).className = 'cell-row';
    }
}

generateColumns();

async function fetchBattleMat(name) {
    try {
        const response = await fetch(`./battle_mats/${name}/settings.json`, { mode: 'no-cors'});
        const data = await response.json();
        return data;
    } catch (err) {
        throw new Error(err)
    }
}

function addAssetToScreen(asset, battleMatName) {

    // {
    //         "name": "goblin",
    //         "id": 1,
    //         "type": "creature",
    //         "subtype": "hostile",
    //         "path": "goblin.jpg",
    //         "size": "medium",
    //         "startingXCell": 0,
    //         "startingYCell": 0
    //     }

    const { name, id, type, subtype, path, size, startingXCell, startingYCell } = asset;
    const GRID = document.getElementById('grid');
    const IMG_CONTAINER = document.createElement('div');
    const IMG = document.createElement('img');
    
    IMG.src = `./battle_mats/${battleMatName}/assets/${path}`;
    IMG.classList.add('asset', type);
    if (subtype) {
        IMG.classList.add(subtype);
    }

    if (['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'].includes(size)) {
        IMG.classList.add(size);
        IMG_CONTAINER.classList.add(`image-container-${size}`);
    } else {
        IMG_CONTAINER.classList.add(`image-container`);
    }

    if (startingXCell) {
        IMG.style.left = `${((startingXCell - 1) * 96) + 1}px`;
    }

    if (startingYCell) {
        IMG.style.top = `${((startingYCell - 1) * 96) + 12}px`;
    }
    IMG.draggable = true;
    IMG.ondragstart = dragstartHandler;
    IMG.id = `${name}-${id}`; // give unique IDs in the JSON when generating these for targeting reasons.
    GRID.appendChild(IMG);
}

// addAssetToScreen('goblin.jpg', 3, 2);

function placeAssets(assets, battleMatName) {
    assets.forEach(asset => {
        addAssetToScreen(asset, battleMatName);
    })
}

async function initializeMap(name) {
    const battleMat = await fetchBattleMat(name);
    placeAssets(battleMat.assets, name)
}

initializeMap('default').then(data=> {
    console.log(data);
})

function dragstartHandler(event) {
    const rect = event.target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    console.log(offsetX, offsetY);
    event.dataTransfer.setData("text/plain", `${event.target.id},${offsetX},${offsetY}`);    
}

function dragOverHandler(event) {
      event.preventDefault();
}

// function snapToPosition(value) {
//     const inch = 96;
//     if (value % inch <= 48) {
//         return value - (value % inch);
//     }
//     return value + (96 - value % inch)
// }

function dropHandler(event) {
    event.preventDefault();

    const data = event.dataTransfer.getData("text/plain").split(',');
    const id = data[0];

    const dropOffsetX = parseInt(data[1], 10);
    const dropOffsetY = parseInt(data[2], 10);

    const drop_item = document.getElementById(id);

    drop_item.style.left = `${event.clientX - dropOffsetX + window.scrollX}px`;
    drop_item.style.top = `${event.clientY - dropOffsetY + window.scrollY}px`;
}


// TODO
// run app via node, so that it can react to terminal commands
// add tokens to screen via terminal command --> maybe with sockets
// maybe electron app?

// alternatively, just have assets to load up, and depending on the assets, you tell it
// what to add to screen and where to begin. So like, each battlemap has an image (the grid)
// and a json, which includes enemy types, enemy numbers, and coordinates. 
// This can also be used for assets like trees and such, for when you don't
// have stylized backgrounds. You just have a piece of UI at the top with
// a dropdown to load the desired assets.
// or maybe you open the dropdown with a keypress.
