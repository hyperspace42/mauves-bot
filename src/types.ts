export interface INatsChatGlobalMessage {
  sender: string;
  message: string;
}

export interface INatsServerConnetionMessage {
  player: string;
}

export interface  INatsDeathMessage {
  translationKey: string,
  args: string[]
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
    list?: string[]
  }
}
