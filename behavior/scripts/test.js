import * as mc from '@minecraft/server';
import * as ui from '@minecraft/server-ui';

async function f_setHandi(player){
    let form = new ui.ModalFormData().title("ハンデ設定")
    const playerList = mc.world.getAllPlayers();
    for(const p of playerList){
        form.slider(p.nameTag,0,0,1)
        .toggle("矢の弱体化",p.hasTag("handi1"))
        .toggle("矢のクールダウン増加",p.hasTag("handi2"))
        .toggle("キルクールダウン",p.hasTag("handi3"));
    }
    const result = await form.show(player);
    if(result.canceled)return;
    result.formValues.forEach((value,index)=>{
        const target = playerList[Math.floor(index/4)];
        switch(index%4){
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
    })
}

async function f_setHandi(player){
    let form = new ui.ActionFormData().title("ハンデ設定");
    let playerList = getPlayerList();
    for(let p of playerList){
        form.button(`§0§l${p.nameTag}`);
    }
    const result = await form.show(player);
    if(result.canceled) return;
    const target = playerList[result.selection];
    let handi1 = target.hasTag("handi1");
    let handi2 = target.hasTag("handi2");
    form = new ui.ModalFormData().title(`ハンデ設定:${target.nameTag}`)
        .toggle("矢の弱体化",handi1)
        .toggle("矢のクールダウン増加",handi2);
    const result2 = await form.show(player);
    if(result2.formValues[0]){
        target.addTag("handi1");
        target.sendMessage(
            "§bハンデ:§e「矢の弱体化」§bが有効になりました\n"
            +"§3最大まで引き絞らないと致命傷になりません。\n"
            +"§3また、矢にばらつきが付与され、遠くの敵を狙うことが困難になりました。"
        )
    }else{
        runPlayer(target,`tag @s remove handi1`);
        runPlayer(target,`tellraw @s {"rawtext":[{"text":"§bハンデ:§e「矢の弱体化」§bが無効になりました"}]}`);
    }
    if(result2.formValues[1]){
        runPlayer(target,`tag @s add handi2`);
        runPlayer(target,`tellraw @s {"rawtext":[{"text":"§bハンデ:§e「矢のクールダウン増加」§bが有効になりました"}]}`);
        runPlayer(target,`tellraw @s {"rawtext":[{"text":"§3矢を再度放つことができるまでの時間が増加します。"}]}`);
    }else{
        runPlayer(target,`tag @s remove handi2`);
        runPlayer(target,`tellraw @s {"rawtext":[{"text":"§bハンデ:§e「矢のクールダウン増加」§bが無効になりました"}]}`);
    }
}
