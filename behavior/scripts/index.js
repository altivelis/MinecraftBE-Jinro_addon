import * as mc from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import { breakGlass, getGlass, repairGlass } from "./glassBreak";
import { roleBook } from "./roleBook";
import { runCommand, runPlayer, runWorld } from "./runCommand";
import { getScore } from "./score";
import { f_systemConsole, getPlayerList, setGameOptionFromProperties } from "./system";
import { uranaiForm } from "./uranai";

mc.world.events.worldInitialize.subscribe((data)=>{
    let def = new mc.DynamicPropertiesDefinition();
    def.defineBoolean("wolf_knows_each_other");
    def.defineNumber("arrow_cooldown");
    def.defineNumber("arrow_handi_cooldown");
    def.defineNumber("arrow_hit_cooldown");
    def.defineNumber("coin_cooldown");
    def.defineNumber("num_of_coin");
    def.defineNumber("wolf_coin");
    def.defineBoolean("naturalregeneration");
    def.defineBoolean("drowningdamage");
    def.defineBoolean("falldamage");
    data.propertyRegistry.registerWorldDynamicProperties(def);
    runCommand(`scoreboard objectives add system dummy`);
    setGameOptionFromProperties();
})

export function initDynamicProperties(){
    mc.world.setDynamicProperty("wolf_knows_each_other",true);
    mc.world.setDynamicProperty("arrow_cooldown",1);
    mc.world.setDynamicProperty("arrow_handi_cooldown",5);
    mc.world.setDynamicProperty("arrow_hit_cooldown",30);
    mc.world.setDynamicProperty("coin_cooldown",120);
    mc.world.setDynamicProperty("num_of_coin",1);
    mc.world.setDynamicProperty("wolf_coin",0);
    mc.world.setDynamicProperty("naturalregeneration",true);
    mc.world.setDynamicProperty("drowningdamage",true);
    mc.world.setDynamicProperty("falldamage",true);
    runCommand(`gamerule naturalregeneration true`);
    runCommand(`gamerule drowningdamage true`);
    runCommand(`gamerule falldamage true`);
    setGameOptionFromProperties();
}

const arrowDropList=[
    "minecraft:emerald",
    "altivelis:death_splash",
    "altivelis:stun_grenade",
    "altivelis:speed_potion",
    "altivelis:clairvoyance"
]
mc.world.events.entityHurt.subscribe(data=>{
    let hurter = data.hurtEntity;
    let health = hurter.getComponent("health").current;
    if(health<=0.0){
        runPlayer(hurter,`tag @s add death`);
        let role = getScore(hurter,"role");
        if(role){
            if(role==1){
                runPlayer(hurter,`summon altivelis:dead_body ~~~ wolf ${hurter.nameTag}`);
            }else{
                runPlayer(hurter,`summon altivelis:dead_body ~~~ human ${hurter.nameTag}`);
            }
        }
        const inv = hurter.getComponent("inventory").container;
        for(let i=0,n=0;i<inv.size||n==inv.size-inv.emptySlotsCount-1;i++){
            let item = inv.getItem(i);
            if(item==undefined) continue;
            if(arrowDropList.includes(item.typeId)){
                hurter.dimension.spawnItem(item,hurter.location);
            }
            n++;
        }
        hurter.onScreenDisplay.setTitle("§4あなたは死亡しました",{
            fadeInSeconds:0,
            fadeOutSeconds:1,
            staySeconds:3,
            subtitle:"§cミュートしてください"
        });
    }
},
{entityTypes:["minecraft:player"]});

mc.world.events.itemUse.subscribe(data=>{
    let {item, source} = data;
    if(source.typeId!="minecraft:player") return;
    switch(item.typeId){
        case "altivelis:crystal": uranaiForm(source);
            break;
        case "altivelis:magicbook":
            runPlayer(source,`tellraw @s {"rawtext":[{"text":"§2人狼の1人は§c "},{"selector":"@r[scores={role=1},tag=!death]"},{"text":"§2です"}]}`);
            runPlayer(source,`replaceitem entity @s slot.weapon.mainhand 0 air 1 0`);
            break;
        case "altivelis:console": if(source.isOp()) f_systemConsole(source);
            else source.sendMessage("§4このアイテムを使うには管理者権限が必要です");
            break;
        case "altivelis:role_book": roleBook(source);
            break;
    }
})

