# TTK Game - New Features Documentation

This document describes the newly implemented features for the TTK game system.

## Group 1: Core System Expansion (Player Progression)

### Feature 1: Spirit Reader Class (Tinh Thần Niệm Sư)

**Overview**: A new character class that uses Spirit (Tinh Thần) as their primary stat instead of Strength (Sức Mạnh).

**Character Creation**:
```javascript
// When creating a character, players can choose their class
{
  "name": "Player Name",
  "class": "SpiritReader" // or "Warrior"
}
```

**Spirit Weapons**:
- `spirit_blade_basic`: Basic Flying Blade (8 Spirit)
- `spirit_blade_advanced`: Advanced Flying Blade (15 Spirit, 3 AoE targets)
- `energy_shield_basic`: Energy Shield (5 Spirit, 10 Defense)

**Combat**:
- Use action `combat/spiritAttack` to attack with spirit weapons
- Spirit Readers can attack from range and hit multiple targets
- Damage is calculated based on the Spirit stat

**Example Combat Log**:
```
> [ACTION]: combat/spiritAttack
[COMBAT]: 3 flying blades tear through the air!
[COMBAT]: Deal 7 damage to [Mutant Wolf 1].
[COMBAT]: Deal 6 damage to [Mutant Wolf 2].
[COMBAT]: Deal 7 damage to [Mutant Wolf 3].
[SYSTEM]: Consumed 10 Spirit Energy.
```

### Feature 2: Module System (Gene Mechanization)

**Overview**: Players can equip modules in 3 slots to enhance their abilities.

**Module Slots**:
- `moduleSlot1`: First module slot
- `moduleSlot2`: Second module slot
- `moduleSlot3`: Third module slot

**Module Types**:

**Passive Modules**:
- `module_counter_strike`: Reflects 20% of damage received

**Active Modules**:
- `module_energy_shield`: Create temporary HP shield (costs 50 energy)

**Actions**:
- `character/equipModule`: Equip a module to a slot
- `character/activateModule`: Activate an active module

**Example Usage**:
```
> [ACTION]: character/activateModule { "slot": "moduleSlot1" }
[SYSTEM]: Used 50 Energy.
[SYSTEM]: You received [Shield] (100 HP).
```

## Group 2: Social Interaction & MMO Features

### Feature 3: Guild/Dojo System

**Overview**: Players can create and join guilds (organizations).

**Guild Model**:
- Name, owner, members list
- Guild level and resource bank
- Unique guild base zone

**Actions**:
- `guild/create`: Create a guild (costs 10,000 Energy Crystals)
- `guild/invite`: Invite another player to join

**Example**:
```
> [ACTION]: guild/create { "name": "Iron Fist Dojo" }
[SYSTEM]: Created guild [Iron Fist Dojo]!
[SYSTEM]: Consumed 10,000 Energy Crystals.
```

### Feature 4: Party System

**Overview**: Players can form temporary parties (basic structure implemented).

**Actions**:
- `party/invite`: Invite player to party

**Note**: Full party synchronization and shared combat requires WebSocket implementation.

## Group 3: Economy & Crafting (Sandbox)

### Feature 5: Crafting & Research System

**Overview**: Players can craft items using blueprints and research new recipes.

**Blueprints**:
- `blueprint_alloy_armor`: Crafts Alloy Armor (requires 10 Alloy Ore + 5 Mid Beast Hide)
- `blueprint_gene_solution`: Crafts Basic Gene Solution (requires 5 Low Cosmic Herb + 20 Energy Crystals)

**Actions**:
- `crafting/craft`: Craft an item using a known blueprint
- `crafting/research`: Research a new blueprint using Ruin Fragments (50% success rate)

**Special Zones**:
- `giang_nam_xuong_ren`: Forge (for crafting weapons/armor)
- `giang_nam_phong_thi_nghiem`: Laboratory (for researching)

**Example**:
```
> [ACTION]: crafting/research
[RESEARCH]: Research successful!
[RESEARCH]: Learned blueprint: [Recipe: Alloy Armor]

> [ACTION]: crafting/craft { "blueprintId": "blueprint_alloy_armor" }
[CRAFTING]: Starting crafting...
[CRAFTING]: Success! Received 1x [alloy_armor]
```

### Feature 6: Player Market System

**Overview**: Players can trade items through a market system.

**MarketListing Model**:
- Seller ID, item ID, quantity, price per unit
- Currency: Energy Crystals
- 5% transaction tax

**Actions**:
- `market/sell`: List items for sale
- `market/search`: Search for items
- `market/buy`: Purchase items

**Example**:
```
> [ACTION]: market/sell { "itemId": "cultivation_chip_basic", "quantity": 1, "pricePerUnit": 500 }
[MARKET]: Listed for sale 1x [cultivation_chip_basic] at 500 Crystals/each.
[MARKET]: Listing ID: #A123

> [ACTION]: market/search { "itemId": "cultivation_chip_basic" }
[MARKET]: Found 3 listings:
1. [Warrior 01] - Price: 500 Crystals - Qty: 1 (ID: #A123)
2. [Hunter] - Price: 550 Crystals - Qty: 2 (ID: #B456)

> [ACTION]: market/buy { "listingId": "A123..." }
[MARKET]: Purchased 1x [cultivation_chip_basic] for 500 Crystals.
[SYSTEM]: Transaction tax: 25 Crystals.
```

