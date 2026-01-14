import type { IBattleMapAsset, IBattleMap } from './types.ts';

const CELL_INCH = 92;

let CLICKED_TOKEN: HTMLElement | null;
let SHOW_MENU: boolean = false;

function generateColumns(): void {
    const widthInch: number = screen.width / 96;
    const heightInch: number = screen.height / 96;
    const GRID: HTMLElement | null = document.getElementById('grid');

    if (GRID) {
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

    const DRAGGABLE_GRID: HTMLElement | null = document.getElementById('draggable-grid');
    if (DRAGGABLE_GRID) {
        DRAGGABLE_GRID.addEventListener('offclic', function() {
            // console.log('ahhh')
            // CLICKED_TOKEN = null;
            // SHOW_MENU = false;
            // closeMenu();
            // currently doesn't work and breaks opening the menu
        })
    }
}

generateColumns();

async function fetchBattleMap(name: string): Promise<IBattleMap> {
    try {
        const response = await fetch(`./battle_maps/${name}/settings.json`, { mode: 'no-cors'});
        const data = await response.json();
        return data;
    } catch (err: any) {
        throw new Error(err)
    }
}

function addAssetToScreen(asset: IBattleMapAsset, battleMapName: string) {
    const { name, id, type, subtype, path, size, startingXCell, startingYCell, isDraggable } = asset;
    const GRID: HTMLElement | null = document.getElementById('grid');
    const DRAGGABLE_GRID: HTMLElement | null = document.getElementById('draggable-grid');
    
    if (GRID && DRAGGABLE_GRID) {
        const IMG_CONTAINER = document.createElement('div');
        const IMG = document.createElement('img');
        
        IMG.src = `./battle_maps/${battleMapName}/assets/${path}`;
        IMG_CONTAINER.classList.add('asset', type);
        if (subtype) {
            IMG_CONTAINER.classList.add(subtype);
        }

        if (subtype === 'hostile') {
            IMG_CONTAINER.classList.add('hostile');
        }

        IMG_CONTAINER.classList.add(`image-container-${size}`);
        let width, height;
        switch(size.toLowerCase()) {
            case 'tiny':
                width = CELL_INCH;
                height = CELL_INCH;
            case 'small':
                width = CELL_INCH;
                height = CELL_INCH;
            case 'medium':
                width = CELL_INCH;
                height = CELL_INCH;
            case 'large':
                width = 2 * CELL_INCH;
                height = 2 * CELL_INCH;
            case 'huge':
                width = 3 * CELL_INCH;
                height = 3 * CELL_INCH;
            case 'gargantuan':
                width = 4 * CELL_INCH;
                height = 4 * CELL_INCH;
            default:
                const measurements = size.toLowerCase().split('x');
                if (measurements.length !== 2) {
                    width = CELL_INCH;
                    height = CELL_INCH;
                } else {
                    // @ts-ignore
                    if (measurements[0] && !isNaN(measurements[0]) && measurements[1] && !isNaN(measurements[1])) {
                        width = parseInt(measurements[0], 10) * CELL_INCH;
                        height = parseInt(measurements[1], 10) * CELL_INCH;
                    } else {
                        width = CELL_INCH;
                        height = CELL_INCH;
                    }
                }
        }

        IMG_CONTAINER.style.height = `${height}px`;
        IMG_CONTAINER.style.width = `${width}px`;
        IMG.classList.add('token-image');

        if (startingXCell) {
            IMG_CONTAINER.style.left = `${((startingXCell - 1) * 96) + 1}px`;
        }

        if (startingYCell) {
            IMG_CONTAINER.style.top = `${((startingYCell - 1) * 96) + 12}px`;
        }
        IMG_CONTAINER.draggable = isDraggable;
        IMG.draggable = false;
        IMG_CONTAINER.ondragover = dragOverHandler;
        IMG_CONTAINER.classList.add(IMG_CONTAINER.draggable ? 'is-draggable' : 'non-draggable');
        IMG_CONTAINER.ondragstart = dragstartHandler;
        IMG_CONTAINER.id = `${name}-${id}`; // give unique IDs in the JSON when generating these for targeting reasons.
        IMG_CONTAINER.appendChild(IMG);
        if (IMG_CONTAINER.draggable) {
            DRAGGABLE_GRID.appendChild(IMG_CONTAINER);
        } else {
            GRID.appendChild(IMG_CONTAINER);
        }
    }
    addEventListenersToAsset(asset);
}

function placeAssets(battleMap: IBattleMap, battleMapName: string) {
    if (battleMap.battle_map_source) {
        const GRID: HTMLElement | null = document.getElementById('grid');
        if (GRID) {
            const backgroundSource = `./battle_maps/${battleMapName}/assets/${battleMap.battle_map_source}`;
            GRID.style.backgroundImage = `url('${backgroundSource}')`;
            GRID.style.backgroundRepeat = 'no-repeat';
            GRID.style.backgroundSize = 'cover';
        }
    }

    battleMap.assets.forEach((asset: IBattleMapAsset) => {
        addAssetToScreen(asset, battleMapName);
    });
}

async function initializeMap(name: string = 'default') {
    const battleMap = await fetchBattleMap(name);
    placeAssets(battleMap, name)
}

initializeMap('default').then(data=> {
    console.log('initialized');
})

function dragstartHandler(event: any) {
    const rect = event.target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    event.dataTransfer.setData("text/plain", `${event.target.id},${offsetX},${offsetY}`);
    event.dataTransfer.effectAllowed = "move";   
}

function dragOverHandler(event: any) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

// function snapToPosition(value) {
//     const inch = 96;
//     if (value % inch <= 48) {
//         return value - (value % inch);
//     }
//     return value + (96 - value % inch)
// }

function dropHandler(event: any) {
    event.preventDefault();
    const DRAGGABLE_GRID: HTMLElement | null = document.getElementById('draggable-grid');

    const data = event.dataTransfer.getData("text/plain").split(',');
    const id = data[0];
    const dropOffsetX = parseInt(data[1], 10);
    const dropOffsetY = parseInt(data[2], 10);

    const drop_item: HTMLElement | null = document.getElementById(id);
    if (drop_item) {
        drop_item.style.left = `${event.clientX - dropOffsetX + window.scrollX}px`;
        drop_item.style.top = `${event.clientY - dropOffsetY + window.scrollY}px`;
        DRAGGABLE_GRID?.appendChild(drop_item);
    }    
}

// menu functions

function addEventListenersToAsset(asset: IBattleMapAsset) {
    if (asset) {
        const ID = `${asset.name}-${asset.id}`;
        const assetElement: HTMLElement | null = document.getElementById(ID);
        if (assetElement) {
            assetElement.addEventListener('mouseup', function(event: MouseEvent) {
                CLICKED_TOKEN = assetElement;
                openMenu(event, ID);
            });
        }
    }
}

function openMenu(event: MouseEvent, ID: string) {
    const DRAGGABLE_GRID = document.getElementById('draggable-grid');
    const { clientX, clientY } = event;

    closeMenu();

    SHOW_MENU = true;
    const menu = document.createElement('div');
    menu.id = 'token-menu';

    menu.style.left = clientX + 168 > screen.width ? `${clientX - 168}px` : `${clientX}px`;
    menu.style.top = clientY + 200 > screen.width ? `${clientY - 200}px` : `${clientY}px`;

    const removeButton = document.createElement('button');
    removeButton.onclick = removeToken;

    menu.appendChild(removeButton);
    DRAGGABLE_GRID?.appendChild(menu);
}

function closeMenu() {
    const DRAGGABLE_GRID = document.getElementById('draggable-grid');
    SHOW_MENU = false;
    const menuToRemove = document.getElementById('token-menu');
    if (menuToRemove) {
        DRAGGABLE_GRID?.removeChild(menuToRemove);
    }
}

function removeToken() {
    const GRID: HTMLElement | null | undefined = CLICKED_TOKEN?.parentElement;
    if (CLICKED_TOKEN) {
        GRID?.removeChild(CLICKED_TOKEN);
    }
}

function setCondition() {
    // for all of these, you should build a template. instead of building the menu by scratch every time
    // build it/copy it from that template. Since we are storing the clicked element and we can
    // find which grid it is on by searching for the parent, that should do it.

    // this one needs a secondary menu to pop up.
}