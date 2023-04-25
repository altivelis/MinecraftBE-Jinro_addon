import * as mc from '@minecraft/server';
import * as ui from '@minecraft/server-ui';
import { runCommand, runPlayer, runWorld } from './runCommand';
import { getScore } from './score';
import { initDynamicProperties } from './index';
/**
 * 
 * @param {import('@minecraft/server').EntityQueryOptions} option 
 * @returns Player[]
 */
export function getPlayerList(option){
    let players = mc.world.getPlayers(option);
    return Array.from(players);
}

const form_system = new ui.ActionFormData()
    .title("設定")
    .button("§0§l初期設定","textures/items/banner_pattern")
    .button("§2§l役職配分","textures/ui/bad_omen_effect")
    .button("§8§lゲーム設定","textures/ui/automation_glyph_color")
    .button("§3§lハンデ設定","textures/gui/newgui/mob_effects/slowness_effect")
    .button("§5§lゲームスタート","textures/ui/icon_book_writable");

const form_role = new ui.ModalFormData()
    .title("役職設定")
    .slider("人狼",1,10,1,1)
    .slider("狂人",0,10,1,1)
    .slider("霊媒師",0,10,1,0)
    .slider("占い師",0,10,1,1);
    
export async function f_systemConsole(player){
    let result = await form_system.show(player);
    if(result.canceled) return;
    switch(result.selection){
        case 0:f_initializeOption(player);
            break;
        case 1:f_setRole(player);
            break;
        case 2:f_gameOption(player);
            break;
        case 3:f_setHandi(player);
            break;
        case 4:f_startGame(player);
            break;
    }
}

function f_initializeOption(player){
    initDynamicProperties();
    runPlayer(player,`function init`);
    runPlayer(player,`give @s altivelis:marker_white 1`);
    runPlayer(player,`give @s altivelis:marker_red 1`);
    player.sendMessage("「marker_white」§2:ロビーに1つ設置してください。\n(2つ以上置けないようになっています)\n§f「§cmarker_red§f」§2:ゲーム開始地点に人数分設置してください。");

}

async function f_setRole(player){
    let result = await form_role.show(player);
    if(result.canceled) return;
    runCommand(`scoreboard players set "人狼" roleList ${result.formValues[0]}`);
    runCommand(`scoreboard players set "狂人" roleList ${result.formValues[1]}`);
    runCommand(`scoreboard players set "霊媒師" roleList ${result.formValues[2]}`);
    runCommand(`scoreboard players set "占い師" roleList ${result.formValues[3]}`);
}

async function f_gameOption(player){
    const form_option = new ui.ModalFormData()
        .title("ゲーム設定")
        .toggle("人狼の相互認識",mc.world.getDynamicProperty("wolf_knows_each_other"))
        .slider("矢のクールダウン",0,120,1,mc.world.getDynamicProperty("arrow_cooldown"))
        .slider("矢のクールダウン（ハンデ設定）",0,120,1,mc.world.getDynamicProperty("arrow_handi_cooldown"))
        .slider("ヒット時のクールダウン",10,180,5,mc.world.getDynamicProperty("arrow_hit_cooldown"))
        .slider("エメラルド配布間隔",10,600,10,mc.world.getDynamicProperty("coin_cooldown"))
        .slider("エメラルド配布個数",1,20,1,mc.world.getDynamicProperty("num_of_coin"))
        .slider("人狼の追加配布エメラルド",0,20,1,mc.world.getDynamicProperty("wolf_coin"))
        .toggle("自然回復",mc.world.getDynamicProperty("naturalregeneration"))
        .toggle("溺死ダメージ",mc.world.getDynamicProperty("drowningdamage"))
        .toggle("落下ダメージ",mc.world.getDynamicProperty("falldamage"));

    let result = await form_option.show(player);
    if(result.canceled) return;
    mc.world.setDynamicProperty("wolf_knows_each_other",result.formValues[0]);
    mc.world.setDynamicProperty("arrow_cooldown",result.formValues[1]);
    mc.world.setDynamicProperty("arrow_handi_cooldown",result.formValues[2]);
    mc.world.setDynamicProperty("arrow_hit_cooldown",result.formValues[3]);
    mc.world.setDynamicProperty("coin_cooldown",result.formValues[4]);
    mc.world.setDynamicProperty("num_of_coin",result.formValues[5]);
    mc.world.setDynamicProperty("wolf_coin",result.formValues[6]);
    mc.world.setDynamicProperty("naturalregeneration",result.formValues[7]);
    mc.world.setDynamicProperty("drowningdamage",result.formValues[8]);
    mc.world.setDynamicProperty("falldamage",result.formValues[9]);
    runCommand(`tellraw @a {"rawtext":[{"text":"§b～～ゲーム設定～～"}]}`);
    runCommand(`tellraw @a {"rawtext":[{"text":"・人狼の相互認識:${result.formValues[0].toString()}"}]}`);
    runCommand(`tellraw @a {"rawtext":[{"text":"・矢のクールダウン:${result.formValues[1]}"}]}`);
    runCommand(`tellraw @a {"rawtext":[{"text":"・矢のクールダウン（ハンデ設定）:${result.formValues[2]}"}]}`);
    runCommand(`tellraw @a {"rawtext":[{"text":"・ヒット時のクールダウン:${result.formValues[3]}"}]}`);
    runCommand(`tellraw @a {"rawtext":[{"text":"・エメラルド配布間隔:${result.formValues[4]}"}]}`);
    runCommand(`tellraw @a {"rawtext":[{"text":"・エメラルド配布個数:${result.formValues[5]}"}]}`);
    runCommand(`tellraw @a {"rawtext":[{"text":"・人狼の追加配布エメラルド:${result.formValues[6]}"}]}`);
    runCommand(`tellraw @a {"rawtext":[{"text":"・自然回復:${result.formValues[7].toString()}"}]}`);
    runCommand(`gamerule naturalregeneration ${result.formValues[7].toString()}`);
    runCommand(`tellraw @a {"rawtext":[{"text":"・溺死ダメージ:${result.formValues[8].toString()}"}]}`);
    runCommand(`gamerule drowningdamage ${result.formValues[8].toString()}`);
    runCommand(`tellraw @a {"rawtext":[{"text":"・落下ダメージ:${result.formValues[9].toString()}"}]}`);
    runCommand(`gamerule falldamage ${result.formValues[9].toString()}`);
    setGameOptionFromProperties();
}