## Group 4: Endgame Content (World Expansion)

### Feature 7: Space Travel System

**Overview**: Unlocks space travel for high-level players (Wargod rank recommended).

**Ship Model**:
- Fuel, cargo capacity, speed, HP
- Can travel between planets

**Space Zones**:
- `earth_base`: Earth Spaceship Bay
- `moon_base`: Moon Base (safe zone)
- `mars_mining`: Mars Mining Zone (wilderness)
- `asteroid_belt`: Asteroid Belt (secret realm)

**Items**:
- `basic_shuttle`: Basic spaceship
- `fuel_cell`: Refuel ship (restores 50 fuel)

**Actions**:
- `ship/travelTo`: Travel to a destination (costs fuel)
- `ship/refuel`: Refuel ship using fuel cells

**Random Events**:
- Energy Storm (30% fuel loss)
- Space Pirates (20% HP damage)

**Example**:
```
> [ACTION]: ship/travelTo { "target": "Mars" }
[TRAVEL]: Departing to Mars...
[EVENT]: Encountered Energy Storm! Lost 15 fuel.
[TRAVEL]: Arrived at Mars!
```

### Feature 8: Pet/Contract System

**Overview**: Players can tame beasts or purchase mechanical pets.

**Pet Model**:
- Owner, monster template, level, stats
- Two modes: Combat or Collection

**Actions**:
- `pet/tame`: Tame a beast during combat (Spirit Readers only, requires Slave Ring)
- `pet/activate`: Summon/activate a pet
- `pet/setMode`: Switch pet mode between Combat and Collect

**Items**:
- `slave_ring`: Taming item (50% success rate)
- `mechanical_pet_basic`: Basic robot pet

**Example**:
```
> [ACTION]: pet/tame { "monsterId": "bloodfang_boar" }
[SYSTEM]: Taming successful!
[SYSTEM]: [Bloodfang Boar] has become your pet!

> [ACTION]: pet/activate { "petId": "..." }
[SYSTEM]: Activated [Bloodfang Boar]!
[SYSTEM]: Mode: Combat

> [ACTION]: pet/setMode { "mode": "Collect" }
[SYSTEM]: Changed pet mode to: Collection
```

## New Items Summary

**Spirit Weapons**:
- spirit_blade_basic, spirit_blade_advanced
- energy_shield_basic

**Active Modules**:
- module_energy_shield (active)
- module_counter_strike (passive)

**Pet Items**:
- slave_ring (taming)
- mechanical_pet_basic

**Blueprints**:
- blueprint_alloy_armor
- blueprint_gene_solution

**Crafting Resources**:
- ruin_fragment (for research)
- alloy_armor (crafted item)

**Space Travel**:
- basic_shuttle (ship)
- fuel_cell (fuel)

## New Zones

**Crafting**:
- giang_nam_xuong_ren (Forge)
- giang_nam_phong_thi_nghiem (Laboratory)

**Space**:
- earth_base (Earth Spaceship Bay)
- moon_base (Moon Base)
- mars_mining (Mars Mining)
- asteroid_belt (Asteroid Belt)

## Database Schema Changes

**Character Model**:
- Added `class` field ('Warrior' | 'SpiritReader')
- Added `spirit` stat
- Added `moduleSlot1`, `moduleSlot2`, `moduleSlot3` in equipment
- Added `knownBlueprints` array
- Added `guildId` reference
- Added `activePetId` reference
- Added `currentShipId` reference
- Added `locationType` ('Planet' | 'Space')

**New Models**:
- Guild (guilds collection)
- Pet (pets collection)
- Ship (ships collection)
- MarketListing (marketlistings collection)

## Implementation Notes

1. **Party System**: Currently has basic structure. Full implementation requires real-time synchronization (WebSocket or polling).

2. **Guild Base**: Guild base zones are instance-based. Each guild has a unique zone ID.

3. **Pet Combat**: Pet combat AI is not yet implemented in the combat engine. Pets are currently passive.

4. **Space Travel**: Requires spaceship item. Random events trigger during travel.

5. **Module Drops**: Boss drops in Secret Realms not yet configured.

## Testing Recommendations

1. Test character creation with both classes
2. Test spirit attacks with different weapons
3. Test crafting system with blueprints
4. Test market transactions
5. Test pet taming mechanics
6. Test space travel with fuel management
7. Test guild creation and invites
8. Verify all new items are accessible in game

## Future Enhancements

- Complete party synchronization system
- Add pet combat AI
- Implement guild base construction
- Add more blueprints and recipes
- Create more space zones
- Add guild wars mechanics
- Implement PvP in chaos zones with parties
