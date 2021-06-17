import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GameServer, GameServerData, GameServerUser, GameServerUserData } from '.prisma/client';
import GameServerCreateParams from './model/game.server.create.params';
import GameServerDataCreateParams from './model/game.server.data.create.params';
import GameServerUserDataCreateParams from './model/game.server.user.data.create.params';
import JoinGameParams from './model/join.game.params';
import { GAME_USER_PLAYING } from '../../common/game.user.status';
import GameServerUpdateParams from './model/game.server.update.params';
import RejoinGameParams from './model/rejoin.game.params';
import GameServerLog, { GameLeaderBoard, GamePlayer } from './model/game.server.log';

@Injectable()
export class GameServerService {

  private readonly logger = new Logger(GameServerService.name);

  constructor(private prisma: PrismaService) {
    this.logger.debug("instantiated a new instance of game server service");
   }

  async findAllGameServer(userId: number | null, assetId: number | null): Promise<GameServer[]> {
    let gameServer: GameServer[] = await this.prisma.gameServer.findMany(
      {
        orderBy: { createdAt: 'desc' },
      }
    ) as GameServer[];
    return gameServer;
  }

  async findAllGameServerData(userId: number | null, assetId: number | null): Promise<GameServerData[]> {
    let gameServerData: GameServerData[] = await this.prisma.gameServerData.findMany(
      {
        orderBy: { createdAt: 'desc' },
      }
    ) as GameServerData[];
    return gameServerData;
  }

  async findAllGameServerUser(userId: number | null, assetId: number | null): Promise<GameServerUser[]> {
    let gameServerUser: GameServerUser[] = await this.prisma.gameServerUser.findMany(
      {
       
      }
    ) as GameServerUser[];
    return gameServerUser;
  }

  async createGameServer(gameServerCreateParams: GameServerCreateParams): Promise<GameServer> {
    const data = {
      type: gameServerCreateParams.type,
      assetId: gameServerCreateParams.assetId,
      data: gameServerCreateParams.data,
      totalAmount: gameServerCreateParams.totalAmount,
      revenue: gameServerCreateParams.revenue
    };
    let gameServer: GameServer = await this.prisma.gameServer.create(
      {
        data
      }
    ) as GameServer;

    return gameServer;
  }

  /**
   *  Cash up game server. The business flow:
   *  #- The method is invoked when a game server is ended properly.
   *  #- Reward calculation is done per user, list of transactions to be executed is prepared
   *  #- transactions are sent in asyn manner --> TODO: This will take time. Implement event based model here.
   *  #- Revanue is calculated for the house account.
   *  #- Once all transactions are sent, GameServerData and GameServerUserData are created with proper/calculated data.
   *  #- GameServer and GameServerUser are deleted from the DB --> TODO: deleting records on a busy table can cause perf degredation (index updates, etc..) on DB. figure out a soft delete + scheduled perging approach here.
   *  #- GameServerData is marked as dormant, all is done.The transactions have been sent via corresponding blockchain network.
   */
  async processGameServer(gameServerId:number): Promise<GameServerData> {
    // TODO: make db functionality transactional here.
    let gameServer: GameServer = await this.findGameServerById(gameServerId);
    if(!(gameServer)) {
      throw new Error(`Game server not found by id[${gameServerId}]`); // TODO: where to validate this :) inside the actual method or here
    }

    let gameServerUsers: GameServerUser[] = await this.findGameServerUsersByGameServerId(gameServerId);
    if(!(gameServerUsers) ||  gameServerUsers.length < 1 ) {
      throw new Error(`Game server[${gameServer}] has been created but there is no user playing the game. What the fuck`); // TODO: handle this case later. This might happen. Premature ending of a game server.
    }

    // TODO: split up game server envents and logs in order to not process a large log file each time..
    let gameServerLog:GameServerLog = JSON.parse(gameServer.data.toString()) as GameServerLog;
    let gameLeaderBoard: GameLeaderBoard = gameServerLog.leaderBoard;
    let gamePlayers:GamePlayer[] = gameLeaderBoard.users;

    gamePlayers.forEach(gamePlayers => {
      this.logger.debug(`processing score of game player[${gamePlayers}]`);
    });

    let gameServerDataCreateParams: GameServerDataCreateParams =  {
      type: gameServer.type,
      assetId: gameServer.assetId,
      data: gameServer.data.toString(),
      totalAmount: gameServer.totalAmount,
      revenue: gameServer.revenue
    };

    let gameServerData : GameServerData =  await this.createGameServerData(gameServerDataCreateParams);

    // TODO: fix this
    gameServerUsers.forEach( async gameServerUser => {
      let gameServerUserDataCreateParams: GameServerUserDataCreateParams = {
        userId: gameServerUser.userId,
        gameServerId: gameServer.id,
        gameType: gameServer.type,
        assetId: gameServer.assetId,
        amount: gameServerUser.amount,
        reward: 77,
        joinedAt: gameServerUser.joinedAt,
        leftAt: gameServerUser.leftAt
      };
      this.logger.debug(`processing game server user[${gameServerUser.id}]`);
      await this.createGameServerUserData(gameServerUserDataCreateParams);
    });

    return gameServerData;
  }

  async findGameServerById(gameServerId:number) : Promise<GameServer>{
    // TODO: validate method params
    this.logger.debug(`finding game server in live game servers by gameServerId[${gameServerId}]`);
    let gameServer: GameServer = await this.prisma.gameServer.findUnique(
      {
        where: {
          id : gameServerId,
        }
      }
    ) as GameServer;

    if(gameServer) {
      this.logger.debug(`found gameServer[${JSON.stringify(gameServer)}] in live game servers by gameServerId[${gameServerId}]`);
    }
    else{
      this.logger.debug(`could not find any game server in live game servers by gameServerId[${gameServerId}]`);
    }

    return gameServer;
  }

