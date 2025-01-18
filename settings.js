const fs = require("node:fs");

/**
 * CypherBot - Advanced WhatsApp Bot Configuration
 * Created by Team Cypher
 * Version: 1.0.0
 */

const config = {
    // Bot Identity
    name: "CypherBot",
    tagline: "Elevate Your WhatsApp Experience",
    version: "1.0.0",
    prefix: [".", "?", "!", "/"], // Command prefixes
    
    // Owner Configuration
    owner: [
        "6285270058464", // Primary Owner
        ""  // Secondary Owner ( Optional ). 
    ],
    
    // System Configuration
    sessions: "sessions",
    database: "cypher-db",
    timezone: "Asia/Jakarta",
    
    // Media Configuration
    sticker: {
        packname: "Created with ☕",
        author: "CypherBot",
        categories: ["anime", "memes", "custom"]
    },
    
    // Community IDs
    community: {
        newsletter: "120363388655497053@newsletter", // Newsletter Channel
        group: "120363370515588374@g.us",           // Official Group
        support: "coming_soon@g.us"                 // Support Group
    },
    
    // Response Messages
    messages: {
        // System Messages
        wait: "⚡ Processing your request...",
        error: "❌ An error occurred! Please try again.",
        success: "✅ Operation completed successfully!",
        
        // Permission Messages
        owner: "🔒 This command is restricted to bot owners",
        premium: "⭐ This is a premium feature. Upgrade to access!",
        group: "👥 This command only works in group chats",
        private: "👤 This command only works in private chats",
        
        // Admin Messages
        botAdmin: "❗ I need admin privileges to perform this action",
        userAdmin: "⚠️ This command is for group admins only",
        
        // Subscription Messages
        subscribe: "Join our channel for updates:\nwa.me/channel/CypherBot",
        upgrade: "🌟 Upgrade to Premium for exclusive features!\nContact owner: wa.me/6282114275683"
    }
};

// Export configuration
module.exports = config;

// Hot reload configuration
const file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(`\x1b[36m[${config.name}]\x1b[0m Configuration reloaded`);
    delete require.cache[file];
});