
// grab our client with destructuring from the export in index.js
const {   
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser 
} = require('./index');


async function dropTables() {
    try {
        console.log("Starting to drop tables...")
        await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
      `);

      console.log("Finished dropping tables!")
    } catch (error) {
        console.log("error dropping tables!")
        throw error; // we pass the error up to the function that calls dropTables
    }
}

async function createInitialUsers() {
    try {
        console.log("starting to create users!")

        const albert = await createUser({username: 'albert', password: 'bertie99', name: 'Al Bert', location: 'Sidney, Austalia'});
        const sandra = await createUser({username: 'sandra', password: '2sandy4me', name: 'Just Sandra', location: 'not tellin'});
        const glamgal = await createUser({username: 'glamgal', password: 'soglam', name: 'Joshua', location: 'Upper East Side'});

        console.log(albert + sandra + glamgal);
        console.log("Finished creating users!");
    } catch(error) {
        console.log("Error creating users!");
        throw error
    }
}


async function createTables() {
    try {
        console.log("starting to build tables...")
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            location varchar(255) NOT NULL,
            active BOOLEAN DEFAULT true
        );

        CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id),
        title varchar(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
        );
    `);
    console.log("Finished building tables!")
    } catch (error) {
        console,log("error building tables!")
        throw error; // we pass the error up to the function that calls createTables
    }
}



async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialPosts();
    } catch (error) {
      throw error;
    }
  }
  
  async function testDB() {
    try {
      console.log("Starting to test database...");
  
      console.log("Calling getAllUsers");
      const users = await getAllUsers();
      console.log("Result:", users);
  
      console.log("Calling updateUser on users[0]");
      const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
      });
      console.log("Result:", updateUserResult);
  
      console.log("Calling getAllPosts");
      const posts = await getAllPosts();
      console.log("Result:", posts);
  
      console.log("Calling updatePost on posts[0]");
      const updatePostResult = await updatePost(posts[0].id, {
        title: "New Title",
        content: "Updated Content"
      });
      console.log("Result:", updatePostResult);
  
      console.log("Calling getUserById with 1");
      const albert = await getUserById(1);
      console.log("Result:", albert);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.log("Error during testDB");
      throw error;
    }
  }


async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    await createPost ({
      authorId: albert.id,
      title: "First Post",
      content: "This is my first post. I hope I love writing blogs as much as I love writing them."
    });
    await createPost ({
      authorId: sandra.id,
      title: "Sandra's first post",
      content: "This is my first post. I am too sandy 4 u."
    });
    await createPost ({
      authorId: glamgal.id,
      title: "my glamor post",
      content: "This is my first post. I like to write about all things glamorous."
    });    
  } catch (error) {
    throw error;
  }
}



  rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end())
