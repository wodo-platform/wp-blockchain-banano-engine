export interface GameEvent {
    type:number;
    event:string;
    createdAt: Date;
};

export interface GameScoreEvent extends GameEvent{
    from:string;
    to:string;
    score: number;
};

export interface GamePlayer{
    id:number;
    name:string;
    score: number;
};

export interface GameLeaderBoard{
    users:GamePlayer[];
};

export interface GameServerLogEntry {
    type:number;
    log:string;
    createdAt: Date;
};

export default interface GameServerLog {
    gameServerId: number;
    type: number;
    assetId: number;
    logEntries: GameServerLogEntry[];
    gameEvents: GameEvent[];
    leaderBoard: GameLeaderBoard;
    totalAmount: number;
    revenue: number;
    createdAt: Date;
};
