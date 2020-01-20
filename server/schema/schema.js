const graphql = require('graphql');
const Player = require('../models/player');
const Game = require('../models/game');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

//dummy data
var players = [
  {id: 1, name: 'Phil Ivey', winnings: 123456, gamesPlayed: [1, 2, 3], gamesWon: [3]},
  {id: 2, name: 'Daniel Negreanu', winnings: 123000, gamesPlayed: [1], gamesWon: [1]},
  {id: 3, name: 'Tom Dwan', winnings: 1234564, gamesPlayed: [1, 3], gamesWon: []},
  {id: 4, name: 'Dominik Panka', winnings: 1234561, gamesPlayed: [2], gamesWon: [2]}
];

var games = [
  {gameId: 1, name: '20k High Roller', prizeMoney: 44000},
  {gameId: 2, name: '1mil Cashgame', prizeMoney: 64000},
  {gameId: 3, name: '2020 WSOP', prizeMoney: 21000}
];

//Define types

/*
PlayerType
name: Player name
winnings: Total career $ winnings
gamesPlayed: Tournaments participated
gamesWon: Tournaments won
*/
const PlayerType = new GraphQLObjectType({
  name: 'Player',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    winnings: {type: GraphQLInt},
    gamesPlayed: {
      type: new GraphQLList(GameType),
      resolve(parent, args) {
        let gamesPlayed = [];
        parent.gamesPlayed.forEach(value => {
          gamesPlayed.push(Game.find({gameId: value}));
        });
        return gamesPlayed;
      }
    },
    gamesWon: {
      type: new GraphQLList(GameType),
      resolve(parent, args) {
        let gamesWon = [];
        parent.gamesWon.forEach(value => {
          gamesWon.push(Game.find({gameId: value}));
        });
        return gamesWon;
      }
    }
  })
});

/*
GameType
name: Game name
prizeMoney: Cash prize for winner
*/
const GameType = new GraphQLObjectType({
  name: 'Game',
  fields: () => ({
    id: {type: GraphQLID},
    gameId: {type: GraphQLID},
    name: {type: GraphQLString},
    prizeMoney: {type: GraphQLInt}
  })
});

//Define route queries
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //Query all players
    players: {
      type: new GraphQLList(PlayerType),
      resolve(parent, args) {
        return Player.find({});
      }
    },
    //Query player by ID
    playerById: {
      type: PlayerType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return Player.findById(args.id);
      }
    },
    //Query player by name
    playerByName: {
      type: PlayerType,
      args: {name: {type: GraphQLString}},
      resolve(parent, args){
        return Player.findOne({name: args.name});
      }
    },
    //Query all games
    games: {
      type: new GraphQLList(GameType),
      resolve(parent, args) {
        return Game.find({});
      }
    },
    //Query game by ID
    gameById: {
      type: GameType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return Game.findById(args.id);
      }
    },
    //Query game by name
    gameByName: {
      type: GameType,
      args: {name: {type: GraphQLString}},
      resolve(parent, args){
        return Game.findOne({name: args.name});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    //Add player with name (String), winnings (Int), games played ([Int]) and games won ([Int])
    addPlayer: {
      type: PlayerType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        winnings: {type: new GraphQLNonNull(GraphQLInt)},
        gamesPlayed: {type: new GraphQLNonNull(new GraphQLList(GraphQLID))},
        gamesWon: {type: new GraphQLNonNull(new GraphQLList(GraphQLID))}
      },
      resolve(parent, args) {
        let player = new Player({
          name: args.name,
          winnings: args.winnings,
          gamesPlayed: args.gamesPlayed,
          gamesWon: args.gamesWon
        });
        return player.save();
      }
    },
    //Add game with game id (ID), name (String) and prize money (Int)
    addGame: {
      type: GameType,
      args: {
        gameId: {type: new GraphQLNonNull(GraphQLID)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        prizeMoney: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args) {
        let game = new Game({
          gameId: args.gameId,
          name: args.name,
          prizeMoney: args.prizeMoney
        });
        return game.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
