export interface INatsChatGlobalMessage {
  sender: string;
  message: string;
}

export interface IServerStatus {
  online: boolean
  ip: string;
  port: number;
  description: string[]
  version: string
  players: {
    online: number,
    max: number
  }
}
