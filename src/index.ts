import type { IBattleMapAsset, IBattleMap } from './types.ts';

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

        if (['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'].includes(size)) {
            IMG.classList.add(size);
            IMG_CONTAINER.classList.add(`image-container-${size}`);
        } else {
            IMG_CONTAINER.classList.add(`image-container`);
        }

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
        if (IMG.draggable) {
            DRAGGABLE_GRID.appendChild(IMG_CONTAINER);
        } else {
            GRID.appendChild(IMG_CONTAINER);
        }
    }
}

function placeAssets(battleMap: IBattleMap, battleMapName: string) {
    if (battleMap.battle_map_source) {
        console.log('here?')
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
    })
}

async function initializeMap(name: string) {
    const battleMap = await fetchBattleMap(name);
    placeAssets(battleMap, name)
}

initializeMap('field').then(data=> {
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
        console.log(drop_item)
        DRAGGABLE_GRID?.appendChild(drop_item);
    }

}
