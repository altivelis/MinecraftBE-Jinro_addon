import * as mc from '@minecraft/server';
import * as ui from '@minecraft/server-ui';
import { runPlayer } from './runCommand';
import { getScore } from './score';
import { getPlayerList } from './system';
import { itemList } from './itemList';

/**
 * メニューを出す
 * @param {import('@minecraft/server').Player} player 
 * @returns 
 */
export async function roleBook(player){
    let form = new ui.ActionFormData().title("メニュー")
        .button("§5§l役職確認")
        .button("§2§lショップ");
    const role = getScore(player,"role");/*
    if(role){
        switch(role){
            case 1:form.button("§4§l人狼専用ショップ");break;
            case 2:form.button("§8§l狂人専用ショップ");break;
            case 4:form.button("§3§l霊媒師専用ショップ");break;
            case 5:form.button("§5§l占い師専用ショップ");break;
        }
    }*/
    
    const result = await form.show(player);
    if(result.canceled) return;
    switch(result.selection){
        case 0:
            form_check_role(player);
            break;
        case 1:
            form_shop(player);
            break;
    }
}

async function form_check_role(player){
    let form = new ui.MessageFormData().title("役職確認");
    let body = "";
    const role = getScore(player,"role");
    switch(role){
        case 1:
            body += "あなたの役職は『§4人狼§r』\n";
            if(mc.world.getDynamicProperty("wolf_knows_each_other")){
                let wolfs = getPlayerList({scoreOptions:[{objective:"role",minScore:1,maxScore:1}],excludeNames:[player.nameTag]});
                if(wolfs.length>0){
                    body += "\n仲間の人狼\n"
                    for(let wolf of wolfs){
                        body += `・§b${wolf.nameTag}\n`
                    }
                }
            }
            body += "\n§e能力\n§7特にありません\n"
            body += "\n§a勝利条件\n§r市民陣営を全滅させること。\n人狼専用のアイテムを駆使して市民陣営を全滅させましょう。\n";
            body += "\n§bアドバイス\n§r仲間である狂人は最初は誰なのかわかりません。必ず狂人からアピールがあるはずなので見逃さないようにしましょう。\n（例:人狼に対して「人狼でない」と発言している占い師は狂人である可能性が高いです。）\n";
            break;
        case 2:
            body += "あなたの役職は『§7狂人§r』\n";
            body += "\n§e能力\n§r『§d魔導書§r』を使うことで人狼を1人知ることができます。\n"
            body += "\n§a勝利条件\n§r市民陣営を全滅させること。\n人狼は誰なのかはわかりませんが、うまく手を組んで市民陣営を全滅させましょう。\n";
            body += "\n§bアドバイス§r\nまずは自分が占い師だと嘘をつき、上手く人狼に対して「人狼でない」と言うことで人狼の協力を得ましょう。\n";
            break;
        case 3:
            body += "あなたの役職は『§3市民§r』\n";
            body += "\n§e能力\n§7特にありません\n";
            body += "\n§a勝利条件\n§r人狼を全滅させること。\nみんなで協力して人狼を倒しましょう。\n";
            body += "\n§bアドバイス\n§rエメラルドは信用できる役職持ちに託すことで情報を得ましょう。\n自分のために使っていると疑われますよ";
            break;
        case 4:
            body += "あなたの役職は『§3霊媒師§r』\n";
            body += "\n§e能力\n§r『§dお札§r』を魂に対して使うことで死んだ人が人狼かどうかを確かめることができます。\nこれは最初から1つ所持しており、エメラルドで購入可能です。\n";
            body += "\n§a勝利条件\n§r人狼を全滅させること。\nみんなで協力して人狼を倒しましょう。\n";
            body += "\n§bアドバイス\n§rあなたは確定市民になりやすい役職です。必要に応じて市民たちに指示を出してあげましょう。\n";
            break;
        case 5:
            body += "あなたの役職は『§5占い師§r』\n";
            body += "\n§e能力\n§r『§d水晶玉§r』を使うことで任意の生存者1人が人狼かどうかを確かめることができます。\nこれは最初から1つ所持しており、エメラルドで購入可能です。\n";
            body += "\n§a勝利条件\n§r人狼を全滅させること。\nみんなで協力して人狼を倒しましょう。\n";
            body += "\n§bアドバイス\n§r市民たちの信用を勝ち取り、エメラルドを集めて占うことで人狼を見つけ出しましょう。\n";
            break;
    }
    form.body(body)
        .button1("他の役職の説明")
        .button2("戻る");
    let result = await form.show(player);
    if(result.canceled) return;
    if(result.selection == 1){
        form_check_all_role(player);
    }
    if(result.selection == 0){
        roleBook(player);
    }
}
const role_info ="§c~人狼陣営~\n§a勝利条件\n§r「市民陣営」の全滅\n"
    +"§4人狼\n§r占われると人狼であることがわかる。特に特殊な能力は持たないが、人狼専用のショップで強力なアイテムを購入することができる。\n"
    +"§7狂人\n§r人狼陣営の人間。占われても人狼でないと出る。最初は人狼が誰なのかわからないが、エメラルドを貯めると人狼を1人知ることができる。\n"
    +"\n§b~市民陣営~\n§a勝利条件\n§r「人狼」の全滅\n"
    +"§2市民\n§r何も能力を持たない普通の人間。\n"
    +"§3霊媒師\n§r人が死んだあとに出る魂に対してお札を使うことで人狼か否かを確かめることができる。最初から1枚所持しており、エメラルドで追加のお札を購入することができる。\n"
    +"§5占い師\n§r水晶玉を使うことで生きている人から1人選んで人狼かどうかを確かめることができる。最初から1個所持しており、エメラルドで追加の水晶玉を購入することができる。\n"

