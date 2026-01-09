var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function generateColumns() {
    var widthInch = screen.width / 96;
    var heightInch = screen.height / 96;
    var GRID = document.getElementById('grid');
    for (var counterHeight = 0; counterHeight < heightInch; counterHeight++) {
        var ROW = document.createElement('div');
        for (var counterWidth = 0; counterWidth < widthInch; counterWidth++) {
            var CELL = document.createElement('div');
            CELL.ondrop = dropHandler;
            CELL.ondragover = dragOverHandler;
            ROW.appendChild(CELL).className = 'cell';
        }
        GRID.appendChild(ROW).className = 'cell-row';
    }
}
generateColumns();
function fetchBattleMat(name) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("./battle_mats/".concat(name, "/settings.json"), { mode: 'no-cors' })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    err_1 = _a.sent();
                    throw new Error(err_1);
                case 4: return [2 /*return*/];
            }
        });
    });
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
    var name = asset.name, id = asset.id, type = asset.type, subtype = asset.subtype, path = asset.path, size = asset.size, startingXCell = asset.startingXCell, startingYCell = asset.startingYCell;
    var GRID = document.getElementById('grid');
    var IMG_CONTAINER = document.createElement('div');
    var IMG = document.createElement('img');
    IMG.src = "./battle_mats/".concat(battleMatName, "/assets/").concat(path);
    IMG.classList.add('asset', type);
    if (subtype) {
        IMG.classList.add(subtype);
    }
    if (['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'].includes(size)) {
        IMG.classList.add(size);
        IMG_CONTAINER.classList.add("image-container-".concat(size));
    }
    else {
        IMG_CONTAINER.classList.add("image-container");
    }
    if (startingXCell) {
        IMG.style.left = "".concat(((startingXCell - 1) * 96) + 1, "px");
    }
    if (startingYCell) {
        IMG.style.top = "".concat(((startingYCell - 1) * 96) + 12, "px");
    }
    IMG.draggable = true;
    IMG.ondragstart = dragstartHandler;
    IMG.id = "".concat(name, "-").concat(id); // give unique IDs in the JSON when generating these for targeting reasons.
    GRID.appendChild(IMG);
}
// addAssetToScreen('goblin.jpg', 3, 2);
function placeAssets(assets, battleMatName) {
    assets.forEach(function (asset) {
        addAssetToScreen(asset, battleMatName);
    });
}
function initializeMap(name) {
    return __awaiter(this, void 0, void 0, function () {
        var battleMat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchBattleMat(name)];
                case 1:
                    battleMat = _a.sent();
                    placeAssets(battleMat.assets, name);
                    return [2 /*return*/];
            }
        });
    });
}
initializeMap('default').then(function (data) {
    console.log(data);
});
function dragstartHandler(event) {
    var rect = event.target.getBoundingClientRect();
    var offsetX = event.clientX - rect.left;
    var offsetY = event.clientY - rect.top;
    console.log(offsetX, offsetY);
    event.dataTransfer.setData("text/plain", "".concat(event.target.id, ",").concat(offsetX, ",").concat(offsetY));
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
    var data = event.dataTransfer.getData("text/plain").split(',');
    var id = data[0];
    var dropOffsetX = parseInt(data[1], 10);
    var dropOffsetY = parseInt(data[2], 10);
    var drop_item = document.getElementById(id);
    drop_item.style.left = "".concat(event.clientX - dropOffsetX + window.scrollX, "px");
    drop_item.style.top = "".concat(event.clientY - dropOffsetY + window.scrollY, "px");
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