  async updateGameServer(gameServerUpdateParams: GameServerUpdateParams): Promise<GameServer> {
    const data = {
      data: gameServerUpdateParams.data,
      totalAmount: gameServerUpdateParams.totalAmount,
      revenue: gameServerUpdateParams.revenue,
      finishedAt: new Date
    };
    let gameServer: GameServer = await this.prisma.gameServer.update(
      {
        where:
        {
          id: gameServerUpdateParams.id
        },
        data:
        {
          ...data,
        }
      }
    ) as GameServer;

    return gameServer;
  }

  async createGameServerData(gameServerDataCreateParams: GameServerDataCreateParams): Promise<GameServerData> {
    const data = {
      type: gameServerDataCreateParams.type,
      assetId: gameServerDataCreateParams.assetId,
      data: gameServerDataCreateParams.data,
      totalAmount: gameServerDataCreateParams.totalAmount,
      revenue: gameServerDataCreateParams.revenue
    };
    let gameServerData: GameServerData = await this.prisma.gameServerData.create(
      {
        data
      }
    ) as GameServerData;

    return gameServerData;
  }

  async rejoinGame(rejoinGameParams: RejoinGameParams): Promise<GameServerUser> {
    
    this.logger.debug(`user[${rejoinGameParams.userId}] is re-joining the game server[${rejoinGameParams.gameServerId}]. params[${JSON.stringify(rejoinGameParams)}]`);
    let gameServerUser:GameServerUser = await this.findUserInGameServer(rejoinGameParams.userId,rejoinGameParams.gameServerId);

    if(!(gameServerUser)) {
      throw new Error(`user[${gameServerUser.assetId}] has not joined the gamne server[${gameServerUser.gameServerId}], can not rejoin.`);
    }

    this.logger.debug(`user[${rejoinGameParams.userId}] has re-joininged the game server[${rejoinGameParams.gameServerId}]. gameServerUser[${JSON.stringify(gameServerUser)}]`);
    return gameServerUser;
  }
  
  async joinGame(joinGameParams: JoinGameParams): Promise<GameServerUser> {

    this.logger.debug(`user[${joinGameParams.userId}] is joining the game server[${joinGameParams.gameServerId}] with amount[${joinGameParams.amount}]. params[${JSON.stringify(joinGameParams)}]`)

    let gameServerUser:GameServerUser = await this.findUserInGameServer(joinGameParams.userId,joinGameParams.gameServerId);

    if(gameServerUser) {
      throw new Error(`user[${gameServerUser.assetId}] is already in gamne server[${gameServerUser.gameServerId}], can not rejoin.`);
    }

    const data = {
      userId: joinGameParams.userId,
      gameServerId: joinGameParams.gameServerId,
      assetId: joinGameParams.assetId,
      amount: joinGameParams.amount,
      status: GAME_USER_PLAYING.id
    };
    gameServerUser = await this.prisma.gameServerUser.create(
      {
        data
      }
    ) as GameServerUser;

    this.logger.debug(`user[${joinGameParams.userId}] has joined hte game server[${joinGameParams.gameServerId}] with amount[${joinGameParams.amount}]. gameServerUser[${JSON.stringify(gameServerUser)}]`);
    return gameServerUser;
  }

  async findUserInGameServer(userId:number, gameServerId:number) : Promise<GameServerUser>{
    // TODO: validate method params
    this.logger.debug(`finding user in live game servers by userId[${userId}] and gameServerId[${gameServerId}]`)
    let gameServerUser: GameServerUser = await this.prisma.gameServerUser.findFirst(
      {
        where: {
          userId : userId,
          gameServerId: gameServerId
        }
      }
    ) as GameServerUser;

    if(gameServerUser) {
      this.logger.debug(`found gameserveruser[${JSON.stringify(gameServerUser)}] in live game servers by userId[${userId}] and gameServerId[${gameServerId}]`)
    }
    else{
      this.logger.debug(`could not find any gameserveruser in live game servers by userId[${userId}] and gameServerId[${gameServerId}]`)
    }

    return gameServerUser;
  }

  async findGameServerUsersByGameServerId(gameServerId:number) : Promise<GameServerUser[]>{
    // TODO: validate method params
    this.logger.debug(`finding game server users in live game server users by gameServerId[${gameServerId}]`)
    let gameServerUsers: GameServerUser[] = await this.prisma.gameServerUser.findMany(
      {
        where: {
          gameServerId: gameServerId
        }
      }
    ) as GameServerUser[];

    if(gameServerUsers && gameServerUsers.length > 0) {
      this.logger.debug(`found gameserveruser[${JSON.stringify(gameServerUsers)}] in live game server userss by gameServerId[${gameServerId}]`);
    }
    else{
      this.logger.debug(`could not find any game server user in live game server users by gameServerId[${gameServerId}]`);
    }

    return gameServerUsers;
  }

  async createGameServerUserData(gameServerUserDataCreateParams: GameServerUserDataCreateParams): Promise<GameServerUserData> {
    const data = {
      userId: gameServerUserDataCreateParams.userId,
      gameServerId: gameServerUserDataCreateParams.gameServerId,
      gameType: gameServerUserDataCreateParams.gameType,
      assetId: gameServerUserDataCreateParams.assetId,
      amount: gameServerUserDataCreateParams.amount,
      reward: gameServerUserDataCreateParams.reward,
      joinedAt: gameServerUserDataCreateParams.joinedAt,
      leftAt: gameServerUserDataCreateParams.leftAt,
    };
    let gameServerUserData: GameServerUserData = await this.prisma.gameServerUserData.create(
      {
        data
      }
    ) as GameServerUserData;

    return gameServerUserData;
  }
}