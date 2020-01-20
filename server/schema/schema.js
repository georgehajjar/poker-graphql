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
          gamesPlayed.push(Game.findOne({gameId: value}));
        });
        return gamesPlayed;
      }
    },
    gamesWon: {
      type: new GraphQLList(GameType),
      resolve(parent, args) {
        let gamesWon = [];
        parent.gamesWon.forEach(value => {
          gamesWon.push(Game.findOne({gameId: value}));
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
        gamesPlayed: {type: new GraphQLList(GraphQLID)},
        gamesWon: {type: new GraphQLList(GraphQLID)}
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
