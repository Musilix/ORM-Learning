// Not entirely sure why I cant use import/export syntax, so I guess I'll resort to using require() syntax.
//I guess Node can't handle ES6 import syntax???
const { __prod__ } = require('./src/constants.ts');
const fs = require('fs');
require('dotenv').config();

const devConfig = {
    "type": "postgres",
    "host": "localhost", //localhost when running locally without running our node app in docker, peoplehub-db when running our web app through docker, and .... when running our web app using the prod db
    "port": 5432,
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD, //this shit ended up being the docker container pwd... the fuck
    "database": process.env.POSTGRESS_DB,
    
    // This field is also important as it lets typeorm know if it should sync up the DB described in this connection with any changes we make in our Entities
    // That is why when we deploy and run our code in a Prod env, we should keep this as false. As if we don't, any changes that are made in the schema/entities and run in Prod will
    // propogate unto the actual Prod DB... And on top of that, reverting such a change may be troublesome, depending on how big the persisted change was.
    
    // We should instead use migrations to set up what we need in a Prod env (and maybe even Dev/Test envs). As if we left this to true in a prod env, once we built
    "synchronize": false, 
    "logging": true,
    
    // These next fields confused me at first, as they seem synonymous with the cli subfields below, but these next 3 fields let typeorm know
    // where to find the entities, migrations, and subscribers associated with this connection. So for our dev connection, just for simplicitly,
    // we set it up similar to how we would expect it in a prod env. 

    // These can hold single file names or patterns to directories as seen below
    "entities": [
        "dist/entity/**/*.js"
    ],
    "migrations": [
        // When generating a migration file, we can include an -o flag to have the output file created in JS format. And TS in otherwise. Setting the migrations
        // linked to this dev connection as [jt]s just allows us to take either approach, using JS migration files or TS ones...
        "dist/migration/**/*.[jt]s" 
    ],
    "subscribers": [
        "dist/subscriber/**/*.js"
    ],

    // When either an entity, migration, or subscriber is created with the typeorm cli, it will reference this part of the config to figure out where to put those newly created entities...
    // So when we generate a new migration, we will store it in the dist. I feel like it could be stored elsewhere as well, as in the end, the location of the migration file doesn't really
    // matter... we just have to reference the proper location in one of the above 3 fields
    "cli": {
        "entitiesDir": "dist/entity",
        "migrationsDir": "dist/migration",
        "subscribersDir": "dist/subscriber"
    }
};

const prodConfig = {
    "type": "postgres",
    "host": process.env.POSTGRES_HOST_PROD, 
    "port": process.env.POSTGRES_PORT_PROD,
    "username": process.env.POSTGRES_USER_PROD,
    "password": process.env.POSTGRES_PASSWORD_PROD, 
    "database": process.env.POSTGRESS_DB,
    "ssl": {
        "ca": fs.readFileSync(__dirname + "/src/config/certs/ca-certificate.crt") // this is definitely not how to do it in Prod
    },
    "synchronize": false, 
    "logging": true,
    "entities": [
        "dist/entity/**/*.js"
    ],
    "migrations": [
        "dist/migration/**/*.[jt]s" 
    ],
    "subscribers": [
        "dist/subscriber/**/*.js"
    ],
    "cli": {
        "entitiesDir": "dist/entity",
        "migrationsDir": "dist/migration",
        "subscribersDir": "dist/subscriber"
    }
};

// If we want, we can set up a connection to multiple DBs by creating an array of typeorm configs
// They'd be used the same way as a single connection config, but will give typeorm access to other DBs
// const multiDatabaseConfig = [
//     devConfig,
//     prodConfig,
//     {}
// ];

module.exports = (__prod__ ? prodConfig : devConfig);