import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

//霊界会話
mc.world.beforeEvents.chatSend.subscribe(data=>{
    const {message,sender} = data;
    if(!sender.hasTag("death") && !sender.hasTag("spec"))return;
    if(message.startsWith(".")){
        data.cancel=true;
        const command = message.slice(1);
        switch(command){
            case "tp": 
                tpSpectator(sender);
                sender.sendMessage("§l§bチャットを閉じるとテレポートメニューが表示されます");
                return;
            default: sender.sendMessage("[!]無効なコマンドです");
        }
        return;
    }
    if(message.startsWith("!")){
        data.cancel=true;
        mc.world.sendMessage(`§l§b<${sender.nameTag}>§e`+message.slice(1));
        return;
    }
    data.cancel=true;
    let mess = `§l§7<${sender.nameTag}>§r§7`+message;
    for(let target of mc.world.getAllPlayers()){
        if(target.hasTag("spec") || target.hasTag("death")){
            target.sendMessage(mess);
        }
    }
})

/**
 * 観戦者テレポートコマンド
 * @param {mc.Player} user
 */
async function tpSpectator(user){
    let form = new ui.ActionFormData()
        .title("プレイヤーへテレポート");
    const playerList = mc.world.getPlayers({excludeTags:["death","spec"]});
    for(let player of playerList){
        form.button("§l§c"+player.nameTag);
    }
    const result = await form.show(user);
    if(result.canceled){
        if(result.cancelationReason=="userBusy"){
            mc.system.run(tpSpectator(user)); return;
        }else{
            return;
        }
    }
    let target = playerList[result.selection];
    user.teleport(target.location,target.dimension,target.getRotation().x,target.getRotation().y);
}