async function form_check_all_role(player){
    let form = new ui.MessageFormData()
        .title("役職一覧")
        .button1("閉じる")
        .button2("戻る")
        .body(role_info);
    let result = await form.show(player);
    if(result.canceled) return;
    if(result.selection == 0){
        form_check_role(player);
    }
}

function getCoin(player){
    let num = 0;
    const inv = player.getComponent("inventory").container;
    for(let i=0,n=0;i<inv.size||n==inv.size-inv.emptySlotsCount-1;i++){
        let item = inv.getItem(i);
        if(item==undefined) continue;
        if(item.typeId=="minecraft:emerald"){
            num+=item.amount;
        }
        n++;
    }

    return num;
}
/*
async function form_shop(player){
    let form = new ui.ActionFormData()
        .title(`§2§lショップ §r所持:§2§l${getCoin(player)}`)
        .body("文字色で区分されています\n§d役職固有アイテム\n§a全員共通アイテム");
    let itemList = new Array();
    itemList.push({id:0,name:"戻る"});
    const role = getScore(player,"role");
    switch(role){
        case 1:
            itemList.push(
                {id:1,name:"§d人狼の斧",cost:2,texture:"textures/items/stone_axe"},
                {id:2,name:"§d透明化のポーション",cost:4,texture:"textures/items/potion_bottle_invisibility"},
                {id:3,name:"§d煙幕",cost:1,texture:"textures/items/snowball"},
                {id:4,name:"§d魔法の地図",cost:4,texture:"textures/items/map_filled"}//give @s filled_map 1 2
            );
            break;
        case 2:
            itemList.push({id:5,name:"§d魔導書",cost:4,texture:"textures/items/book_writable"});
            break;
        case 3:
            break;
        case 4:
            itemList.push({id:6,name:"§dお札",cost:4,texture:"textures/items/banner_pattern"});
            break;
        case 5:
            itemList.push({id:7,name:"§d水晶玉",cost:4,texture:"textures/items/heartofthesea_closed"});
            break;
    }
    itemList.push(
        {id:8,name:"§a火薬のポーション",cost:2,texture:"textures/items/potion_bottle_splash"},
        {id:9,name:"§aスタングレネード",cost:4,texture:"textures/items/fireworks_charge"},
        {id:10,name:"§aスピードのポーション",cost:2,texture:"textures/items/potion_bottle_moveSpeed"},
        {id:11,name:"§a霊視",cost:3,texture:"textures/items/ender_eye"},
        {id:0,name:"戻る"}
    );
    for(let item of itemList){
        if(item.id==0){
            form.button(`§l${item.name}`);
            continue;
        }
        form.button(`§l${item.name} §r[§2${item.cost}エメラルド§r]`,(item.texture)?item.texture:undefined);
    }
    const result = await form.show(player);
    if(result.canceled) return;
    const item = itemList[result.selection];
    if(item.cost > getCoin(player)){
        player.sendMessage("§cエメラルドが足りません!");
        return;
    }else{
        runPlayer(player,`clear @s emerald 0 ${item.cost}`);
        let giveItem;
        switch(item.id){
            case 0:roleBook(player);
                return;
            case 1://runPlayer(player,`give @s altivelis:wolf_axe 1 0 {"keep_on_death": {}}`);
                giveItem=new mc.ItemStack("altivelis:wolf_axe",1);
                giveItem.keepOnDeath=true;
                break;
            case 2://runPlayer(player,`give @s altivelis:invisible_potion 1 0 {"keep_on_death": {}}`);
                giveItem=new mc.ItemStack("altivelis:invisible_potion",1);
                giveItem.keepOnDeath=true;
                break;
            case 3://runPlayer(player,`give @s altivelis:smoke 1 0 {"keep_on_death": {}}`);
                giveItem=new mc.ItemStack("altivelis:smoke",1);
                giveItem.keepOnDeath=true;
                break;
            case 4:
                runPlayer(player,`give @s filled_map 1 2 {"keep_on_death": {}}`);
                giveItem=null;
                break;
            case 5://runPlayer(player,`give @s altivelis:magicbook 1 0 {"keep_on_death": {},"item_lock":{"mode":"lock_in_inventory"}}`);
                giveItem=new mc.ItemStack("altivelis:magicbook",1);
                giveItem.keepOnDeath=true;
                giveItem.lockMode=mc.ItemLockMode.inventory;
                break;
            case 6://runPlayer(player,`give @s altivelis:ohuda 1 0 {"keep_on_death": {},"item_lock":{"mode":"lock_in_inventory"}}`);
                giveItem=new mc.ItemStack("altivelis:ohuda",1);
                giveItem.keepOnDeath=true;
                giveItem.lockMode=mc.ItemLockMode.inventory;
                break;
            case 7://runPlayer(player,`give @s altivelis:crystal 1 0 {"keep_on_death": {},"item_lock":{"mode":"lock_in_inventory"}}`);
                giveItem=new mc.ItemStack("altivelis:crystal",1);
                giveItem.keepOnDeath=true;
                giveItem.lockMode=mc.ItemLockMode.inventory;
                break;
            case 8://runPlayer(player,`give @s altivelis:death_splash 1 0`);
                giveItem=new mc.ItemStack("altivelis:death_splash",1);
                break;
            case 9://runPlayer(player,`give @s altivelis:stun_grenade 1 0`);
                giveItem=new mc.ItemStack("altivelis:stun_grenade",1);
                break;
            case 10://runPlayer(player,`give @s altivelis:speed_potion 1 0`);
                giveItem=new mc.ItemStack("altivelis:speed_potion",1);
                break;
            case 11://runPlayer(player,`give @s altivelis:clairvoyance 1 0`);
                giveItem=new mc.ItemStack("altivelis:clairvoyance",1);
                break;
        }
        if(giveItem){
            const inv = player.getComponent(mc.EntityInventoryComponent.componentId).container;
            inv.addItem(giveItem);
        }
        runPlayer(player,`playsound random.pop @s ~ ~ ~ 1 1 1`);
        mc.system.run(()=>{
            form_shop(player);
        })
    }
}
*/
async function form_shop(player){
    let form = new ui.ActionFormData()
        .title(`§2§lショップ §r所持:§2§l${getCoin(player)}`)
        .body("文字色で区分されています\n§d役職固有アイテム\n§a全員共通アイテム");
    let list = new Array();
    const role = getScore(player,"role");
    itemList.forEach((Element)=>{
        if(Element.role==0 || Element.role==role){
            list.push(Element);
        }
    });
    form.button("<<戻る<<");
    list.forEach((Element)=>{
        form.button(`§l${Element.name} §r[§2${Element.cost}エメラルド§r]`,Element.texture);
    });
    form.button("<<戻る<<");
    const result = await form.show(player);
    if(result.canceled) return;
    if(result.selection==0 || result.selection==list.length+1){
        roleBook(player);
        return;
    }
    const select = list[result.selection-1];
    if(select.cost>getCoin(player)){
        player.sendMessage("§cエメラルドが足りません!");
        return;
    }
    runPlayer(player,`clear @s emerald 0 ${select.cost}`);
    let giveItem = select.item.clone();
    if(giveItem.typeId=="minecraft:filled_map"){
        runPlayer(player,`give @s filled_map 1 2 {"keep_on_death": {}}`);
        player.playSound("random.pop",{location:player.location});
        form_shop(player);
        return;
    }
    giveItem.keepOnDeath=select.keep;
    if(giveItem.lock){
        giveItem.lockMode=mc.ItemLockMode.inventory;
    }
    giveItem.setLore(select.lore);
    const inv = player.getComponent(mc.EntityInventoryComponent.componentId).container;
    inv.addItem(giveItem);
    player.playSound("random.pop",{location:player.location});
    form_shop(player);
}
