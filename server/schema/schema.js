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
  GraphQLNonNull,
  GraphQLInputObjectType
} = graphql;

//dummy data
var players = [
  {id: 1, name: 'Phil Ivey', winnings: 123456, played: [1, 2, 3]},
  {id: 2, name: 'Daniel Negreanu', winnings: 123000, played: [1]},
  {id: 3, name: 'Tom Dwan', winnings: 1234564, played: [1, 3]},
  {id: 4, name: 'Dominik Panka', winnings: 1234561, played: [2]}
];

var games = [
  {id: 1, name: '20k High Roller', prizeMoney: 44000, winner: 'Daniel Negreanu'},
  {id: 2, name: '1mil Cashgame', prizeMoney: 64000, winner: 'Dominik Panka'},
  {id: 3, name: '2020 WSOP', prizeMoney: 21000, winner: 'Phil Ivey'}
];

//Define types

/*
PlayerType
name: Player name
winnings: Total career $ winnings
played: Tournaments participated
*/
const PlayerType = new GraphQLObjectType({
  name: 'Player',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    winnings: {type: GraphQLInt},
    played: {
      type: new GraphQLList(GameType),
      resolve(parent, args) {
        let gamesPlayed = [];
        parent.played.forEach(value => {
          gamesPlayed.push(Game.findById(value));
        });
        return gamesPlayed;
      }
    }
  })
});

// PlayerTypeInput used for addGame mutation
const PlayerTypeInput = new GraphQLInputObjectType({
  name: 'PlayerInput',
  fields: () => ({
    //id: {type: GraphQLID},
    name: {type: GraphQLString}
    //winnings: {type: GraphQLInt},
    //played: {type: new GraphQLList(GraphQLID)}
  })
});

/*
GameType
name: Game name
prizeMoney: Cash prize for winner
winner: Name of winner
*/
const GameType = new GraphQLObjectType({
  name: 'Game',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    prizeMoney: {type: GraphQLInt},
    winner: {
      type: PlayerType,
      resolve(parent, args) {
        return Player.find({name: parent.winner});
      }
    }
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
    //Query games by ID
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
    //Add player with name (String), winnings (Int) and games played ([Int])
    addPlayer: {
      type: PlayerType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        winnings: {type: new GraphQLNonNull(GraphQLInt)},
        played: {type: new GraphQLNonNull(new GraphQLList(GraphQLID))}
      },
      resolve(parent, args) {
        let player = new Player({
          name: args.name,
          winnings: args.winnings,
          played: args.played
        });
        return player.save();
      }
    },
    //Add game with id (ID), name (String), prize money (Int) and winner (String)
    addGame: {
      type: GameType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        prizeMoney: {type: new GraphQLNonNull(GraphQLInt)},
        winner: {type: new GraphQLNonNull(PlayerTypeInput)}
      },
      resolve(parent, args) {
        let game = new Game({
          name: args.name,
          prizeMoney: args.prizeMoney,
          winner: args.winner
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
