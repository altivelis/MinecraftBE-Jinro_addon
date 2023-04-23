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
        .button("§2§lショップ")
        .button("§3§lヘルプ");
    
    const result = await form.show(player);
    if(result.canceled) return;
    switch(result.selection){
        case 0:
            form_check_role(player);
            break;
        case 1:
            form_shop(player);
            break;
        case 2:
            form_help(player);
            break;
    }
}
/**
 * 役職確認
 * @param {mc.Player} player 
 */
async function form_check_role(player){
    if(getScore("test","status")!=1){
        let form = new ui.MessageFormData()
            .title("待機中")
            .body("まだゲームは始まっていません。\nホストがゲームを開始するまでお待ちください。")
            .button1("役職の説明")
            .button2("戻る");
        let result = await form.show(player);
        if(result.canceled) return;
        if(result.selection == 1){
            form_check_all_role(player);
        }
        if(result.selection == 0){
            roleBook(player);
        }
        return;
    }
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
    let form = new ui.ActionFormData()
        .title("役職一覧")
        .body(role_info)
        .button("戻る");
    let result = await form.show(player);
    if(result.canceled) return;
    form_check_role(player);
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

/**
 * ショップ
 * @param {mc.Player} player
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

/**
 * ヘルプ
 * @param {mc.Player} player 
 */
async function form_help(player){
    const f_help = new ui.ActionFormData()
    .title("§l§aヘルプ")
    .button("§l§4人狼ゲームについて")
    .button("§l§3役職について")
    .button("§l§2アイテムについて")
    .button("§l§5占い・霊媒結果について");
    const res = await f_help.show(player);
    if(res.canceled)return;
    let res2;
    switch(res.selection){
        case 0:res2 = await f_help_game.show(player);break;
        case 1:res2 = await f_help_role.show(player);break;
        case 2:res2 = await f_help_item.show(player);break;
        case 3:res2 = await f_help_uranai.show(player);break;
    }
    if(res2.canceled)return;
    form_help(player);
}

const f_help_game = new ui.ActionFormData()
    .title("§l§4人狼ゲームについて")
    .body(
        "§l§a~概要~\n"
        +"§rマイクラで人狼をできるようにしたアドオンです。\n普通の人狼と違って投票がなく、自らの手で相手を倒す必要があります。\n"
        +"ゲームシステムは「〇〇の主役は我々だ!」さんのマイクラ人狼と「ワイテルズ」さんの人狼RPGを参考にさせていただいています。\n"
        +"\n§l§b~ルール~\n"
        +"§r・勝利条件\n人狼陣営:§l市民陣営§rの全滅\n市民陣営:§l人狼§rの全滅\n"
        +"・エメラルド\n一定時間ごとにエメラルドが配られます。\nエメラルドを使ってショップでアイテムを購入することができます。\n"
        +"エメラルドは人に渡すことができます。自分で使うだけでなく、みんなで集めることで強力なアイテムを早く手に入れることができます。\n"
        +"・弓\n当たればワンパンの弓です。\n撃つごとにクールダウンがあり、人に当てるとさらに長いクールダウンがあります。\n"
        +"ハンデを付けた人はクールダウンが増えたり、弓を引き絞り切らないとワンパンでなくなったりします。\n"
    )
    .button("<<戻る<<");

const f_help_role = new ui.ActionFormData()
    .title("§l§3役職について")
    .body(role_info)
    .button("<<戻る<<");

let itemStr="";
for(const e of itemList){
    itemStr += "§l" + e.name + ` §r[§2${e.cost}エメラルド§r]\n` + e.lore.join("\n") +"\n\n";
}

const f_help_item = new ui.ActionFormData()
    .title("§l§2アイテムについて")
    .body(itemStr)
    .button("<<戻る<<");

export const f_help_uranai = new ui.ActionFormData()
    .title("§l§5占い・霊媒結果について")
    .body(
        "§l§c人狼§rかどうかを確かめることができます。\n"
        +"狂人はわかりません。"
        +"人狼の場合は「§bOO§dは§4人狼です§r」\n"
        +"そうでない場合は「§bOO§dは§a人狼ではありません§r」\n"
        +"と出ます。"
    )
    .button("<<戻る<<");