# poker-graphql

A GraphQL + Express app to query Poker stats from a MongoDB database.

### To Run

* Install dependencies
```shell
cd server
npm install
```

* Start server
```shell
node app.js
```

* Navigate to <http://localhost:4000/graphql> on any browser

### To Inspect database
```shell
mongo
use poker
db.players.find().pretty()
db.games.find().pretty()
```
id: {type: GraphQLID},
name: {type: GraphQLString},
winnings: {type: GraphQLInt},
played

### Types
```
Player{
  id: ID
  name: String
  winnings: Int
  played: [ID]
}

Game{
  id: ID
  name: String
  prizeMoney: Int
  winner: Player
}
```

### Queries
```
players: [Player]

playerById(id: ID): Player

playerByName(name: String): Player

games: [Game]

gameById(id: ID): Game

gameByName(name: String): Game
```

### Mutations
```
addPlayer(
name: String
winnings: Int
played: [ID]
): Player

addGame(
name: String
prizeMoney: Int
winner: String
): Game
```
