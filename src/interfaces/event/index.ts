import { TeamInterface } from 'interfaces/team';

export interface EventInterface {
  id?: string;
  name: string;
  description?: string;
  date: Date;
  time: Date;
  team_id: string;

  team?: TeamInterface;
  _count?: {};
}
