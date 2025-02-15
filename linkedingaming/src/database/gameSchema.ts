import mongoose, { Schema } from 'mongoose';

export type IGame = {
  _id: string;
  type: string;
  score: string;
  date: string;
  user: string;
  name: string;
};

const GameSchema = new Schema({
  type: { type: String, required: true },
  score: { type: String, required: true },
  date: { type: String, required: true },
  user: { type: String, required: true },
  name: { type: String, required: true },
});

const Game =
  mongoose.models['gameTest'] || mongoose.model('gameTest', GameSchema);

export default Game;
