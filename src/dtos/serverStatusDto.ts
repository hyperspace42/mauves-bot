import { IServerStatus } from "types"

class ServerStatusDto {
  public online
  public description
  public version

  constructor(status: IServerStatus) {
    this.online = status.online
    this.description = status.description
    this.version = status.version
  };
}

export default ServerStatusDto