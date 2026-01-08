// Game State
const game = {
    currentLocation: 'intro',
    inventory: [],
    flags: {},
    discoveries: 0,
    totalDiscoveries: 5,
    visitedRooms: new Set()
};

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Location images
const locationImages = {
    gate: 'gate.png',
    entrance: 'entrance.png',
    garden: 'garden.png',
    greenhouse: 'greenhouse.png',
    sideyard: 'sideyard.png',
    backyard: 'backyard.png',
    shed: 'shed.png',
    foyer: 'foyer.png',
    dining: 'dining.png',
    upstairs: 'upstairs.png'
};

// Preload images
const loadedImages = {};
for (const [key, src] of Object.entries(locationImages)) {
    const img = new Image();
    img.src = src;
    loadedImages[key] = img;
}

// Colors
const colors = {
    black: '#000000',
    white: '#ffffff',
    gray: '#cccccc',
    darkGray: '#666666',
    skin: '#e0ac91',
    skinShadow: '#c69178',
    hair: '#282323',
    cropTop: '#1e1e1e',
    skirt: '#191919',
    yellow: '#ffcc00',
    red: '#cc0000'
};

// Rebecca sprite - larger size
function drawRebecca(x, y, scale = 4) {
    // Head
    ctx.fillStyle = colors.skin;
    ctx.fillRect(x + 6*scale, y + 2*scale, 4*scale, 5*scale);
    
    // Hair - long black hair
    ctx.fillStyle = colors.hair;
    ctx.fillRect(x + 5*scale, y + 1*scale, 6*scale, 2*scale);
    ctx.fillRect(x + 5*scale, y + 3*scale, 1*scale, 3*scale);
    ctx.fillRect(x + 10*scale, y + 3*scale, 1*scale, 3*scale);
    ctx.fillRect(x + 4*scale, y + 5*scale, 2*scale, 6*scale);
    ctx.fillRect(x + 10*scale, y + 5*scale, 2*scale, 6*scale);
    
    // Eyes
    ctx.fillStyle = '#503020';
    ctx.fillRect(x + 7*scale, y + 4*scale, 1*scale, 1*scale);
    ctx.fillRect(x + 9*scale, y + 4*scale, 1*scale, 1*scale);
    
    // Neck
    ctx.fillStyle = colors.skin;
    ctx.fillRect(x + 7*scale, y + 7*scale, 2*scale, 1*scale);
    
    // Crop top
    ctx.fillStyle = colors.cropTop;
    ctx.fillRect(x + 6*scale, y + 8*scale, 4*scale, 2*scale);
    ctx.fillRect(x + 5*scale, y + 8*scale, 1*scale, 2*scale);
    ctx.fillRect(x + 10*scale, y + 8*scale, 1*scale, 2*scale);
    
    // Arms
    ctx.fillStyle = colors.skin;
    ctx.fillRect(x + 5*scale, y + 10*scale, 1*scale, 3*scale);
    ctx.fillRect(x + 10*scale, y + 10*scale, 1*scale, 3*scale);
    
    // Midriff
    ctx.fillStyle = colors.skin;
    ctx.fillRect(x + 6*scale, y + 10*scale, 4*scale, 2*scale);
    
    // Skirt
    ctx.fillStyle = colors.skirt;
    ctx.fillRect(x + 5*scale, y + 12*scale, 6*scale, 4*scale);
    
    // Legs
    ctx.fillStyle = colors.skin;
    ctx.fillRect(x + 6*scale, y + 16*scale, 1*scale, 5*scale);
    ctx.fillRect(x + 8*scale, y + 16*scale, 1*scale, 5*scale);
    
    // Shoes
    ctx.fillStyle = colors.hair;
    ctx.fillRect(x + 5*scale, y + 21*scale, 2*scale, 1*scale);
    ctx.fillRect(x + 8*scale, y + 21*scale, 2*scale, 1*scale);
}

