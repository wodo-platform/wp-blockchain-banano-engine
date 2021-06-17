export default interface GameUserStatus {
    id:number;
    name:string;
} 

export const GAME_USER_IN_LOBY : GameUserStatus = {
    id : 1,
    name: "in_loby"
}

export const GAME_USER_PLAYING : GameUserStatus = {
    id : 2,
    name: "playing"
}

export const GAME_USER_FINISHED : GameUserStatus = {
    id : 3,
    name: "finished"
}

export const GAME_USER_LEFT : GameUserStatus = {
    id : 4,
    name: "finished"
}