export default interface GameServerUserDataCreateParams {
    userId: number;
    gameServerId: number;
    gameType: number;
    assetId: number;
    amount: number;
    reward: number;
    joinedAt: Date;
    leftAt: Date;
}