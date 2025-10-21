import { Schema } from 'mongoose';
import { defineMongooseModel } from '#nuxt/mongoose';

export interface ICharacter {
    userId: Schema.Types.ObjectId;
    name: string;
    hp: number;
    hpMax: number;
    energy: number;
    energyMax: number;

    cultivationStage: string;
    cultivationExp: number;
    currentZoneId: Schema.Types.ObjectId | null;

    inventory: { itemId: string; quantity: number }[];
    stats: {

        attack: number;
        defense: number;
        speed: number;
    };

    lastCultivateTick: Date;

}

export const Character = defineMongooseModel<ICharacter>('Character', {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, unique: true },
    hp: { type: Number, default: 100 },
    hpMax: { type: Number, default: 100 },
    energy: { type: Number, default: 500 },
    energyMax: { type: Number, default: 500 },

    cultivationStage: { type: String, default: 'Phàm Nhân' },
    cultivationExp: { type: Number, default: 0 },

    currentZoneId: { type: Schema.Types.ObjectId, ref: 'Zone' },

    inventory: [{
        itemId: { type: String, required: true },
        quantity: { type: Number, required: true },
    }],

    stats: {
        attack: { type: Number, default: 10 },
        defense: { type: Number, default: 5 },
        speed: { type: Number, default: 10 },
    },

    lastCultivateTick: { type: Date, default: Date.now }, // Dùng cho idle progress
}, { timestamps: true });


// server/models/cultivation.model.ts
export const Cultivation = defineMongooseModel('Cultivation', {
    stageName: { type: String, required: true, unique: true }, // "Phàm Nhân", "Tinh Giả"
    level: { type: Number, required: true }, // Cấp độ của cảnh giới
    expToNext: { type: Number, required: true },
    breakthroughRequirements: [{
        type: { type: String, enum: ['item', 'stat'] },
        itemId: String, // if type is 'item'
        statName: String, // if type is 'stat'
        value: Number,
    }],
    description: String,
    statBonuses: { attack: Number, defense: Number, energyMax: Number },
});


// server/models/zone.model.ts
export const Zone = defineMongooseModel('Zone', {
    name: { type: String, required: true },
    description: { type: String, required: true },
    dangerLevel: { type: Number, default: 1 },

    monsters: [{ // Quái có thể xuất hiện
        monsterId: { type: Schema.Types.ObjectId, ref: 'Monster' },
        spawnChance: { type: Number, min: 0, max: 1 },
    }],

    resources: [{ // Tài nguyên có thể thu thập
        itemId: { type: String },
        spawnChance: { type: Number, min: 0, max: 1 },
        quantity: [Number, Number], // [min, max]
    }],

    connectedZones: [{ // Các lối đi
        direction: String, // "north", "south", "enter_cave"
        zoneId: { type: Schema.Types.ObjectId, ref: 'Zone' },
    }],
});

// server/models/monster.model.ts
export const Monster = defineMongooseModel('Monster', {
    name: { type: String, required: true },
    level: { type: Number, default: 1 },
    hp: { type: Number, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    description: String,
    drops: [{
        itemId: String,
        dropChance: { type: Number, min: 0, max: 1 },
        quantity: [Number, Number], // [min, max]
    }],
});


// server/models/item.model.ts
export const Item = defineMongooseModel('Item', {
    itemId: { type: String, unique: true, required: true }, // e.g., "energy_crystal_low", "iron_scrap"
    name: { type: String, required: true },
    type: { type: String, enum: ['resource', 'module', 'chip', 'consumable'], required: true },
    rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic'], default: 'common' },
    energyValue: { type: Number, default: 0 }, // Giá trị năng lượng khi "hấp thụ"
    description: String,
});


// server/models/event.model.ts
export const Event = defineMongooseModel('Event', {
    name: { type: String, required: true },
    description: String,
    triggerType: { type: String, enum: ['zone_enter', 'time_based', 'player_action'] },
    chance: { type: Number, min: 0, max: 1 },
    effects: [{
        type: { type: String }, // e.g., 'spawn_monster', 'give_item', 'modify_zone_desc'
        details: Object,
    }],
});


// server/models/actionLog.model.ts
export const ActionLog = defineMongooseModel('ActionLog', {
    characterId: { type: Schema.Types.ObjectId, ref: 'Character', required: true, index: true },
    action: { type: String, required: true }, // "move", "attack", "gather", "cultivate"
    result: { type: String }, // "success", "failure"
    details: { type: Object }, // { fromZone: 'A', toZone: 'B' } or { damage: 50, target: 'MonsterX' }
}, { timestamps: true, capped: { size: 10000000, max: 50000 } }); // Capped collection
