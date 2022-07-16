import axios from 'axios';

import { IServerStatus } from '../types';

const apiUrl: string = 'https://api.mcsrvstat.us/2/mauves.ru';

export default async function getServerStatus(): Promise<IServerStatus> {
  const data = await axios.get(apiUrl).then((res) => res.data);

  const serverStatus: IServerStatus = {
    online: data.online,
    ip: data.ip,
    port: data.port,
    description: data?.motd?.clean,
    players: data?.players,
    version: data?.version,
  };

  return serverStatus;
}
