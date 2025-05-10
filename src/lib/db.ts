import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || '65.21.243.46',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'imports',
  password: process.env.DB_PASSWORD || 'imports',
  database: process.env.DB_NAME || 'imports',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

async function initializeDatabaseSchema() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Successfully connected to the database for schema initialization.");

    // Products Table
    // Added discountPrice column
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(2048),
        category VARCHAR(255),
        color VARCHAR(255),
        size VARCHAR(255),
        model VARCHAR(255),
        stock INT NOT NULL DEFAULT 0,
        discountPrice DECIMAL(10, 2) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'products' checked/created successfully.");

    // Reviews Table
    // Added created_at and updated_at for consistency
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(255) PRIMARY KEY,
        productId VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        userId VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
    console.log("Table 'reviews' checked/created successfully.");

    // Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        passwordHash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'users' checked/created successfully.");
    
    // Orders Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        customerName VARCHAR(255) NOT NULL,
        customerEmail VARCHAR(255) NOT NULL,
        totalAmount DECIMAL(10, 2) NOT NULL,
        status ENUM('Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado') NOT NULL DEFAULT 'Pendente',
        orderDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        shippingAddressStreet VARCHAR(255),
        shippingAddressCity VARCHAR(255),
        shippingAddressPostalCode VARCHAR(255),
        shippingAddressCountry VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'orders' checked/created successfully.");

    // Order Items Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(255) PRIMARY KEY,
        orderId VARCHAR(255) NOT NULL,
        productId VARCHAR(255) NOT NULL,
        productName VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        priceAtPurchase DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT 
      )
    `);
    console.log("Table 'order_items' checked/created successfully.");

    // Wishlist Items Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wishlist_items (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        productId VARCHAR(255) NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE (userId, productId)
      )
    `);
    console.log("Table 'wishlist_items' checked/created successfully.");


  } catch (error) {
    console.error("Error initializing database schema:", error);
    // Throw the error so the application startup might indicate a critical DB issue
    throw error;
  } finally {
    if (connection) {
      connection.release();
      console.log("Database connection released after schema initialization.");
    }
  }
}

// Self-invoking async function to initialize schema
// This will run once when the module is first imported
(async () => {
  try {
    await initializeDatabaseSchema();
  } catch (error) {
    // Log the error but don't prevent the app from trying to start
    // API routes will fail if DB is not properly initialized, but the app might still run
    console.error("Critical: Failed to initialize database schema during application startup. API routes requiring database access will likely fail.", error);
  }
})();


export default pool;
