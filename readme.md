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

### Types
```
Player{
  id: ID
  name: String
  winnings: Int
  gamesPlayed: [Game]
  gamesWon: [Game]
}

Game{
  id: ID
  name: String
  prizeMoney: Int
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
name: String,
winnings: Int,
gamesPlayed: [ID],
gamesWon: [ID]
): Player

addGame(
gameId: ID,
name: String,
prizeMoney: Int
): Game
```