export function setGameOptionFromProperties(){
    runCommand(`scoreboard players set wolf_knows_each_other system ${mc.world.getDynamicProperty("wolf_knows_each_other")?1:0}`);
    runCommand(`scoreboard players set arrow_cooldown system ${mc.world.getDynamicProperty("arrow_cooldown")}`);
    runCommand(`scoreboard players set arrow_handi_cooldown system ${mc.world.getDynamicProperty("arrow_handi_cooldown")}`);
    runCommand(`scoreboard players set arrow_hit_cooldown system ${mc.world.getDynamicProperty("arrow_hit_cooldown")}`);
    runCommand(`scoreboard players set coin_cooldown system ${mc.world.getDynamicProperty("coin_cooldown")}`);
    runCommand(`scoreboard players set num_of_coin system ${mc.world.getDynamicProperty("num_of_coin")}`);
    runCommand(`scoreboard players set wolf_coin system ${mc.world.getDynamicProperty("wolf_coin")}`);
}

async function f_setHandi(player){
    let form = new ui.ModalFormData().title("ハンデ設定")
    const playerList = mc.world.getAllPlayers();
    for(const p of playerList){
        form.slider(p.nameTag,0,0,0)
        .toggle("矢の弱体化",p.hasTag("handi1"))
        .toggle("矢のクールダウン増加",p.hasTag("handi2"))
        .toggle("キルクールダウン",p.hasTag("handi3"));
    }
    const result = await form.show(player);
    if(result.canceled)return;
    for(let i=0; i<result.formValues.length; i++){
        const target=playerList[index/4];
        const value = result.formValues[i];
        switch(i%4){
            case 0:break;
            case 1:
                if(value){
                    if(!target.hasTag("handi1"))target.addTag("handi1");
                    target.sendMessage("§b[ハンデ]§e「矢の弱体化」§b:有効");
                }else{
                    if(target.hasTag("handi1"))target.removeTag("handi1");
                    target.sendMessage("§b[ハンデ]§e「矢の弱体化」§3:無効");
                }
                break;
            case 2:
                if(value){
                    if(!target.hasTag("handi2"))target.addTag("handi2");
                    target.sendMessage("§b[ハンデ]§e「矢のクールダウン増加」§b:有効");
                }else{
                    if(target.hasTag("handi2"))target.removeTag("handi2");
                    target.sendMessage("§b[ハンデ]§e「矢のクールダウン増加」§3:無効");
                }
                break;
            case 3:
                if(value){
                    if(!target.hasTag("handi3"))target.addTag("handi3");
                    target.sendMessage("§b[ハンデ]§e「キルクールダウン」§b:有効");
                }else{
                    if(target.hasTag("handi3"))target.removeTag("handi3");
                    target.sendMessage("§b[ハンデ]§e「キルクールダウン」§3:無効");
                }
                break;
        }
    }
}

async function f_startGame(player){
    if(getScore("市民","roleList")<0){
        runPlayer(player,`tellraw @s {"rawtext":[{"text":"§4[Warning!]§l§c役職に対して人数が足りていません!"}]}`);
        return;
    }
    if(Array.from(player.dimension.getEntities({type:"altivelis:marker",tags:["red"]})).length < getPlayerList({excludeTags:["spec"]}).length){
        runPlayer(player,`tellraw @s {"rawtext":[{"text":"§4[Warning!]§l§c赤マーカーの数が足りません!"}]}`);
        return;
    }
    if(Array.from(player.dimension.getEntities({type:"altivelis:marker",tags:["white"]})).length < 1){
        runPlayer(player,`tellraw @s {"rawtext":[{"text":"§4[Warning!]§l§c白マーカーがありません!"}]}`);
        return;
    }
    runPlayer(player,`function gameStart`)
}