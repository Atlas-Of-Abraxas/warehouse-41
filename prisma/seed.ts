import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("changeme", 10);
  await prisma.user.upsert({
    where: { email: "admin@warehouse41.com" },
    update: { password: hashedPassword },
    create: {
      email: "admin@warehouse41.com",
      name: "Store Admin",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Seed products
  const products = [
    { name: "Black Lotus (Proxy)", description: "Premium proxy of the iconic Power 9 card. Perfect for cube and casual play.", price: 12.99, category: "MTG_SINGLES", stock: 15, featured: true },
    { name: "Commander Masters Booster Box", description: "24-pack booster box featuring powerful reprints for Commander.", price: 289.99, category: "MTG_SEALED", stock: 8, featured: true },
    { name: "Kill Team: Starter Set", description: "Everything you need to start playing Kill Team — two teams, terrain, rules, and dice.", price: 110.00, category: "KILL_TEAM", stock: 8, featured: true },
    { name: "Citadel Paint Starter Set", description: "13 essential paints for getting started with miniature painting.", price: 35.00, category: "PAINT_SUPPLIES", stock: 20 },
    { name: "Player's Handbook 2024", description: "The essential D&D rulebook, revised and updated for 2024.", price: 49.95, category: "RPG_BOOKS", stock: 25, featured: true },
    { name: "Vampire: The Masquerade 5th Edition", description: "The core rulebook for the World of Darkness.", price: 55.00, category: "RPG_BOOKS", stock: 10 },
    { name: "MTG Deck Box - Ultra Pro", description: "Holds 100+ sleeved cards. Available in multiple colors.", price: 4.99, category: "ACCESSORIES", stock: 50 },
    { name: "Dice Set - Metal RPG (7pc)", description: "Premium metal polyhedral dice set with velvet pouch.", price: 24.99, category: "ACCESSORIES", stock: 30 },
    { name: "Foundations Play Booster Box", description: "36-pack booster box of the newest MTG core set.", price: 149.99, category: "MTG_SEALED", stock: 15, featured: true },
    { name: "Kill Team: Kommandos", description: "10 Ork Kommandos for Kill Team. Aggressive melee specialists — beginner-friendly.", price: 55.00, category: "KILL_TEAM", stock: 10 },
    { name: "Kill Team: Intercession Squad", description: "6 Space Marine Intercessors for Kill Team. Durable, balanced, and forgiving for new players.", price: 55.00, category: "KILL_TEAM", stock: 10 },
    { name: "Kill Team: Octarius Terrain Set", description: "Full set of Ork scrap terrain. 14 pieces for dense jungle-style boards.", price: 65.00, category: "KILL_TEAM", stock: 5 },
    { name: "Dungeon Master's Guide 2024", description: "Everything you need to run epic D&D campaigns.", price: 49.95, category: "RPG_BOOKS", stock: 18 },
    { name: "Card Sleeves - Dragon Shield (100)", description: "Premium matte card sleeves. Tournament-legal protection.", price: 11.99, category: "ACCESSORIES", stock: 100 },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // Seed events
  const now = new Date();
  const events = [
    { title: "Friday Night Magic: Standard", description: "Weekly Standard tournament. Prizes for top 4!", date: nextDay(now, 5, 18), type: "MTG_TOURNAMENT", capacity: 32, price: 5 },
    { title: "Commander Night", description: "Casual Commander pods. Bring your favorite deck!", date: nextDay(now, 3, 18), type: "CASUAL", capacity: 40 },
    { title: "Kill Team League - Season 1", description: "6-week Kill Team league. Round-robin format, all skill levels welcome. Prizes for top 3!", date: nextDay(now, 4, 18), type: "KILL_TEAM", capacity: 16, price: 10 },
    { title: "Kill Team: Learn to Play", description: "Beginner night! We provide loaner teams, terrain, and teach you the rules. No experience needed.", date: nextDay(now, 7, 13), type: "KILL_TEAM", capacity: 12, price: 0 },
    { title: "Kill Team Tournament: Into the Dark", description: "Close-quarters tournament using Into the Dark terrain. Bring your best CQB team. Prizes for top 4.", date: nextDay(now, 14, 12), type: "KILL_TEAM", capacity: 16, price: 15 },
    { title: "D&D Night: Tomb of Annihilation", description: "Open table D&D 5e. New players welcome!", date: nextDay(now, 2, 18), type: "DND_NIGHT", capacity: 24 },
    { title: "MTG Pre-Release Weekend", description: "Be the first to play with the newest set. Sealed format.", date: nextDay(now, 14, 12), type: "RELEASE_EVENT", capacity: 48, price: 30 },
    { title: "Paint & Take Workshop", description: "Learn to paint miniatures. All supplies provided!", date: nextDay(now, 8, 14), type: "CASUAL", capacity: 12, price: 15 },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  // Seed sessions
  const sessions = [
    { title: "Curse of Strahd Campaign", description: "Journey into the mists of Barovia in this gothic horror D&D campaign. Sessions run weekly. Currently at level 5.", gameSystem: "DND", gmName: "Marcus (DM)", date: nextDay(now, 4, 18), duration: 240, price: 10, maxPlayers: 6, currentPlayers: 4 },
    { title: "Vampire: The Masquerade - Chicago by Night", description: "Navigate the treacherous politics of Chicago's Kindred. A World of Darkness chronicle.", gameSystem: "WOD", gmName: "Sarah (Storyteller)", date: nextDay(now, 1, 19), duration: 180, price: 10, maxPlayers: 5, currentPlayers: 3 },
    { title: "D&D One-Shot: Dragon Heist", description: "A self-contained adventure in Waterdeep. Perfect for new players!", gameSystem: "DND", gmName: "Jake (DM)", date: nextDay(now, 7, 14), duration: 300, price: 15, maxPlayers: 6, currentPlayers: 0 },
    { title: "Werewolf: The Apocalypse", description: "Fight for Gaia in this action-packed WoD game. New chronicle starting!", gameSystem: "WOD", gmName: "Alex (Storyteller)", date: nextDay(now, 10, 18), duration: 210, price: 10, maxPlayers: 5, currentPlayers: 0 },
  ];

  for (const session of sessions) {
    await prisma.session.create({ data: session });
  }

  console.log("Database seeded successfully!");
}

function nextDay(from: Date, daysAhead: number, hour: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hour, 0, 0, 0);
  return d;
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