// Location scenes
const locations = {
    intro: {
        name: 'Introduction',
        description: '',
        items: [],
        clues: [],
        exits: {},
        draw: () => {
            ctx.fillStyle = colors.black;
            ctx.fillRect(0, 0, 800, 600);
            
            drawRebecca(340, 200, 5);
            
            ctx.fillStyle = colors.white;
            ctx.font = '24px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('Hi, my name is Rebecca...', 400, 480);
            
            ctx.font = '16px Courier New';
            ctx.fillStyle = colors.gray;
            ctx.fillText('Press ENTER to begin', 400, 520);
        }
    },
    
    gate: {
        name: 'Manor Gate',
        description: 'The rusted iron gates of Ashwood Manor creak ominously in the wind. Beyond them, the decrepit mansion looms against the darkening sky. The path north leads to the entrance.',
        items: [],
        clues: ['inscription'],
        exits: { north: 'entrance' },
        discovered: false,
        draw: () => {
            if (loadedImages['gate'] && loadedImages['gate'].complete) {
                ctx.drawImage(loadedImages['gate'], 0, 0, 800, 600);
            }
            drawRebecca(360, 480);
        }
    },
    
    entrance: {
        name: 'Manor Entrance',
        description: 'The grand entrance stands before you, its wooden doors weathered by decades of neglect. Flickering lanterns cast dancing shadows. Paths lead west to the garden, east to the side yard, and south back to the gate.',
        items: [],
        clues: ['plaque', 'door'],
        exits: { north: 'foyer', west: 'garden', east: 'sideyard', south: 'gate' },
        discovered: false,
        draw: () => {
            if (loadedImages['entrance'] && loadedImages['entrance'].complete) {
                ctx.drawImage(loadedImages['entrance'], 0, 0, 800, 600);
            }
            drawRebecca(360, 480);
        }
    },
    
    garden: {
        name: 'Overgrown Garden',
        description: 'Wild roses have consumed the garden, their thorns gleaming in the moonlight. A crumbling fountain sits silent in the center. The greenhouse lies north, and the entrance is east.',
        items: ['rose', 'garden shears'],
        clues: ['fountain'],
        exits: { east: 'entrance', north: 'greenhouse' },
        discovered: false,
        draw: () => {
            if (loadedImages['garden'] && loadedImages['garden'].complete) {
                ctx.drawImage(loadedImages['garden'], 0, 0, 800, 600);
            }
            drawRebecca(320, 480);
        }
    },
    
    greenhouse: {
        name: 'Abandoned Greenhouse',
        description: 'Shattered glass crunches underfoot. Dead plants hang like corpses from rusted hooks. A workbench holds forgotten tools. Something feels wrong here. The garden is south.',
        items: ['lantern', 'journal fragment'],
        clues: ['workbench', 'symbol'],
        exits: { south: 'garden' },
        discovered: false,
        draw: () => {
            if (loadedImages['greenhouse'] && loadedImages['greenhouse'].complete) {
                ctx.drawImage(loadedImages['greenhouse'], 0, 0, 800, 600);
            }
            drawRebecca(300, 480);
        }
    },
    
    sideyard: {
        name: 'Side Yard',
        description: 'Rotting barrels lean against the manor wall. A heavy cellar door is set into the ground, secured with an ornate lock. The entrance is west, the back yard is north.',
        items: [],
        clues: ['cellar door', 'barrels'],
        exits: { west: 'entrance', north: 'backyard' },
        discovered: false,
        draw: () => {
            if (loadedImages['sideyard'] && loadedImages['sideyard'].complete) {
                ctx.drawImage(loadedImages['sideyard'], 0, 0, 800, 600);
            }
            drawRebecca(280, 480);
        }
    },
    
    backyard: {
        name: 'Back Yard',
        description: 'An ancient well dominates the overgrown yard. The rope and bucket are still intact, hanging over the dark opening. A tool shed stands to the east. The side yard is south.',
        items: ['rope'],
        clues: ['well'],
        exits: { south: 'sideyard', east: 'shed' },
        discovered: false,
        draw: () => {
            if (loadedImages['backyard'] && loadedImages['backyard'].complete) {
                ctx.drawImage(loadedImages['backyard'], 0, 0, 800, 600);
            }
            drawRebecca(280, 480);
        }
    },
    
    shed: {
        name: 'Tool Shed',
        description: 'Cobwebs thick as curtains fill this cramped shed. Rusted tools line the walls. A locked chest sits in the corner, and there\'s writing scratched into the wood. The back yard is west.',
        items: ['crowbar'],
        clues: ['scratches', 'chest'],
        exits: { west: 'backyard' },
        discovered: false,
        draw: () => {
            if (loadedImages['shed'] && loadedImages['shed'].complete) {
                ctx.drawImage(loadedImages['shed'], 0, 0, 800, 600);
            }
            drawRebecca(360, 480);
        }
    },
    
    foyer: {
        name: 'Manor Foyer',
        description: 'The grand foyer is thick with dust. A sweeping staircase leads upward into darkness. Portrait paintings of the Ashwood family watch you with hollow eyes. Doors lead west to the library and east to the dining room.',
        items: [],
        clues: ['portraits', 'blood stain'],
        exits: { west: 'library', east: 'dining', north: 'upstairs', south: 'entrance' },
        discovered: false,
        needsLight: true,
        draw: () => {
            if (game.inventory.includes('lantern') && game.flags.lanternLit) {
                if (loadedImages['foyer'] && loadedImages['foyer'].complete) {
                    ctx.drawImage(loadedImages['foyer'], 0, 0, 800, 600);
                }
            } else {
                ctx.fillStyle = '#050505';
                ctx.fillRect(0, 0, 800, 600);
                ctx.fillStyle = colors.gray;
                ctx.font = '20px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText('It\'s too dark to see...', 400, 300);
            }
            drawRebecca(360, 500);
        }
    },
    
    library: {
        name: 'Library',
        description: 'Towering bookshelves reach into shadow. Most books have rotted away, but a few remain. A reading desk holds papers and what might be a journal. The foyer is east.',
        items: ['Ashwood diary'],
        clues: ['books', 'ritual diagram'],
        exits: { east: 'foyer' },
        discovered: false,
        needsLight: true,
        draw: () => {
            if (game.inventory.includes('lantern') && game.flags.lanternLit) {
                ctx.fillStyle = '#0a0a0a';
                ctx.fillRect(0, 0, 800, 600);
                
                ctx.fillStyle = '#2a1810';
                ctx.fillRect(50, 80, 200, 400);
                ctx.fillRect(550, 80, 200, 400);
            } else {
                ctx.fillStyle = '#050505';
                ctx.fillRect(0, 0, 800, 600);
                ctx.fillStyle = colors.gray;
                ctx.font = '20px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText('It\'s too dark to see...', 400, 300);
            }
            drawRebecca(360, 480);
        }
    },
    
    dining: {
        name: 'Dining Room',
        description: 'A long table is set for a feast that never happened. Candles burned down to nubs. Wine glasses still full. Five place settings... but six chairs. The foyer is west.',
        items: ['silver key'],
        clues: ['place settings', 'wine'],
        exits: { west: 'foyer' },
        discovered: false,
        needsLight: true,
        draw: () => {
            if (game.inventory.includes('lantern') && game.flags.lanternLit) {
                if (loadedImages['dining'] && loadedImages['dining'].complete) {
                    ctx.drawImage(loadedImages['dining'], 0, 0, 800, 600);
                }
            } else {
                ctx.fillStyle = '#050505';
                ctx.fillRect(0, 0, 800, 600);
                ctx.fillStyle = colors.gray;
                ctx.font = '20px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText('It\'s too dark to see...', 400, 300);
            }
            drawRebecca(320, 500);
        }
    },
    
    upstairs: {
        name: 'Upstairs Hallway',
        description: 'The upstairs hallway stretches into oppressive darkness. Doors line the walls, but they\'re all locked. A window at the end shows the night sky. Only the foyer lies south.',
        items: [],
        clues: ['window', 'locked doors'],
        exits: { south: 'foyer' },
        discovered: false,
        needsLight: true,
        draw: () => {
            if (game.inventory.includes('lantern') && game.flags.lanternLit) {
                if (loadedImages['upstairs'] && loadedImages['upstairs'].complete) {
                    ctx.drawImage(loadedImages['upstairs'], 0, 0, 800, 600);
                }
            } else {
                ctx.fillStyle = '#050505';
                ctx.fillRect(0, 0, 800, 600);
                ctx.fillStyle = colors.gray;
                ctx.font = '20px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText('It\'s too dark to see...', 400, 300);
            }
            drawRebecca(360, 500);
        }
    }
};

