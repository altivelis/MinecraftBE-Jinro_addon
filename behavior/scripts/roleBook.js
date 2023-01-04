import * as mc from '@minecraft/server';
import * as ui from '@minecraft/server-ui';
import { getScore } from './score';
import { getPlayerList } from './system';

/**
 * メニューを出す
 * @param {import('@minecraft/server').Player} player 
 * @returns 
 */
export async function roleBook(player){
    let form = new ui.ActionFormData().title("メニュー")
        .button("§5§l役職確認")
        .button("§2§lショップ");
    const role = getScore(player,"role");
    if(role){
        switch(role){
            case 1:form.button("§4§l人狼専用ショップ");break;
            case 2:form.button("§8§l狂人専用ショップ");break;
            case 4:form.button("§3§l霊媒師専用ショップ");break;
            case 5:form.button("§5§l占い師専用ショップ");break;
        }
    }
    
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
            form_role_shop(player);
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

async function form_check_all_role(player){
    let form = new ui.MessageFormData()
        .title("役職一覧")
        .button1("閉じる")
        .button2("戻る");
    let body = "";
    body+="§c~人狼陣営~\n§a勝利条件\n§r「市民陣営」の全滅\n";
    body+="§4人狼\n§r占われると人狼であることがわかる。特に特殊な能力は持たないが、人狼専用のショップで強力なアイテムを購入することができる。\n";
    body+="§7狂人\n§r人狼陣営の人間。占われても人狼でないと出る。最初は人狼が誰なのかわからないが、エメラルドを貯めると人狼を1人知ることができる。\n";
    body+="\n§b~市民陣営~\n§a勝利条件\n§r「人狼」の全滅\n";
    body+="§2市民\n§r何も能力を持たない普通の人間。\n"
    body+="§3霊媒師\n§r人が死んだあとに出る魂に対してお札を使うことで人狼か否かを確かめることができる。最初から1枚所持しており、エメラルドで追加のお札を購入することができる。\n";
    body+="§5占い師\n§r水晶玉を使うことで生きている人から1人選んで人狼かどうかを確かめることができる。最初から1個所持しており、エメラルドで追加の水晶玉を購入することができる。\n";
    form.body(body);
    let result = await form.show(player);
    if(result.canceled) return;
    if(result.selection == 0){
        form_check_role(player);
    }
}

function getCoin(player){
    let inventory = player.getComponent("inventory");
    let num = 0;
    for(let i=0;i<inventory.inventorySize;i++){
        let item = inventory.container.getItem(i);
        if(item.typeId=="minecraft:emerald"){
            num += item.amount;
        }
    }
    return num;
}

async function form_shop(player){
    let form = new ui.ActionFormData()
        .title("§2§lショップ")
}

async function form_role_shop(player){
    const role = getScore(player,"role");
    switch(role){
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
    }
}
