import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

//霊界会話
mc.world.events.beforeChat.subscribe(data=>{
    const {message,sender} = data;
    if(message.startsWith(".")){
        data.cancel=true;
        const tagList = sender.getTags();
        const command = message.slice(1);
        switch(command){
            case "tp": tpSpectator(sender);return;
        }
    }
})

/**
 * 観戦者テレポートコマンド
 * @param {mc.Player} user
 */
function tpSpectator(user){
    let form = new ui.ActionFormData()
        .title("プレイヤーへテレポート");
    for(let player of mc.world.getPlayers({excludeTags:["death","spec"]}))
}