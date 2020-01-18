const graphql = require('graphql');
const _ = require('lodash');
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
  {id: '1', name: 'Phil Ivey', winnings: 123456, played: [1, 2, 3]},
  {id: '2', name: 'Daniel Negreanu', winnings: 123000, played: [1]},
  {id: '3', name: 'Tom Dwan', winnings: 1234564, played: [1, 3]},
  {id: '4', name: 'Dominik Panka', winnings: 123456123456, played: [2]}
];

var games = [
  {id: '1', name: '20k High Roller', prizeMoney: 44000, winnerId: '2'},
  {id: '2', name: '1mil Cashgame', prizeMoney: 64000, winnerId: '4'},
  {id: '3', name: '2020 WSOP', prizeMoney: 21000, winnerId: '1'}
];

//Define types
const PlayerType = new GraphQLObjectType({
  name: 'Player',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    winnings: {type: GraphQLInt},
    played: {
      type: new GraphQLList(GameType),
      resolve(parent, args) {
        _.forEach(parent.played, value => {
          return _.filter(games, {id: value});
        });
      }
    }
  })
});

const GameType = new GraphQLObjectType({
  name: 'Game',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    prizeMoney: {type: GraphQLInt},
    winner: {
      type: PlayerType,
      resolve(parent, args) {
        return _.find(players, {id: parent.winnerId})
      }
    }
  })
});

//Define route queries
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    player: {
      type: PlayerType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        //Get data from db
        return _.find(players, {id: args.id});
      }
    },
    game: {
      type: GameType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        //Get data from db
        return _.find(games, {id: args.id});
      }
    },
    players: {
      type: new GraphQLList(PlayerType),
      resolve(parent, args) {
        return players;
      }
    },
    games: {
      type: new GraphQLList(GameType),
      resolve(parent, args) {
        return games;
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPlayer: {
      type: PlayerType,
      args: {
        name: {type: GraphQLString},
        winnings: {type: GraphQLInt},
        played: {type: GraphQLInt}
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
    addGame: {
      type: GameType,
      args: {
        name: {type: GraphQLString},
        prizeMoney: {type: GraphQLInt},
        winnerId: {type: PlayerType}
      },
      resolve(parent, args) {
        let game = new Game({
          name: args.name,
          prizeMoney: args.prizeMoney,
          winnerId: args.winnerId
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
