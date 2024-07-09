import * as mc from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import { breakGlass, getGlass, repairGlass } from "./glassBreak";
import { roleBook } from "./roleBook";
import { runCommand, runPlayer, runWorld } from "./runCommand";
import { getScore } from "./score";
import { f_systemConsole, getPlayerList, setGameOptionFromProperties } from "./system";
import { uranaiForm } from "./uranai";
import "./killlog";
import { f_help_uranai } from "./roleBook";
import "./spectator"

export function initDynamicProperties(){
    mc.world.setDynamicProperty("wolf_knows_each_other",true);
    mc.world.setDynamicProperty("arrow_cooldown",1);
    mc.world.setDynamicProperty("arrow_handi_cooldown",5);
    mc.world.setDynamicProperty("arrow_hit_cooldown",10);
    mc.world.setDynamicProperty("coin_cooldown",120);
    mc.world.setDynamicProperty("num_of_coin",1);
    mc.world.setDynamicProperty("wolf_coin",0);
    mc.world.setDynamicProperty("naturalregeneration",true);
    mc.world.setDynamicProperty("drowningdamage",true);
    mc.world.setDynamicProperty("falldamage",true);
    setGameOptionFromProperties();
}

const allowDropList=[
    "minecraft:emerald",
    "altivelis:death_splash",
    "altivelis:stun_grenade",
    "altivelis:speed_potion",
    "altivelis:clairvoyance",
    "altivelis:bell"
]

mc.world.afterEvents.entityHurt.subscribe(data=>{
    let hurter = data.hurtEntity;
    let health = hurter.getComponent(mc.EntityHealthComponent.componentId).currentValue;
    if(health<=0.0){
        hurter.addTag("death");
        let role = getScore(hurter,"role");
        if(role){
            if(role==1){
                runPlayer(hurter,`summon altivelis:dead_body ~~~~~ wolf ${hurter.nameTag}`);
            }else{
                runPlayer(hurter,`summon altivelis:dead_body ~~~~~ human ${hurter.nameTag}`);
            }
        }
        const inv = hurter.getComponent(mc.EntityInventoryComponent.componentId).container;
        for(let i=0,n=0;i<inv.size||n==inv.size-inv.emptySlotsCount-1;i++){
            let item = inv.getItem(i);
            if(item==undefined) continue;
            if(allowDropList.includes(item.typeId)){
                hurter.dimension.spawnItem(item,hurter.location);
            }
            n++;
        }
        let player = mc.world.getPlayers({name:hurter.nameTag});
        player[0].onScreenDisplay.setTitle("§4あなたは死亡しました",{
            fadeInDuration:0,
            fadeOutDuration:20,
            stayDuration:60,
            subtitle:"§cミュートしてください"
        });
        hurter.sendMessage("§7霊界チャットが有効になりました。観戦者同士で会話ができます。\n「.tp」でプレイヤーへテレポート、「!」を先頭につけると全体にチャットできます。");
    }
},
{entityTypes:["minecraft:player"]});

