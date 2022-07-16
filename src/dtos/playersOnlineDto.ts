import { IServerStatus } from "types"

class PlayersOnlineDto {
  public online
  public description
  public players

  constructor(status: IServerStatus) {
    this.online = status.online
    this.description = status.description
    this.players = status.players
  };
}

export default PlayersOnlineDto