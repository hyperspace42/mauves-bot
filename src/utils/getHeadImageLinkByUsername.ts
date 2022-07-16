import axios from 'axios';

const userFoundStatusCode: number = 200;
const steveUUId: string = '8667ba71b85a4004af54457a9734eed7';

export default async function getHeadImageLinkByUsername(username: string): Promise<string> {
  const currentUnixTime: number = new Date().getTime();

  const mojangUUIDApiUrl: string = `https://api.mojang.com/users/profiles/minecraft/${username}?at=${currentUnixTime}`;

  const data = await axios.get(mojangUUIDApiUrl);
  const dataStatusCode: number = data.status;

  switch (dataStatusCode) {
    case userFoundStatusCode:
      const uuid: string = data.data.id;
      return `https://crafatar.com/avatars/${uuid}?size=128&default=MHF_Steve&overlay`;

    default:
      return `https://crafatar.com/avatars/${steveUUId}?size=128&default=MHF_Steve`;
  }
}