mc.world.afterEvents.itemUse.subscribe(data=>{
    let {itemStack:item, source} = data;
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

mc.world.afterEvents.projectileHitBlock.subscribe(data=>{
    const {dimension, location, projectile} = data;
    const blockHit = data.getBlockHit();
    if(projectile.typeId=="minecraft:arrow"){
        let block=blockHit.block;
        if(getGlass(block)){
            breakGlass(block);
            projectile.kill();
        }
    }
    else if(projectile.typeId=="altivelis:death_potion"){
        projectile.kill();
        let block;
        switch(blockHit.face){
            case "Down": block=blockHit.block.below(); break;
            case "East": block=blockHit.block.east(); break;
            case "North": block=blockHit.block.north(); break;
            case "South": block=blockHit.block.south(); break;
            case "Up": block=blockHit.block.above(); break;
            case "West": block=blockHit.block.west(); break;
        }
        dimension.createExplosion(block.location,3,{allowUnderwater:false,breaksBlocks:false,causesFire:false,source:projectile});
    }
})

mc.world.afterEvents.projectileHitEntity.subscribe(data=>{
    const {dimension, location, projectile, source} = data;
    const entityHit = data.getEntityHit();
    let hurter = entityHit.entity;
    if(hurter.typeId=="minecraft:player" && source.typeId=="minecraft:player" && projectile.typeId=="minecraft:arrow"){
        source.playSound("random.orb",{location:source.location,pitch:1,volume:1});
        if(hurter.getComponent(mc.EntityHealthComponent.componentId).current<=0)source.addTag("hit");
    }
    else if(projectile.typeId=="altivelis:death_potion"){
        projectile.kill();
        dimension.createExplosion(location,3,{allowUnderwater:false,breaksBlocks:false,causesFire:false,source:projectile});
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

mc.system.afterEvents.scriptEventReceive.subscribe(async data=>{
    const {id,sourceEntity,message} = data;
    switch(id){
        case "altivelis:repair":repairGlass(sourceEntity.dimension);break;
        case "altivelis:init":initDynamicProperties();break;
        case "altivelis:coin":giveEmerald();break;
        case "altivelis:gameend":
            for(const player of mc.world.getAllPlayers()){
                if(player.isOp()){
                    const inv = player.getComponent(mc.EntityInventoryComponent.componentId).container;
                    let item = new mc.ItemStack("altivelis:console");
                    item.lockMode=mc.ItemLockMode.inventory;
                    inv.addItem(item);
                }
            }
            break;
        case "altivelis:medium":
            const entity = Array.from(sourceEntity.dimension.getEntities({tags:["medium"],type:"altivelis:dead_body"}))[0];
            const name = entity.nameTag;
            let text = "";
            if(entity.hasTag("wolf")){
                text=`§b${name}§3は§4人狼です`;
            }
            else if(entity.hasTag("human")){
                text=`§b${name}§3は§a人狼ではありません`;
            }
            const result_form = new ui.MessageFormData()
                .title("§3霊媒結果")
                .body(text)
                .button1("ヘルプ:霊媒結果について")
                .button2("OK");
            while(1){
                const res2 = await result_form.show(sourceEntity);
                if(res2.canceled || res2.selection==0)return;
                const res3 = await f_help_uranai.show(sourceEntity);
                if(res3.canceled) return;
            }
            break;
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

mc.world.afterEvents.playerSpawn.subscribe(data=>{
    const {initialSpawn,player} = data;
    if(initialSpawn && getScore("test","status")==1){
        player.addTag("spec");
    }
})

mc.world.afterEvents.playerInteractWithEntity.subscribe(async data=>{
    const {itemStack, player, target} = data;
    if(target.typeId == "altivelis:dead_body"){
        if(!target.hasTag("found")){
            mc.world.sendMessage(`§c${target.nameTag}§3の遺体を§b${player.nameTag}§3が発見した`);
            target.addTag("found");
        }
        if(itemStack?.typeId == "altivelis:ohuda"){
            player.getComponent(mc.EntityInventoryComponent.componentId).container.setItem(player.selectedSlotIndex);
            let medium_form = new ui.MessageFormData()
                .title("§l§3霊媒結果")
                .button2("ヘルプ:霊媒結果について")
                .button1("OK")
                .body(target.hasTag("wolf")?`§b${target.nameTag}§dは§4人狼です`:
                    target.hasTag("human")?`§b${target.nameTag}§dは§a人狼ではありません`:
                    "エラー");
            while(1){
                const res = await medium_form.show(player);
                if(res.canceled || res.selection==0) return;
                const res2 = await f_help_uranai.show(player);
                if(res2.canceled) return;
            }
        }
    }
})

//デバッグを開始
//"/script debugger connect localhost 19144"