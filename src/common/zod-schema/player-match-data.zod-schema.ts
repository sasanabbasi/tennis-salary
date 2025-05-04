import { z } from 'zod';

const ResultSetSchema = z.array(z.tuple([z.number(), z.number()]));

const PlayerMatchDataSchema = z.object({
  playerId: z.number(),
  playerName: z.string(),
  opponentId: z.number(),
  opponentName: z.string(),
  result: ResultSetSchema,
  aces: z.array(z.number()).length(2),
  smashedRackets: z.array(z.number()).length(2),
  doubleFaults: z.array(z.number()).length(2),
});

export const PlayerMatchDataArraySchema = z.array(PlayerMatchDataSchema);