mc.world.events.projectileHit.subscribe(data=>{
    const blockHit=data.getBlockHit(), entityHit=data.getEntityHit();
    if(blockHit){
        if(data.projectile.typeId=="minecraft:arrow"){
            let block = blockHit.block;
            if(getGlass(block)){
                breakGlass(block);
                data.projectile.kill();
            }
        }
        
    }else if(entityHit){
        let hurter = entityHit.entity;
        let source = data.source;
        if(hurter.typeId=="minecraft:player" && source.typeId=="minecraft:player" && data.projectile.typeId=="minecraft:arrow"){
            source.playSound("random.orb",{location:source.location,pitch:1,volume:1});
            source.addTag("hit");
        }
    }else{

    }
})

mc.world.events.dataDrivenEntityTriggerEvent.subscribe(data=>{
    let {entity,id} = data;
    if(entity.typeId!="minecraft:player") return;
    switch(id){
        case "repair": repairGlass(entity.dimension);
            break;
        case "coin": 
            let coin = mc.world.getDynamicProperty("num_of_coin");
            let wolf_coin = mc.world.getDynamicProperty("wolf_coin");
            if(coin>0) runPlayer(entity,`give @s minecraft:emerald ${coin} 0`)
            if(wolf_coin>0) runPlayer(entity,`give @s[scores={role=1}] minecraft:emerald ${wolf_coin}`)
            break;
        case "gameEnd":
            if(entity.isOp()) runPlayer(entity,`give @s altivelis:console`);
            break;
    }
})

mc.system.runInterval(()=>{
    const alivePlayerList = getPlayerList({excludeTags:["spec","death"]});
    for(let alive of alivePlayerList){
        let cooldown = getScore(alive,"cooldown");
        let max = getScore(alive,"cooldown_max");
        if(cooldown == null || max == null) break;
        if(cooldown>0){
            let current = Math.ceil(30.0 * (cooldown/max));
            runPlayer(alive,`title @s actionbar §l§a${"/".repeat(current)}§f${"/".repeat(30-current)}§a${(cooldown/20.0).toFixed(1)}`);
        }else{
            runPlayer(alive,`title @s actionbar §l§a矢のチャージ完了`);
        }
    }

    const smokeList = Array.from(mc.world.getDimension("overworld").getEntities({type:"altivelis:marker",tags:["smoke"]}))
    for(let smoke of smokeList){
        let time = getScore(smoke,"smoke");
        if(time==null) continue;
        if(time%8==0){
            runPlayer(smoke,`function smoke`);
        }
    }
})

mc.system.events.scriptEventReceive.subscribe(data=>{
    const {id,sourceEntity} = data;
    switch(id){
        case "altivelis:repair":repairGlass(sourceEntity.dimension);break;
        case "altivelis:init":initDynamicProperties();break;
        case "altivelis:coin":giveEmerald();break;
    }
})

function giveEmerald(){
    let coin = mc.world.getDynamicProperty("num_of_coin");
    let wolf_coin = mc.world.getDynamicProperty("wolf_coin");
    if(coin>0){
        for(const player of mc.world.getPlayers({excludeTags:["spec","death"]})){
            const inv = player.getComponent(mc.EntityInventoryComponent.componentId).container;
            inv.addItem(new mc.ItemStack(mc.MinecraftItemTypes.emerald,coin));
        }
        mc.world.sendMessage(`§l§a[全員配布]§rエメラルドが${coin}個配られました`);
    }
    if(wolf_coin>0){
        for(const wolf of mc.world.getPlayers({excludeTags:["spec","death"],scoreOptions:[{objective:"role",maxScore:1,minScore:1}]})){
            const inv = wolf.getComponent(mc.EntityInventoryComponent.componentId).container;
            inv.addItem(new mc.ItemStack(mc.MinecraftItemTypes.emerald,wolf_coin));
            wolf.sendMessage(`§l§c[人狼限定]§rエメラルドが${wolf_coin}個配られました。`);
            wolf.sendMessage(`§l§4[注意!]§c市民よりエメラルドが多いことを悟られないでください!`);
        }
    }
}

//デバッグを開始
//"/script debugger connect localhost 19144"