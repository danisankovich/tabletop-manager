export interface IBattleMap {
    name: string;
    battle_mat_source?: string;
    assets: IBattleMapAsset[];
}

export interface IBattleMapAsset {
    name: string;
    id: string | number;
    type: string;
    subtype?: string;
    path: string;
    size: string;
    startingXCell: number;
    startingYCell: number;
}