function addText(text, className = '') {
    const textArea = document.getElementById('textArea');
    const p = document.createElement('div');
    p.className = 'game-text ' + className;
    p.textContent = text;
    textArea.appendChild(p);
    textArea.scrollTop = textArea.scrollHeight;
}

function updateStatus() {
    const locName = game.currentLocation === 'intro' ? 'Start' : locations[game.currentLocation].name;
    document.getElementById('locationName').textContent = locName;
    document.getElementById('itemCount').textContent = game.inventory.length;
    document.getElementById('discoveryProgress').textContent = `${game.discoveries}/${game.totalDiscoveries}`;
}

function drawLocation() {
    locations[game.currentLocation].draw();
}

function processCommand(input) {
    const cmd = input.toLowerCase().trim();
    const words = cmd.split(' ');
    const verb = words[0];
    const noun = words.slice(1).join(' ');
    
    if (game.currentLocation === 'intro') {
        game.currentLocation = 'gate';
        drawLocation();
        addText('══════════════════════════════════════', 'important');
        addText('THE ASHWOOD MANOR INCIDENT', 'horror');
        addText('══════════════════════════════════════', 'important');
        addText('\nYou are Rebecca Chen, investigative journalist.');
        addText('Three months ago, the entire Ashwood family vanished overnight.');
        addText('Five people. No bodies. No evidence. No witnesses.');
        addText('The case went cold... until you received an anonymous letter:');
        addText('\n"The truth is in the cellar. Come alone. Bring light."', 'clue');
        addText('\nNow you stand before their abandoned estate.');
        addText('Type HELP for commands.\n');
        addText(locations[game.currentLocation].description);
        updateStatus();
        return;
    }
    
    addText(`> ${input}`, 'command');
    
    // Movement
    const directions = {
        'north': 'north', 'n': 'north',
        'south': 'south', 's': 'south',
        'east': 'east', 'e': 'east',
        'west': 'west', 'w': 'west'
    };
    
    if (directions[verb]) {
        const dir = directions[verb];
        const loc = locations[game.currentLocation];
        
        if (loc.exits[dir]) {
            const nextLoc = locations[loc.exits[dir]];
            
            // Check if need lantern for dark areas
            if (nextLoc.needsLight && (!game.inventory.includes('lantern') || !game.flags.lanternLit)) {
                if (dir === 'north' && game.currentLocation === 'entrance') {
                    addText('The manor doors are unlocked, but it\'s pitch black inside.', 'error');
                    addText('You need some kind of light source to explore safely.', 'error');
                    return;
                }
            }
            
            game.currentLocation = loc.exits[dir];
            
            // First visit to a room
            if (!game.visitedRooms.has(game.currentLocation)) {
                game.visitedRooms.add(game.currentLocation);
            }
            
            drawLocation();
            addText(nextLoc.description);
            updateStatus();
        } else {
            addText('You can\'t go that way.', 'error');
        }
        return;
    }
    
    // Look
    if (verb === 'look' || verb === 'l') {
        const loc = locations[game.currentLocation];
        addText(loc.description);
        
        if (loc.needsLight && (!game.inventory.includes('lantern') || !game.flags.lanternLit)) {
            addText('You can barely see anything in this darkness.', 'error');
            return;
        }
        
        if (loc.items && loc.items.length > 0) {
            addText(`\nYou can see: ${loc.items.join(', ')}`, 'important');
        }
        if (loc.clues && loc.clues.length > 0) {
            addText(`\nYou notice: ${loc.clues.join(', ')}`, 'clue');
        }
        return;
    }
    
    // Examine
    if (verb === 'examine' || verb === 'x' || verb === 'read') {
        const loc = locations[game.currentLocation];
        
        if (loc.needsLight && (!game.inventory.includes('lantern') || !game.flags.lanternLit)) {
            addText('It\'s too dark to examine anything.', 'error');
            return;
        }
        
        // Room-specific examinations
        if (game.currentLocation === 'gate' && noun.includes('inscription')) {
            addText('"ASHWOOD ESTATE - Founded 1847"', 'clue');
            addText('Below in smaller letters: "What we sow in darkness, we reap in blood."');
        }
        else if (game.currentLocation === 'entrance' && noun.includes('plaque')) {
            addText('A brass plaque reads:', 'clue');
            addText('"Victoria & Edmund Ashwood, and their children:"');
            addText('"Margaret (17), Thomas (14), Catherine (12)"');
            addText('That\'s only five... but the letter said five vanished...');
            if (!game.flags.discoveredFamily) {
                game.flags.discoveredFamily = true;
                game.discoveries++;
                addText('\n[Discovery 1/5: The Ashwood Family]', 'success');
                updateStatus();
            }
        }
        else if (game.currentLocation === 'garden' && noun.includes('fountain')) {
            addText('The fountain is dry, caked with dirt and dead leaves.', 'clue');
            addText('Wait... those aren\'t leaves. They\'re rose petals. Black roses.');
            addText('Someone left fresh black roses here. Recently.');
        }
        else if (game.currentLocation === 'greenhouse' && noun.includes('symbol')) {
            addText('Carved into the workbench is a strange symbol:', 'clue');
            addText('A circle with five points radiating outward.');
            addText('At each point: V, E, M, T, C');
            addText('The initials of the Ashwood family...');
        }
        else if (game.currentLocation === 'greenhouse' && noun.includes('workbench')) {
            addText('The workbench is covered in soil and dried... something dark.', 'clue');
            addText('Tools are arranged in a deliberate pattern around that symbol.');
        }
        else if (game.currentLocation === 'sideyard' && noun.includes('cellar')) {
            if (!game.flags.examinedCellar) {
                addText('The cellar door has an ornate silver lock.', 'clue');
                addText('Engraved on it: "Only light reveals truth."');
                game.flags.examinedCellar = true;
            }
            if (game.inventory.includes('lantern') && game.flags.lanternLit) {
                addText('Your lantern illuminates hidden grooves in the door...', 'clue');
                addText('They form words: "The sixth seat waits below."');
            }
        }
        else if (game.currentLocation === 'backyard' && noun.includes('well')) {
            addText('Peering into the well, you see only darkness.', 'clue');
            if (game.inventory.includes('lantern') && game.flags.lanternLit) {
                addText('Wait - your lantern reveals something at the bottom...');
                addText('It looks like... clothing? A child\'s dress?', 'horror');
            }
        }
        else if (game.currentLocation === 'shed' && noun.includes('scratches')) {
            addText('Scratched desperately into the wood:', 'horror');
            addText('"THEY TRIED TO BRING HER BACK"');
            addText('"THE RITUAL FAILED"');
            addText('"SHE TOOK THEM ALL"');
            if (!game.flags.discoveredRitual) {
                game.flags.discoveredRitual = true;
                game.discoveries++;
                addText('\n[Discovery 2/5: The Failed Ritual]', 'success');
                updateStatus();
            }
        }
        else if (game.currentLocation === 'shed' && noun.includes('chest')) {
            if (!game.inventory.includes('crowbar')) {
                addText('The chest is locked tight. You\'d need something to pry it open.');
            } else if (!game.flags.chestOpened) {
                addText('You force the chest open with the crowbar...');
                addText('Inside: old photographs of the family... with a sixth person.', 'horror');
                addText('A young girl, maybe 8 years old. All photos are torn.');
                addText('On the back of one: "Sarah - We\'re so sorry"');
                game.flags.chestOpened = true;
                if (!game.flags.discoveredSarah) {
                    game.flags.discoveredSarah = true;
                    game.discoveries++;
                    addText('\n[Discovery 3/5: The Lost Daughter]', 'success');
                    updateStatus();
                }
            }
        }
        else if (game.currentLocation === 'foyer' && noun.includes('portraits')) {
            addText('Five portraits: Victoria, Edmund, Margaret, Thomas, Catherine.', 'clue');
            addText('All their eyes have been scratched out.');
            addText('There\'s a lighter rectangle on the wall... a sixth portrait was removed.');
        }
        else if (game.currentLocation === 'foyer' && (noun.includes('blood') || noun.includes('stain'))) {
            addText('At the base of the staircase, a dark stain.', 'horror');
            if (game.inventory.includes('lantern') && game.flags.lanternLit) {
                addText('The stain forms a pattern... like small handprints.');
                addText('A child\'s handprints. Leading down to the cellar door.');
            }
        }
        else if (game.currentLocation === 'library' && (noun.includes('ritual') || noun.includes('diagram'))) {
            addText('A diagram shows a ritual circle with five points.', 'horror');
            addText('"Resurrection Ritual - Five souls to bring back one"');
            addText('The word "FAILED" is written across it in what looks like blood.');
        }
        else if (game.currentLocation === 'dining' && noun.includes('place settings')) {
            addText('Five place settings. Five names written on cards:', 'clue');
            addText('Victoria, Edmund, Margaret, Thomas, Catherine');
            addText('But there\'s a sixth chair... with no place setting.');
            addText('Carved into the table by that chair: "SARAH"', 'horror');
        }
        else if (game.currentLocation === 'dining' && noun.includes('wine')) {
            addText('The wine in all five glasses is untouched.', 'clue');
            addText('You smell it - not wine. Something chemical. Bitter.');
            addText('They never drank it. The ritual took them before they could.');
        }
        else if (noun.includes('diary') && game.inventory.includes('Ashwood diary')) {
            addText('═══════════════════════════════════', 'horror');
            addText('DIARY OF VICTORIA ASHWOOD');
            addText('═══════════════════════════════════', 'horror');
            addText('\n[Final Entry - March 15th]');
            addText('"We\'ve found it. The ritual to bring Sarah back."', 'clue');
            addText('"The book says we need five willing souls."');
            addText('"Edmund says we\'ll do it tonight. All of us together."');
            addText('"Sarah will forgive us. She has to."');
            addText('"The cellar is prepared. The circle is drawn."');
            addText('"By tomorrow, we\'ll be a family of six again."');
            addText('\n[No further entries]', 'horror');
            if (!game.flags.discoveredDiary) {
                game.flags.discoveredDiary = true;
                game.discoveries++;
                addText('\n[Discovery 4/5: The Mother\'s Confession]', 'success');
                updateStatus();
            }
        }
        else if (noun.includes('fragment') && game.inventory.includes('journal fragment')) {
            addText('A torn page from a child\'s diary:', 'horror');
            addText('"Mommy says I\'m going away tomorrow."');
            addText('"I don\'t want to go to the hospital again."');
            addText('"The treatments hurt. Please God make me better."');
            addText('"I\'m scared."');
            addText('\n- Sarah, age 8');
        }
        else {
            addText('You don\'t see anything special about that.', 'error');
        }
        return;
    }
    
    // Inventory
    if (verb === 'inventory' || verb === 'i') {
        if (game.inventory.length === 0) {
            addText('You aren\'t carrying anything.');
        } else {
            addText(`You are carrying: ${game.inventory.join(', ')}`, 'important');
        }
        return;
    }
    
    // Take
    if (verb === 'take' || verb === 'get' || verb === 'pick') {
        const loc = locations[game.currentLocation];
        
        if (loc.needsLight && (!game.inventory.includes('lantern') || !game.flags.lanternLit)) {
            addText('It\'s too dark to find anything.', 'error');
            return;
        }
        
        const itemName = noun.replace('up ', '').replace('the ', '');
        
        if (loc.items && loc.items.some(item => item.toLowerCase().includes(itemName))) {
            const actualItem = loc.items.find(item => item.toLowerCase().includes(itemName));
            loc.items = loc.items.filter(item => item !== actualItem);
            game.inventory.push(actualItem);
            addText(`You take the ${actualItem}.`, 'success');
            drawLocation();
            updateStatus();
        } else {
            addText(`There is no ${itemName} here.`, 'error');
        }
        return;
    }
    
    // Use
    if (verb === 'use' || verb === 'light') {
        if (noun.includes('lantern')) {
            if (!game.inventory.includes('lantern')) {
                addText('You don\'t have a lantern.', 'error');
            } else if (!game.flags.lanternLit) {
                addText('You light the lantern. Its warm glow pushes back the darkness.', 'success');
                game.flags.lanternLit = true;
                drawLocation();
            } else {
                addText('The lantern is already lit.');
            }
        }
        else if (noun.includes('silver key') || noun.includes('key')) {
            if (!game.inventory.includes('silver key')) {
                addText('You don\'t have the silver key.', 'error');
            } else if (game.currentLocation !== 'sideyard') {
                addText('There\'s nothing to unlock here.', 'error');
            } else if (!game.inventory.includes('lantern') || !game.flags.lanternLit) {
                addText('The lock won\'t turn. The engraving said "Only light reveals truth"...', 'error');
                addText('You need light to open this.', 'error');
            } else if (game.discoveries < 4) {
                addText('You insert the key, but it won\'t turn completely.', 'error');
                addText('You feel like you\'re missing something important...', 'error');
                addText('The truth of what happened here must be uncovered first.', 'clue');
            } else {
                addText('\n═══════════════════════════════════════', 'horror');
                addText('You turn the silver key in the lock.');
                addText('The cellar door creaks open, revealing stone steps descending into darkness.');
                addText('\nYour lantern illuminates the cellar...');
                addText('\nAt the center: a ritual circle. Five candles, burned out.');
                addText('Five bodies lie in the circle, perfectly preserved.');
                addText('The Ashwood family. Holding hands. Eyes closed.');
                addText('\nAnd in the center of the circle...');
                addText('A small chair. Child-sized.');
                addText('Empty.', 'horror');
                addText('\nOn the floor, written in ash:');
                addText('"SARAH FORGAVE NO ONE"', 'horror');
                addText('\n[Discovery 5/5: The Truth]', 'success');
                addText('\nYou\'ve uncovered the full story of Ashwood Manor.');
                addText('The family tried to resurrect their daughter Sarah.');
                addText('But the ritual didn\'t bring her back...');
                addText('It let something else take them instead.');
                addText('\n═══════════════════════════════════════', 'horror');
                addText('\n🏆 CASE SOLVED 🏆', 'success');
                game.flags.solved = true;
                game.discoveries = 5;
                updateStatus();
            }
        }
        else if (noun.includes('crowbar')) {
            if (game.currentLocation === 'shed' && !game.flags.chestOpened) {
                processCommand('examine chest');
            } else {
                addText('There\'s nothing to pry open here.', 'error');
            }
        }
        else {
            addText('You can\'t use that here.', 'error');
        }
        return;
    }
    
    // Help
    if (verb === 'help' || verb === 'h') {
        addText('\n═══ COMMANDS ═══', 'important');
        addText('Movement: north/n, south/s, east/e, west/w');
        addText('Actions: look/l, take [item], use [item]');
        addText('Investigation: examine/x [thing], read [thing]');
        addText('Other: inventory/i, help/h');
        addText('\n═══ OBJECTIVE ═══', 'important');
        addText('Investigate Ashwood Manor.');
        addText('Uncover the truth about the family\'s disappearance.');
        addText('Find discoveries to unlock the cellar.');
        return;
    }
    
    addText('I don\'t understand that command. Type HELP for commands.', 'error');
}

document.getElementById('commandInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = e.target.value;
        if (input.trim()) {
            processCommand(input);
            e.target.value = '';
        }
    }
});

function initGame() {
    drawLocation();
    addText('Press ENTER to start...', 'help-text');
    updateStatus();
}

initGame();
